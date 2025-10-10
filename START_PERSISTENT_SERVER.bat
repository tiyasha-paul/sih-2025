@echo off
REM =============================================
REM Start HydroLens Server as Persistent Background Service
REM This keeps the server running until manually stopped
REM =============================================

title HydroLens Persistent Server

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║     HydroLens - Persistent Server Mode        ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Check if server is already running
netstat -ano | find ":5000" | find "LISTENING" >nul 2>&1

if %errorlevel% equ 0 (
    echo [!] Server is already running on port 5000
    echo.
    echo     Go to: http://127.0.0.1:5000
    echo.
    pause
    exit /b 0
)

echo [~] Starting Flask server in persistent mode...
echo.

cd /d "%~dp0CHAT"

echo ========================================
echo   Server is now RUNNING
echo ========================================
echo.
echo ✓ Access HydroLens at: http://127.0.0.1:5000
echo ✓ Open index.html or chat.html in your browser
echo ✓ Server will auto-detect and stay active
echo.
echo KEEP THIS WINDOW OPEN while using HydroLens!
echo.
echo To stop the server:
echo   - Close this window
echo   OR
echo   - Press Ctrl+C
echo.
echo ========================================
echo.

REM Start server (this will block until stopped)
python main.py --serve

echo.
echo Server stopped.
pause
