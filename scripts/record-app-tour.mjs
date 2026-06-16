#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.resolve(process.env.SPORTTECH_APP_DIR || path.join(docsRoot, "..", "sporttech"));
const viewport = {
  width: Number(process.env.TOUR_WIDTH || 1600),
  height: Number(process.env.TOUR_HEIGHT || 1000),
};
const eventQuery = process.env.TOUR_EVENT_QUERY || "Deutsche Mannschafts-Meisterschaften";
const eventId = process.env.TOUR_EVENT_ID || "a7d7b89b-e777-47fc-7cf9-edc7165b290d";
const eventYear = process.env.TOUR_EVENT_YEAR || "2026";
const outputVideo = path.join(docsRoot, "static", "video", "sporttech-app-tour.mp4");
const outputPoster = path.join(docsRoot, "static", "img", "app", "sporttech-app-tour-poster.jpg");
const tmpRoot = path.join(docsRoot, ".tmp", "app-tour");
const runtimeDir = path.join(tmpRoot, "runtime");
const rawVideoDir = path.join(tmpRoot, "raw-video");
const DEFAULT_MOVE_MS = 900;
const DEFAULT_PAUSE_MS = 520;

async function main() {
  const chromePath = await resolveChromePath();
  await fs.rm(tmpRoot, { recursive: true, force: true });
  await fs.mkdir(rawVideoDir, { recursive: true });
  await fs.mkdir(path.dirname(outputVideo), { recursive: true });
  await fs.mkdir(path.dirname(outputPoster), { recursive: true });

  await runCommand("npm", ["--prefix", "ui", "run", "build"], { cwd: appRoot });

  const port = Number(process.env.TOUR_APP_PORT || await findOpenPort(5301));
  const appUrl = `http://127.0.0.1:${port}`;
  const server = spawn("node", [
    "src/server/ui-server.mjs",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--runtime-data-dir",
    runtimeDir,
  ], {
    cwd: appRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const serverLines = [];
  server.stdout.on("data", (chunk) => serverLines.push(chunk.toString()));
  server.stderr.on("data", (chunk) => serverLines.push(chunk.toString()));

  try {
    await waitForHealth(`${appUrl}/api/health`, server, serverLines);
    const rawVideoPath = await recordTour({ appUrl, chromePath });
    await convertVideo(rawVideoPath, outputVideo);
    await extractPoster(outputVideo, outputPoster);

    console.log(`Recorded app tour: ${path.relative(docsRoot, outputVideo)}`);
    console.log(`Poster frame: ${path.relative(docsRoot, outputPoster)}`);
  } finally {
    server.kill("SIGTERM");
  }
}

async function recordTour({ appUrl, chromePath }) {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      "--autoplay-policy=no-user-gesture-required",
      "--disable-dev-shm-usage",
      "--hide-scrollbars=false",
    ],
  });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    locale: "en-US",
    recordVideo: {
      dir: rawVideoDir,
      size: viewport,
    },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.on("pageerror", (error) => {
    console.warn(`Page error during recording: ${error.message}`);
  });

  await installTourCursor(page);
  await page.goto(`${appUrl}/#event`, { waitUntil: "networkidle" });
  await page.waitForSelector(".app-shell");
  await lockCaptureViewport(page);
  await initializeTourCursor(page, 260, 210);
  await wait(1100);

  await searchAndImportLiveEvent(page);
  const tourData = await selectTourData(page);
  await quickCheckTour(page, tourData);
  await produceTour(page, tourData);
  await wait(1200);

  const video = page.video();
  await context.close();
  await browser.close();
  return video.path();
}

async function searchAndImportLiveEvent(page) {
  const browserPanel = page.locator(".live-event-browser");
  await guidedFill(page, browserPanel.getByLabel("Search"), eventQuery);
  await wait(650);

  await guidedSelect(page, browserPanel.getByLabel("Year"), eventYear);
  await wait(550);

  const searchResponse = page.waitForResponse((response) => (
    response.url().includes("/api/import/live/events")
    && response.request().method() === "GET"
    && response.ok()
  ));
  await guidedClick(page, browserPanel.getByRole("button", { name: /Search Events/i }));
  await searchResponse;

  const eventButton = page.locator(".explore-event").filter({ hasText: eventQuery }).filter({ hasText: eventId }).first();
  const fallbackEventButton = page.locator(".explore-event").filter({ hasText: eventQuery }).first();
  const importTarget = await eventButton.count() ? eventButton : fallbackEventButton;
  await importTarget.waitFor({ state: "visible" });
  await wait(950);

  const importResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/import/live")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  await guidedClick(page, importTarget, { xRatio: 0.32 });
  await importResponse;
  await page.getByRole("heading", { name: "Check Event Readiness" }).waitFor({ timeout: 120000 });
  await page.locator(".quick-class-row").first().waitFor({ state: "visible" });
  await lockCaptureViewport(page);
  await wait(1900);
}

async function quickCheckTour(page, tourData) {
  const classScroll = page.locator(".quick-health-table-scroll").first();
  await guidedHover(page, classScroll);
  await scrollElement(page, ".quick-health-table-scroll", 620, 1100);
  await wait(850);
  await scrollElement(page, ".quick-health-table-scroll", -420, 900);
  await wait(750);

  const classRow = page.locator(".quick-class-row").filter({ hasText: tourData.groupLabel }).first();
  await guidedClick(page, classRow, { xRatio: 0.18, duration: 1050, pauseAfter: 650 });
  await page.locator(".quick-class-member-row").first().waitFor({ state: "visible" });
  await wait(1100);

  const memberList = page.locator(".quick-class-member-list").first();
  await guidedHover(page, memberList);
  await scrollElement(page, ".quick-health-table-scroll", 520, 1050);
  await wait(950);

  const selectedRow = page.locator(".quick-class-member-row").filter({ hasText: tourData.athleteLabel }).first();
  await guidedClick(page, await selectedRow.count() ? selectedRow : page.locator(".quick-class-member-row").nth(tourData.rowIndex), {
    duration: 1050,
    pauseAfter: 650,
  });
  await page.locator(".quick-check-detail-drawer").waitFor({ state: "visible" });
  await lockCaptureViewport(page);
  await wait(1200);

  const teamTab = page.locator(".quick-check-detail-drawer .tabs button").filter({ hasText: "Team" }).first();
  if (await teamTab.count()) {
    await guidedClick(page, teamTab, { duration: 950, pauseAfter: 650 });
    await page.locator(".team-detail-stack, .quick-check-detail-drawer .empty-state").first().waitFor({ state: "visible" });
    await wait(1100);
    await guidedHover(page, page.locator(".quick-check-detail-drawer .tab-body").first());
    await scrollElement(page, ".quick-check-detail-drawer .tab-body", 360, 900);
    await wait(950);
    const routineScore = page.locator(".routine-score-button").nth(2);
    if (await routineScore.count()) {
      await guidedClick(page, routineScore, { duration: 900, pauseAfter: 650 });
      await wait(950);
    }
  }

  const drawerToggle = page.locator(".quick-check-detail-drawer.open .drawer-toggle").first();
  if (await drawerToggle.count()) {
    await guidedClick(page, drawerToggle, { duration: 950, pauseAfter: 700, scroll: false });
  }
  await wait(1100);
}

async function produceTour(page, tourData) {
  await guidedClick(page, page.locator(".workflow-step").filter({ hasText: "Produce" }).first(), { duration: 1100, pauseAfter: 750 });
  await page.getByRole("heading", { name: "Produce Print PDFs" }).waitFor();
  await page.locator(".export-athlete-row").first().waitFor({ state: "visible" });
  await lockCaptureViewport(page);
  await wait(1500);

  const exportGroup = page.locator(".export-group").filter({ hasText: tourData.groupLabel }).first();
  await guidedHover(page, exportGroup);
  await scrollElement(page, ".export-scope-scroll", 420, 900);
  await wait(800);

  const targetCertificate = page.locator(".export-athlete-row").filter({ hasText: tourData.athleteLabel }).first();
  const certificateResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/export/pdf")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  await guidedClick(page, await targetCertificate.count() ? targetCertificate : page.locator(".export-athlete-row").first(), {
    duration: 1050,
    pauseAfter: 700,
  });
  await certificateResponse.catch(() => {});
  await page.locator(".preview-panel").filter({ hasText: "PDF Preview" }).waitFor({ state: "visible" });
  await wait(2600);

  const startListResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/export/class-list")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  await guidedClick(page, page.getByRole("button", { name: /Start List/i }).first(), { duration: 1000, pauseAfter: 750 });
  await startListResponse.catch(() => {});
  await wait(2600);

  const resultsResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/export/class-list")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  await guidedClick(page, page.getByRole("button", { name: /Results List/i }).first(), { duration: 1000, pauseAfter: 750 });
  await resultsResponse.catch(() => {});
  await wait(2600);
}

async function selectTourData(page) {
  const payload = await page.evaluate(async () => {
    const response = await fetch("/api/certificates");
    return response.json();
  });

  const groups = new Map();
  for (const row of payload.rows ?? []) {
    const groupId = row.groupId || `${row.classCode}|${row.className}`;
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        label: row.groupLabel || [row.classCode, row.className].filter(Boolean).join(" - "),
        rows: [],
      });
    }
    groups.get(groupId).rows.push(row);
  }

  const sortedGroups = [...groups.values()].sort((left, right) => {
    const leftTeamRows = left.rows.filter((row) => row.eventFormat === "team").length;
    const rightTeamRows = right.rows.filter((row) => row.eventFormat === "team").length;
    if (leftTeamRows !== rightTeamRows) {
      return rightTeamRows - leftTeamRows;
    }
    return right.rows.length - left.rows.length;
  });
  const group = sortedGroups[0];
  if (!group) {
    throw new Error("The imported live event did not produce any certificate groups.");
  }

  const rowIndex = Math.min(4, Math.max(0, group.rows.length - 1));
  const row = group.rows.find((candidate) => candidate.eventFormat === "team") ?? group.rows[rowIndex];
  return {
    athleteLabel: row.athlete || row.teamName || row.club || row.id,
    groupLabel: group.label,
    rowIndex,
  };
}

async function installTourCursor(page) {
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.id = "sporttech-tour-overlay-style";
    style.textContent = `
      html,
      body,
      #root {
        background: #07130c !important;
        height: 100% !important;
        margin: 0 !important;
        max-height: 100% !important;
        overflow: hidden !important;
        width: 100% !important;
      }

      .app-shell {
        contain: paint;
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }

      .sidebar {
        height: 100vh !important;
        max-height: 100vh !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }

      .workspace {
        height: 100vh !important;
        max-height: 100vh !important;
        overscroll-behavior: contain !important;
      }

      .quick-health-table-scroll,
      .export-scope-scroll,
      .preview-panel,
      .quick-check-detail-drawer .tab-body {
        overscroll-behavior: contain !important;
      }

      .tour-cursor {
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.45));
        height: 46px;
        left: 0;
        pointer-events: none;
        position: fixed;
        top: 0;
        transform: translate(-6px, -4px);
        width: 46px;
        z-index: 2147483647;
      }

      .tour-cursor svg {
        display: block;
        height: 100%;
        width: 100%;
      }

      .tour-click-pulse {
        animation: tour-click-pulse 720ms ease-out forwards;
        border: 4px solid rgba(14, 122, 157, 0.92);
        border-radius: 999px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.86);
        height: 18px;
        left: 0;
        pointer-events: none;
        position: fixed;
        top: 0;
        transform: translate(-50%, -50%);
        width: 18px;
        z-index: 2147483646;
      }

      @keyframes tour-click-pulse {
        from {
          opacity: 0.95;
          transform: translate(-50%, -50%) scale(0.45);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -50%) scale(3.2);
        }
      }
    `;

    function appendStyle() {
      if (!document.getElementById(style.id)) {
        const parent = document.head || document.documentElement;
        if (parent) {
          parent.append(style);
        }
      }
    }

    appendStyle();
    document.addEventListener("readystatechange", appendStyle);
    document.addEventListener("DOMContentLoaded", appendStyle, { once: true });
    window.addEventListener("load", appendStyle, { once: true });

    function ensureCursor() {
      appendStyle();
      let cursor = document.querySelector(".tour-cursor");
      if (!cursor) {
        cursor = document.createElement("div");
        cursor.className = "tour-cursor";
        cursor.innerHTML = `
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M6 3 25 18 15.7 19.1 12.1 28 6 3Z" fill="#10241b" stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="m15.6 18.7 5.6 8.8" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
            <path d="M7.9 7.1 21 17.4 14.3 18.1 11.8 24.4Z" fill="#8ed1a8" opacity="0.82"/>
          </svg>
        `;
        document.body.append(cursor);
      }
      return cursor;
    }

    window.__sporttechTourCursor = {
      move(x, y) {
        const cursor = ensureCursor();
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      },
      click(x, y) {
        const pulse = document.createElement("div");
        pulse.className = "tour-click-pulse";
        pulse.style.left = `${x}px`;
        pulse.style.top = `${y}px`;
        document.body.append(pulse);
        window.setTimeout(() => pulse.remove(), 560);
      },
    };
  });
}

async function initializeTourCursor(page, x, y) {
  await page.evaluate(({ x: nextX, y: nextY }) => {
    window.__sporttechTourCursor?.move(nextX, nextY);
  }, { x, y });
  await page.mouse.move(x, y);
}

async function guidedFill(page, locator, value) {
  await guidedClick(page, locator);
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type(value, { delay: 32 });
}

async function guidedSelect(page, locator, value) {
  await guidedClick(page, locator);
  await locator.selectOption(value);
}

async function guidedHover(page, locator) {
  const { x, y } = await locatorPoint(page, locator);
  await moveCursor(page, x, y, 650);
}

async function guidedClick(page, locator, options = {}) {
  const { x, y } = await locatorPoint(page, locator, options);
  await moveCursor(page, x, y, options.duration ?? DEFAULT_MOVE_MS);
  await page.mouse.down();
  await page.evaluate(({ x: clickX, y: clickY }) => {
    window.__sporttechTourCursor?.click(clickX, clickY);
  }, { x, y });
  await wait(130);
  await page.mouse.up();
  await wait(options.pauseAfter ?? DEFAULT_PAUSE_MS);
}

async function locatorPoint(page, locator, options = {}) {
  await locator.waitFor({ state: "visible" });
  let box = await locator.boundingBox();
  if (!isBoxInsideViewport(box) && options.scroll !== false) {
    await locator.scrollIntoViewIfNeeded();
    await lockCaptureViewport(page);
    await wait(120);
    box = await locator.boundingBox();
  }
  if (!box) {
    throw new Error("Could not resolve a visible target for the tour cursor.");
  }
  return {
    x: Math.round(box.x + box.width * (options.xRatio ?? 0.5)),
    y: Math.round(box.y + box.height * (options.yRatio ?? 0.5)),
  };
}

function isBoxInsideViewport(box) {
  if (!box) {
    return false;
  }
  return box.x >= 0
    && box.y >= 0
    && box.x + box.width <= viewport.width
    && box.y + box.height <= viewport.height;
}

async function moveCursor(page, targetX, targetY, duration) {
  const current = await page.evaluate(() => {
    const cursor = document.querySelector(".tour-cursor");
    return {
      x: Number.parseFloat(cursor?.style.left || "260") || 260,
      y: Number.parseFloat(cursor?.style.top || "210") || 210,
    };
  });
  const steps = Math.max(12, Math.round(duration / 16));
  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    const x = Math.round(current.x + (targetX - current.x) * eased);
    const y = Math.round(current.y + (targetY - current.y) * eased);
    await page.mouse.move(x, y);
    await page.evaluate(({ x: nextX, y: nextY }) => {
      window.__sporttechTourCursor?.move(nextX, nextY);
    }, { x, y });
    await wait(Math.max(4, Math.floor(duration / steps)));
  }
}

async function wheel(page, deltaX, deltaY) {
  await page.mouse.wheel(deltaX, deltaY);
  await wait(250);
}

async function scrollElement(page, selector, deltaY, duration = 900) {
  const steps = Math.max(12, Math.round(duration / 28));
  for (let index = 0; index < steps; index += 1) {
    await page.evaluate(({ targetSelector, stepY }) => {
      const element = document.querySelector(targetSelector);
      if (element) {
        element.scrollBy({ left: 0, top: stepY, behavior: "auto" });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, {
      targetSelector: selector,
      stepY: deltaY / steps,
    });
    await wait(Math.max(12, Math.floor(duration / steps)));
  }
  await lockCaptureViewport(page);
}

async function lockCaptureViewport(page) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  });
}

async function convertVideo(inputPath, outputPath) {
  await runCommand("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vf",
    `fps=30,scale=${viewport.width}:${viewport.height}:flags=lanczos`,
    "-an",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "24",
    "-preset",
    "medium",
    "-movflags",
    "+faststart",
    outputPath,
  ], { cwd: docsRoot });
}

async function extractPoster(inputPath, outputPath) {
  await runCommand("ffmpeg", [
    "-y",
    "-ss",
    "00:00:05",
    "-i",
    inputPath,
    "-frames:v",
    "1",
    "-q:v",
    "3",
    "-update",
    "1",
    outputPath,
  ], { cwd: docsRoot });
}

async function runCommand(command, args, options = {}) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: process.env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
      }
    });
  });
}

async function waitForHealth(url, server, serverLines) {
  const started = Date.now();
  while (Date.now() - started < 30000) {
    if (server.exitCode !== null) {
      throw new Error(`Sporttech UI server exited early.\n${serverLines.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry while the local server starts.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${url}.\n${serverLines.join("")}`);
}

async function findOpenPort(startPort) {
  for (let port = startPort; port < startPort + 60; port += 1) {
    if (await isPortOpen(port)) {
      return port;
    }
  }
  throw new Error(`No open port found from ${startPort} to ${startPort + 59}.`);
}

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}

async function resolveChromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    path.join(os.homedir(), "Applications", "Google Chrome.app", "Contents", "MacOS", "Google Chrome"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }

  throw new Error("Could not find Chrome. Set CHROME_PATH to a Chromium-compatible browser executable.");
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
