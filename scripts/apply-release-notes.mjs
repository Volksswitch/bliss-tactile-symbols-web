#!/usr/bin/env node
// apply-release-notes.mjs — regenerate the bundled RELEASE_NOTES block in
// app.html from CHANGELOG.md. Trigger phrase: "apply release notes".
//
// CHANGELOG.md is the single source of truth for user-facing notes. The app
// shows a "What's new" notice after it silently auto-updates, and those notes
// are BUNDLED in app.html (not fetched) so the notice works on locked-down
// networks. This script parses CHANGELOG.md and injects a
// `const RELEASE_NOTES = {…}` object (keyed by release number) between the
// @@RELEASE_NOTES_START@@ / _END@@ markers.
//
// Mapping:
//   "## Release N"                → key N        (a shipped release)
//   "## Unreleased (next release)" → key APP_RELEASE  (so a dev build can preview
//                                                      the pending notes)
// Bullets are every "- …" line under a heading (### subheads are flattened);
// markdown emphasis (**bold**, `code`) is stripped to plain text since the modal
// renders with textContent. Italic-only placeholders (_Nothing yet._) are skipped.

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));   // web-app repo root
const appPath = join(root, 'app.html');
const changelogPath = join(root, 'CHANGELOG.md');

const app = readFileSync(appPath, 'utf8');
const appReleaseMatch = app.match(/const\s+APP_RELEASE\s*=\s*(\d+)/);
if (!appReleaseMatch) {
  console.error('ERROR: APP_RELEASE not found in app.html');
  process.exit(1);
}
const APP_RELEASE = parseInt(appReleaseMatch[1], 10);

const START = '// @@RELEASE_NOTES_START@@';
const END = '// @@RELEASE_NOTES_END@@';
if (!app.includes(START) || !app.includes(END)) {
  console.error(`ERROR: RELEASE_NOTES markers not found in app.html (${START} / ${END})`);
  process.exit(1);
}

// ---- parse CHANGELOG.md -------------------------------------------------------
// Strip markdown emphasis to plain text (the modal renders with textContent).
// Protect backslash-escaped punctuation (e.g. "STL\*") so it survives as a
// literal, using private-use sentinels that can't appear in the source.
const SH_STAR = '', SH_TICK = '';
const clean = (s) => s
  .replace(/\\\*/g, SH_STAR).replace(/\\`/g, SH_TICK)   // shield escaped * and `
  .replace(/\*\*(.*?)\*\*/g, '$1')                      // **bold**
  .replace(/\*(.*?)\*/g, '$1')                          // *italic*
  .replace(/`/g, '')                                    // `code`
  .replace(new RegExp(SH_STAR, 'g'), '*')               // restore literals
  .replace(new RegExp(SH_TICK, 'g'), '`')
  .trim();

const notes = {};                 // { releaseNumber: [bullet, …] }
let key = null;                   // current release number, or null to ignore
let lastArr = null;               // array we're appending bullets to (for wrapping)

for (const raw of readFileSync(changelogPath, 'utf8').split('\n')) {
  const line = raw.replace(/\s+$/, '');
  let m;
  if ((m = line.match(/^##\s+Release\s+(\d+)/i))) {
    key = parseInt(m[1], 10); notes[key] = notes[key] || []; lastArr = notes[key];
    delete lastArr.__skip; continue;   // a real release heading — clear any stale placeholder flag
  }
  if (/^##\s+Unreleased\b/i.test(line)) {
    key = APP_RELEASE; notes[key] = notes[key] || []; lastArr = notes[key];
    delete lastArr.__skip; continue;
  }
  if (/^##\s+/.test(line)) { key = null; lastArr = null; continue; }   // some other H2 → ignore
  if (/^###\s+/.test(line)) continue;                                  // subheader → keep current key
  if (key == null) continue;

  const bullet = line.match(/^\s*-\s+(.*)$/);
  if (bullet) {
    const text = clean(bullet[1]);
    if (text && !/^_.*_$/.test(text)) lastArr.push(text);   // skip _Nothing yet._ / _In development._
    else lastArr.__skip = true;                              // remember placeholder so wraps don't attach
  } else if (line.trim() && lastArr && lastArr.length && !lastArr.__skip) {
    lastArr[lastArr.length - 1] += ' ' + clean(line);        // wrapped continuation of previous bullet
  }
}

// Drop empty release keys (heading with only a placeholder).
for (const k of Object.keys(notes)) {
  delete notes[k].__skip;
  if (!notes[k].length) delete notes[k];
}

// ---- inject -------------------------------------------------------------------
const body = `const RELEASE_NOTES = ${JSON.stringify(notes, null, 2)};`;
const block = `${START}\n${body}\n${END}`;
const re = new RegExp(`${START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
writeFileSync(appPath, app.replace(re, block));

const keys = Object.keys(notes).map(Number).sort((a, b) => b - a);
console.log(`Wrote RELEASE_NOTES to app.html — ${keys.length} release(s): ${keys.join(', ')}`);
console.log(`(APP_RELEASE=${APP_RELEASE}; "## Unreleased" mapped to ${APP_RELEASE} if it had bullets.)`);
