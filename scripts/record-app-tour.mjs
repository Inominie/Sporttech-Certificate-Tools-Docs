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
const tourKind = normalizeTourKind(process.env.TOUR_KIND || process.argv[2]);
const tourConfig = tourConfigForKind(tourKind);
const outputVideo = path.join(docsRoot, "static", "video", tourConfig.videoFilename);
const outputPoster = path.join(docsRoot, "static", "img", "app", tourConfig.posterFilename);
const tmpRoot = path.join(docsRoot, ".tmp", tourConfig.tmpName);
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
  if (tourKind === "template") {
    await seedLiveEvent(appUrl);
    return recordTemplateEditorTour({ appUrl, chromePath });
  }

  return recordWorkflowTour({ appUrl, chromePath });
}

async function recordBrowserVideo(chromePath, runSteps) {
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
  await runSteps(page);

  const video = page.video();
  await context.close();
  await browser.close();
  return video.path();
}

async function recordWorkflowTour({ appUrl, chromePath }) {
  return recordBrowserVideo(chromePath, async (page) => {
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
  });
}

async function recordTemplateEditorTour({ appUrl, chromePath }) {
  return recordBrowserVideo(chromePath, async (page) => {
    await page.goto(`${appUrl}/#quick-check`, { waitUntil: "networkidle" });
    await page.waitForSelector(".app-shell");
    await page.getByRole("heading", { name: "Check Event Readiness" }).waitFor({ timeout: 120000 });
    await page.locator(".quick-class-row").first().waitFor({ state: "visible" });
    await lockCaptureViewport(page);
    await initializeTourCursor(page, 260, 210);
    await wait(1300);

    await guidedClick(page, page.locator(".studio-launch").first(), { duration: 1100, pauseAfter: 850 });
    await page.locator(".template-page.studio-page").waitFor({ state: "visible" });
    await page.locator(".template-library-card").waitFor({ state: "visible" });
    await lockCaptureViewport(page);
    await wait(1200);

    await openStarterTemplate(page, "Starter Individual Certificate");
    await openStarterTemplate(page, "Starter Team Certificate");
    await openStarterTemplate(page, "Starter Synchronized Certificate");
    await openStarterTemplate(page, "Starter Individual Certificate");

    await demonstrateTemplateEditor(page);
    await wait(1200);
  });
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

async function seedLiveEvent(appUrl) {
  const params = new URLSearchParams({
    country: "",
    query: eventQuery,
    sport: "",
    status: "all",
    year: eventYear,
  });
  const searchResult = await fetchJson(`${appUrl}/api/import/live/events?${params}`);
  const events = searchResult.events ?? [];
  const event = events.find((candidate) => candidate.id === eventId)
    ?? events.find((candidate) => candidate.name?.includes(eventQuery))
    ?? events[0];

  if (!event?.eventUrl) {
    throw new Error(`Could not find a Sporttech event for "${eventQuery}" in ${eventYear}.`);
  }

  const importResult = await fetchJson(`${appUrl}/api/import/live`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      discipline: event.sportCode || "",
      eventInput: event.eventUrl,
    }),
  });

  if (!importResult.payload?.rows?.length) {
    throw new Error("The seeded live event did not produce certificate rows.");
  }
}

async function openStarterTemplate(page, templateName) {
  const row = page.locator(".template-library-row").filter({ hasText: templateName }).first();
  const activateResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/templates/activate")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  const previewResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/templates/preview-svg")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 15000 });

  await guidedClick(page, row.locator(".template-library-main").first(), { duration: 1050, pauseAfter: 650 });
  await activateResponse;
  await page.locator(".template-editor-card").waitFor({ state: "visible" });
  await page.locator(".studio-window-meta").filter({ hasText: templateName }).first().waitFor({ state: "visible" });
  await waitForTemplatePreview(page, previewResponse);
  await wait(1500);
}

async function demonstrateTemplateEditor(page) {
  const fixedTextForm = page.locator(".template-add-tools form").filter({ hasText: "Fixed text" }).first();
  await guidedFill(page, fixedTextForm.locator("input").first(), "Event host");
  await guidedClick(page, fixedTextForm.getByRole("button", { name: "Add Fixed Text" }), {
    duration: 900,
    pauseAfter: 650,
  });
  await page.locator(".field-inspector").filter({ hasText: "Selected fixed text" }).waitFor({ state: "visible" });
  await setInspectorTextGeometry(page, {
    x: 180,
    y: 76,
    fontSize: 14,
  });
  await guidedHover(page, page.locator(".template-static-text").filter({ hasText: "Event host" }).first());
  await wait(900);

  const placeholderForm = page.locator(".template-add-tools form").filter({ hasText: "Placeholder" }).first();
  await guidedSelectWithMenu(page, placeholderForm.locator("select").first(), "athlete.name", {
    pauseOpen: 1500,
    pauseAfter: 900,
  });
  await wait(1100);
  await guidedClick(page, placeholderForm.getByRole("button", { name: "Add Placeholder" }), {
    duration: 900,
    pauseAfter: 700,
  });
  await page.locator(".field-inspector").filter({ hasText: "Selected placeholder" }).waitFor({ state: "visible" });
  await setInspectorTextGeometry(page, {
    x: 420,
    y: 76,
    fontSize: 18,
  });
  await guidedHover(page, page.locator(".template-field").filter({ hasText: "athlete.name" }).first());
  await wait(900);

  const matchedDataField = page.locator(".field-inspector label").filter({ hasText: "Matched data field" }).locator("select").first();
  await guidedSelectWithMenu(page, matchedDataField, "athlete.club", {
    pauseOpen: 1500,
    pauseAfter: 900,
  });
  await guidedHover(page, page.locator(".field-inspector").first());
  await wait(1200);

  const realDataPreview = page.locator(".template-preview-mode").getByRole("button", { name: "Real Data" });
  const previewResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/templates/preview-svg")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 15000 });
  await guidedClick(page, realDataPreview, { duration: 950, pauseAfter: 700 });
  await waitForTemplatePreview(page, previewResponse);
  await wait(1400);

  await guidedClick(page, page.locator(".template-editor-actions").getByRole("button", { name: "Save Profile" }), {
    duration: 1000,
    pauseAfter: 700,
  });
  await page.locator(".template-save-dialog").waitFor({ state: "visible" });
  await wait(700);

  const saveResponse = page.waitForResponse((response) => (
    response.url().endsWith("/api/templates/profile")
    && response.request().method() === "POST"
    && response.ok()
  ), { timeout: 120000 });
  await guidedClick(page, page.getByRole("button", { name: "Overwrite Current" }).first(), {
    duration: 950,
    pauseAfter: 700,
  });
  await saveResponse;
  await page.locator(".template-save-dialog").waitFor({ state: "hidden", timeout: 120000 }).catch(() => {});
  await wait(900);

  await guidedClick(page, page.getByRole("button", { name: "Use in Competition App" }).first(), {
    duration: 1100,
    pauseAfter: 850,
  });
  await page.getByRole("heading", { name: "Produce Print PDFs" }).waitFor({ timeout: 120000 });
  await wait(1500);
}

async function setInspectorTextGeometry(page, { x, y, fontSize }) {
  const geometrySection = page.locator(".field-inspector .inspector-section[aria-label='Text geometry']").first();
  await geometrySection.waitFor({ state: "visible" });

  if (typeof x === "number") {
    await guidedFill(page, geometrySection.locator("label").filter({ hasText: /^X$/ }).locator("input").first(), String(x));
  }
  if (typeof y === "number") {
    await guidedFill(page, geometrySection.locator("label").filter({ hasText: /^Y$/ }).locator("input").first(), String(y));
  }
  if (typeof fontSize === "number") {
    await guidedFill(page, geometrySection.locator("label").filter({ hasText: "Font size" }).locator("input").first(), String(fontSize));
  }
}

async function waitForTemplatePreview(page, previewResponse) {
  await Promise.race([
    previewResponse.catch(() => {}),
    wait(2500),
  ]);
  await page.locator(".template-canvas").waitFor({ state: "visible" });
  await page.locator(".template-canvas-typst-preview, .template-field, .template-static-text").first().waitFor({
    state: "visible",
    timeout: 15000,
  });
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

      .tour-select-menu-preview {
        background: #ffffff;
        border: 1px solid rgba(30, 53, 39, 0.22);
        border-radius: 8px;
        box-shadow: 0 18px 44px rgba(12, 25, 17, 0.24);
        color: #16251b;
        font: 600 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        left: 0;
        max-width: 420px;
        overflow: hidden;
        pointer-events: none;
        position: fixed;
        top: 0;
        width: 360px;
        z-index: 2147483645;
      }

      .tour-select-menu-preview-group {
        background: #eef5ec;
        border-bottom: 1px solid rgba(30, 53, 39, 0.12);
        color: #536457;
        font-size: 11px;
        letter-spacing: 0.04em;
        padding: 7px 10px;
        text-transform: uppercase;
      }

      .tour-select-menu-preview-option {
        border-bottom: 1px solid rgba(30, 53, 39, 0.08);
        padding: 8px 10px;
        white-space: normal;
      }

      .tour-select-menu-preview-option:last-child {
        border-bottom: 0;
      }

      .tour-select-menu-preview-option.active {
        background: #dff0e4;
        color: #123923;
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

async function guidedSelectWithMenu(page, locator, value, options = {}) {
  await guidedClick(page, locator, {
    duration: options.duration ?? DEFAULT_MOVE_MS,
    pauseAfter: 180,
  });
  await showSelectMenuPreview(page, locator, value);
  await wait(options.pauseOpen ?? 1200);
  await locator.selectOption(value);
  await hideSelectMenuPreview(page);
  await wait(options.pauseAfter ?? DEFAULT_PAUSE_MS);
}

async function guidedHover(page, locator) {
  const { x, y } = await locatorPoint(page, locator);
  await moveCursor(page, x, y, 650);
}

async function showSelectMenuPreview(page, locator, value) {
  await locator.waitFor({ state: "visible" });
  const box = await locator.boundingBox();
  if (!box) {
    return;
  }

  const menu = await locator.evaluate((select, selectedValue) => {
    const allOptions = Array.from(select.options).map((option, index) => ({
      group: option.parentElement?.tagName === "OPTGROUP" ? option.parentElement.label : "",
      index,
      label: option.label || option.textContent || option.value,
      selected: option.value === selectedValue,
      value: option.value,
    }));
    const selectedIndex = Math.max(0, allOptions.findIndex((option) => option.selected));
    const start = Math.max(0, Math.min(selectedIndex - 2, allOptions.length - 6));
    const visibleOptions = allOptions.slice(start, start + 6);
    const selectedOption = allOptions[selectedIndex] ?? visibleOptions[0];
    return {
      group: selectedOption?.group || "",
      options: visibleOptions,
      value: selectedValue,
    };
  }, value);

  await page.evaluate(({ box: selectBox, menu: menuData }) => {
    document.querySelector(".tour-select-menu-preview")?.remove();
    const menuElement = document.createElement("div");
    menuElement.className = "tour-select-menu-preview";
    const width = Math.min(420, Math.max(320, selectBox.width));
    const left = Math.min(window.innerWidth - width - 16, Math.max(16, selectBox.x));
    const top = Math.min(window.innerHeight - 260, selectBox.y + selectBox.height + 6);
    menuElement.style.left = `${left}px`;
    menuElement.style.top = `${Math.max(16, top)}px`;
    menuElement.style.width = `${width}px`;
    if (menuData.group) {
      const groupElement = document.createElement("div");
      groupElement.className = "tour-select-menu-preview-group";
      groupElement.textContent = menuData.group;
      menuElement.append(groupElement);
    }
    for (const option of menuData.options) {
      const optionElement = document.createElement("div");
      optionElement.className = `tour-select-menu-preview-option${option.value === menuData.value ? " active" : ""}`;
      optionElement.textContent = option.label;
      menuElement.append(optionElement);
    }
    document.body.append(menuElement);
  }, { box, menu });
}

async function hideSelectMenuPreview(page) {
  await page.evaluate(() => {
    document.querySelector(".tour-select-menu-preview")?.remove();
  });
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

function normalizeTourKind(value) {
  const normalized = String(value || "workflow").trim().toLowerCase();
  if (["template", "template-editor", "studio"].includes(normalized)) {
    return "template";
  }
  if (["workflow", "app", "main"].includes(normalized)) {
    return "workflow";
  }
  throw new Error(`Unknown tour kind "${value}". Use "workflow" or "template".`);
}

function tourConfigForKind(kind) {
  if (kind === "template") {
    return {
      posterFilename: "sporttech-template-editor-tour-poster.jpg",
      tmpName: "template-editor-tour",
      videoFilename: "sporttech-template-editor-tour.mp4",
    };
  }

  return {
    posterFilename: "sporttech-app-tour-poster.jpg",
    tmpName: "app-tour",
    videoFilename: "sporttech-app-tour.mp4",
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`${url} failed with HTTP ${response.status}: ${bodyText}`);
  }
  return bodyText ? JSON.parse(bodyText) : {};
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
