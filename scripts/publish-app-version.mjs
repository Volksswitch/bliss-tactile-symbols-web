#!/usr/bin/env node
// publish-app-version.mjs — regenerate latest_app_version.json from app.html's
// APP_RELEASE. Trigger phrase: "publish app version".
//
// RELEASE-TIME ONLY. APP_RELEASE is pre-bumped on the dev copy (one ahead of
// public), so this manifest — exactly like sw.js's CACHE_NAME — must move only
// when you actually release. Run it during the release ritual, when APP_RELEASE
// already equals the version being deployed. Publishing it mid dev-cycle would
// advertise a release that isn't live and bounce users through a refresh loop
// (the in-app guard stops the loop, but they'd be stuck on the old build).
// Existing `notes` are preserved so a hand-written summary survives re-runs.

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));      // web-app repo root
const appPath = join(root, 'app.html');
const swPath  = join(root, 'sw.js');
const outPath = join(root, 'latest_app_version.json');

const app = readFileSync(appPath, 'utf8');
const m = app.match(/const\s+APP_RELEASE\s*=\s*(\d+)/);
if (!m) {
  console.error('ERROR: APP_RELEASE not found in app.html');
  process.exit(1);
}
const appRelease = parseInt(m[1], 10);

// Surface CACHE_NAME so the operator can confirm the release actually moved it.
let cacheName = '(not found)';
try {
  const c = readFileSync(swPath, 'utf8').match(/CACHE_NAME\s*=\s*['"]([^'"]+)['"]/);
  if (c) cacheName = c[1];
} catch { /* sw.js unreadable — leave placeholder */ }

let notes = 'Latest published Bliss Tactile Symbol Designer web app.';
try {
  const prev = JSON.parse(readFileSync(outPath, 'utf8'));
  if (prev && typeof prev.notes === 'string' && prev.notes.trim()) notes = prev.notes;
} catch { /* no prior file — use the default */ }

const manifest = { app_release: appRelease, notes };

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath}\n`);
console.log(JSON.stringify(manifest, null, 2));
console.log(`\n⚠ RELEASE-TIME ONLY — wrote app_release=${appRelease} (APP_RELEASE on this branch).`);
console.log(`   sw.js CACHE_NAME is "${cacheName}". Only commit this when ${appRelease}`);
console.log(`   is the release you are deploying. Do NOT run/commit it mid dev-cycle.`);
