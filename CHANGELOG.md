# Changelog — Bliss Tactile Symbol Designer web app

User-facing changes, newest first. Each bullet is written the way a user reads it
(not engineering language). This file is the single source of truth for the in-app
"What's new" notice — after any edit here, regenerate the bundled notes with
`node scripts/apply-release-notes.mjs`. See RELEASING.md for the full process.

## Unreleased (next release)

## Release 6

- Build your own graphics from existing ones. A new Create button (next to
  Settings, below the viewport) opens a dialog where you can string existing Bliss
  graphics together left to right — for example "1" then "0" to make "10" — and
  optionally place a plural mark (×) over any one of them. The result is drawn in
  2D as you build it, with the Bliss guidelines shown for reference; give it a name
  and save it, and it drops into your SVG files folder so you can pick it in
  Graphic File just like the graphics that came with the app.

- Concepts no longer inherit settings from each other. Choosing a concept now sets
  every setting, not just the ones that concept saved: anything it doesn't mention
  goes back to the symbol designer file's default instead of keeping the value left
  behind by the concept you had open before. A concept now looks the same however
  you arrive at it. (Most of the supplied concepts don't save every setting, so this
  is noticeable — switching between them no longer carries over things like the
  velcro mounts, the earth and sky lines, or where the braille sits.)

- A known starting point in the Concepts list. The list now opens with "design
  default values", the same entry the desktop Customizer offers. Choosing it sets
  every setting back to the symbol designer file's own defaults and clears the
  graphic, so you can start a new concept from a known place instead of from
  whatever the last concept left behind. It is built in rather than saved in your
  concepts file, so it is always there and cannot be renamed, deleted, or saved
  over — pressing Save after choosing it asks for a name for a new concept.

## Release 5

- Two-colour printing. A second, multi-coloured STL button in the button bar saves
  the symbol as two files — "<name> - body.stl" and "<name> - graphic.stl" — so the
  raised graphic can be printed in a different colour from the body. In your slicer,
  load the body file first, then right-click it and choose Add Part → Load… and pick
  the graphic file — it drops into place at the right height automatically, and you
  can then give each part its own filament (or use a filament change part-way through
  the print). Load the body first: opening both files together puts the graphic in
  the wrong place. The original single-file STL button is unchanged.

## Release 4

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
