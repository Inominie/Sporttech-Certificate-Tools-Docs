#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = path.join(ROOT, "static", "updates", "beta.json");
const UPDATE_SCHEMA_VERSION = 1;
const UPDATE_PRODUCT = "sporttech-certificate-tools";
const UPDATE_CHANNEL = "beta";
const MAX_MANIFEST_BYTES = 64 * 1024;
const FULL_GIT_SHA_PATTERN = /^[0-9a-f]{40}$/;
const ISO_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const DECIMAL_ID_PATTERN = /^\d+$/;
const DISALLOWED_MANIFEST_FIELDS = new Set([
  "authenticationToken",
  "critical",
  "downloadUrl",
  "dmgUrl",
  "forceUpdate",
  "installerUrl",
  "minimumSupportedVersion",
  "platformCommands",
  "releaseApiUrl",
  "releaseNotesHtml",
  "remoteMessage",
]);

const stat = await fs.stat(MANIFEST_PATH);
if (stat.size > MAX_MANIFEST_BYTES) {
  throw new Error(`Update manifest is too large: ${stat.size} bytes.`);
}

let rawManifest;
try {
  rawManifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
} catch (error) {
  throw new Error(`Update manifest is not valid JSON: ${error.message}`);
}

validateUpdateManifest(rawManifest);
console.log("update manifest validation passed");

function validateUpdateManifest(value) {
  const manifest = requirePlainObject(value, "Update manifest must be an object.");
  rejectDisallowedFields(manifest);

  if (manifest.schemaVersion !== UPDATE_SCHEMA_VERSION) {
    throw new Error("Unsupported update manifest schema version.");
  }
  if (manifest.product !== UPDATE_PRODUCT) {
    throw new Error("Update manifest product does not match the app.");
  }
  if (manifest.channel !== UPDATE_CHANNEL) {
    throw new Error("Update manifest channel must be beta.");
  }

  const latest = requirePlainObject(manifest.latest, "Update manifest latest release must be an object.");
  rejectDisallowedFields(latest);
  normalizeSemver(latest.version);
  normalizeBuildNumber(latest.buildNumber, "latest.buildNumber");
  normalizeDecimalId(latest.buildId, "latest.buildId");
  normalizeUtcTimestamp(latest.publishedAt, "latest.publishedAt");
  normalizeFullCommit(latest.commit, "latest.commit");
}

function requirePlainObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

function rejectDisallowedFields(value) {
  for (const field of Object.keys(value)) {
    if (DISALLOWED_MANIFEST_FIELDS.has(field)) {
      throw new Error(`Update manifest must not include ${field}.`);
    }
  }
}

function normalizeSemver(value) {
  if (typeof value !== "string" || !parseSemver(value)) {
    throw new Error(`Update manifest version is invalid: ${value}`);
  }
}

function normalizeBuildNumber(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a safe non-negative integer.`);
  }
}

function normalizeDecimalId(value, label) {
  if (typeof value !== "string" || !DECIMAL_ID_PATTERN.test(value)) {
    throw new Error(`${label} must be a decimal identifier.`);
  }
}

function normalizeUtcTimestamp(value, label) {
  if (typeof value !== "string" || !ISO_UTC_PATTERN.test(value)) {
    throw new Error(`${label} must be an ISO UTC timestamp.`);
  }
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error(`${label} must be a valid ISO UTC timestamp.`);
  }
}

function normalizeFullCommit(value, label) {
  if (typeof value !== "string" || !FULL_GIT_SHA_PATTERN.test(value)) {
    throw new Error(`${label} must be a full 40-character git commit SHA.`);
  }
}

function parseSemver(value) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/.test(value);
}
