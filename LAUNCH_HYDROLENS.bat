@echo off
title HydroLens Launcher

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║         HydroLens - Quick Launcher            ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Kill any existing Python servers
taskkill /F /IM python.exe >nul 2>&1
timeout /t 1 >nul

echo [1/3] Starting Flask server...
cd /d "%~dp0CHAT"
start /min "HydroLens Server" cmd /k python main.py --serve

echo [2/3] Waiting for server to start...
timeout /t 10 /nobreak >nul

echo [3/3] Opening browser...
start "" "http://127.0.0.1:5000"

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║         HydroLens is Running!                 ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo ✓ Server started in background
echo ✓ Browser opened to: http://127.0.0.1:5000
echo ✓ Access chat at: http://127.0.0.1:5000/chat.html
echo.
echo To stop the server:
echo   - Run: STOP_HYDROLENS.bat
echo   OR
echo   - Close the "HydroLens Server" window
echo.
echo You can close THIS window now.
echo.

pause
