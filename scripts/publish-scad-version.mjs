#!/usr/bin/env node
// publish-scad-version.mjs — regenerate latest_scad_version.json from the
// canonical "Bliss Tactile Symbols.scad" in this repo. Trigger phrase:
// "publish scad version".
//
// Reads `scad_version = N;` from the .scad and writes the manifest the web app
// fetches to offer users an in-app update of their local .scad. The `notes` shown
// in the update dialog come VERBATIM from SCAD-CHANGELOG.md — from "## Version N"
// if it has been renamed at release, else from "## Unreleased (next version)".
// Missing / placeholder-only notes are a hard error: never advertise a version
// whose user notes haven't been written yet.
//
// Run at PUBLISH time — when the .scad in this repo is the one you are pushing to
// main (the same repo that hosts the app; GitHub Pages / raw both serve it).

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));   // repo root
const SCAD_NAME = 'Bliss Tactile Symbols.scad';
const scadPath      = join(root, SCAD_NAME);
const changelogPath = join(root, 'SCAD-CHANGELOG.md');
const outPath       = join(root, 'latest_scad_version.json');

// Keep in lockstep with APP_REPO in app.html — this is the raw download URL the
// update mechanism fetches (spaces URL-encoded).
const APP_REPO = 'Volksswitch/bliss-tactile-symbols-web';
const scadUrl = `https://raw.githubusercontent.com/${APP_REPO}/main/${encodeURIComponent(SCAD_NAME)}`;

const scad = readFileSync(scadPath, 'utf8');
const m = scad.match(/scad_version\s*=\s*(\d+)/);
if (!m) {
  console.error(`ERROR: scad_version not found in ${scadPath}`);
  process.exit(1);
}
const version = parseInt(m[1], 10);

const notes = extractChangelogBullets(readFileSync(changelogPath, 'utf8'), version);
if (notes.length === 0) {
  console.error(`ERROR: no "## Version ${version}" or "## Unreleased (next version)" section with`);
  console.error(`real bullet points found in ${changelogPath}. Write the user-visible changes for`);
  console.error(`v${version} there first (the "_Nothing yet._" placeholder does not count).`);
  process.exit(1);
}

const manifest = {
  version,
  scad_filename: SCAD_NAME,
  scad_url: scadUrl,
  notes,
};

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${outPath}\n`);
console.log(JSON.stringify(manifest, null, 2));
console.log(`\nNext: commit & push latest_scad_version.json AND ${SCAD_NAME} to main,`);
console.log(`and make sure the .scad on main is the v${version} this manifest names.`);

// Bullets for this version: from "## Version N" if that heading exists (renamed
// at release), otherwise from "## Unreleased (next version)". Italic-only
// placeholders (e.g. "_Nothing yet._") are skipped.
function extractChangelogBullets(changelog, version) {
  const fromVersion = bulletsUnder(changelog, (line) => {
    const h = line.match(/^##\s+Version\s+(\d+)/i);
    return h && parseInt(h[1], 10) === version;
  });
  if (fromVersion.length) return fromVersion;
  return bulletsUnder(changelog, (line) => /^##\s+Unreleased\b/i.test(line));
}

// Collects bullet lines under the first heading `headingMatches` accepts, up to
// the next "## " heading, trimmed of their leading marker. Placeholder-only
// (_italic_) bullets are skipped. Wrapped continuation lines are joined.
function bulletsUnder(changelog, headingMatches) {
  const bullets = [];
  let inSection = false;
  for (const raw of changelog.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (/^##\s+/.test(line)) {
      if (inSection) break;                       // hit the next section — done
      inSection = headingMatches(line);
      continue;
    }
    if (!inSection) continue;
    const b = line.match(/^\s*[-*]\s+(.*\S)\s*$/);
    if (b) {
      if (!/^_.*_$/.test(b[1].trim())) bullets.push(b[1].trim());
    } else if (line.trim() && bullets.length) {
      bullets[bullets.length - 1] += ' ' + line.trim();   // wrapped continuation
    }
  }
  return bullets;
}
