# Changelog — Bliss Tactile Symbol Designer web app

User-facing changes, newest first. Each bullet is written the way a user reads it
(not engineering language). This file is the single source of truth for the in-app
"What's new" notice — after any edit here, regenerate the bundled notes with
`node scripts/apply-release-notes.mjs`. See RELEASING.md for the full process.

## Unreleased (next release)

- A button bar under the 3D view. The view buttons have moved out of the corner of
  the 3D view into a bar along the bottom, and are half again as large. Next to them
  are buttons to export the STL and to save a picture of the 3D view as a PNG file,
  both saved into your folder. The Export STL button stays lit while the export runs
  and chimes when it finishes.
- A Settings panel. The gear button at the right-hand end of the button bar opens
  Settings, which starts with an About tab showing the app release, the version of
  the symbol designer program in your folder, the license, and where the tool comes
  from. More settings will be added here over time.
- The grey title bar at the top of the page is gone, giving the 3D view more room.
  The app release number it used to show now lives in Settings → About.

## Release 3

- You can now install the designer as an app. In Chrome or Edge an install button
  appears at the right-hand end of the address bar; installing gives it its own
  window and a desktop/Start-menu icon, with no browser tabs or address bar. It is
  the same app either way — your folder, concepts and files are unchanged.

## Release 2

- The app keeps your symbol designer file up to date. When you open your folder, if a
  newer version of the symbol designer program has been published, the app offers to
  download it and replace your local copy — keeping your saved concepts. You can update
  now, be reminded in a week, or skip. The notice lists what changed so you can decide.

## Release 1

- First release of the Bliss Tactile Symbol Designer web app. Turn a prepped
  Blissymbol SVG into a finished, 3D-printable tactile symbol STL entirely in
  Chrome or Edge — no OpenSCAD install and no command line.
