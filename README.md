# Bliss Tactile Symbol Designer (web)

Turn a prepped **Blissymbol SVG** into a finished, 3D-printable **tactile symbol** — right in your
browser. No OpenSCAD install, no command line. Runs in Chrome or Edge.

This tool combines two Volksswitch OpenSCAD programs — the *Bliss Tactile Symbols* designer and the
*Bliss Graphic STL maker* — into one. You bring an SVG; it produces the STL in a single step.

## Run it

1. Double-click **`server.bat`** — it starts a local server and opens the app in your browser
   (http://localhost:8000/app.html). A separate server window opens; close it to stop the server.
2. Click **Open SVG…** (or drag an SVG onto the viewport), adjust the settings on the left, and
   click **Export STL**.

> It must be served over http — opening `app.html` directly as a `file://` will not work.
> If nothing opens, make sure Python is installed and on your PATH.

## What it does

- Takes a **prepped** Blissymbol SVG (stroke-based line art) as direct input.
- **Auto-scales** the graphic from the SVG's stroke width — no more choosing a "type1/type2" scale
  factor by hand.
- Builds the full tactile symbol: grammatical top-edge shape, earth/sky lines, engraved text, ASCII
  Braille, string hole, RFID pocket, magnets, and Velcro recesses.
- Live 3D preview and one-click **STL export**.

## Preparing SVGs

The app expects an SVG that has already been prepared for tactile printing (thick strokes, closed
shapes, and enough spacing that elements don't merge when the stroke is fattened). That preparation
step is currently done outside this tool.

## License

Public domain (CC0) — Volksswitch, www.volksswitch.org.
