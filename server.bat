@echo off
REM Bliss Tactile Symbol Designer — start the local web server and open the app.
REM openscad-wasm and the File System Access API need a secure origin (localhost); file:// won't work.
REM On launch the app asks you to Open the folder holding the .scad, .json, and "SVG files".
cd /d "%~dp0"

echo Starting the Bliss Tactile Symbol Designer at http://localhost:8000/app.html
echo A separate server window will open — close it to stop the server.

REM Launch the web server in its own window (prefer "python", fall back to "py").
python --version >nul 2>nul
if %errorlevel%==0 (
    start "BTS Designer server  (close this window to stop)" python -m http.server 8000
) else (
    start "BTS Designer server  (close this window to stop)" py -m http.server 8000
)

REM Give the server a moment to come up, then open the app in the default browser.
timeout /t 1 /nobreak >nul
start "" "http://localhost:8000/app.html"
