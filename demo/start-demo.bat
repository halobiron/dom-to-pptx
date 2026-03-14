@echo off
echo Starting DOM to PPTX Demo Server...
echo.
echo Demo will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo Python not found. Please install Python or use a different server.
    echo You can also open index.html directly in your browser.
    pause
)
