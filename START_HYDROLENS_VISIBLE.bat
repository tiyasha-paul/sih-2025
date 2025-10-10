@echo off
title HydroLens Launcher

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║     HydroLens - Groundwater Visualization     ║
echo ╚═══════════════════════════════════════════════╝
echo.

REM Check if we're in the right directory
if not exist "CHAT\main.py" (
    echo ERROR: Cannot find CHAT\main.py
    echo Please run this script from: d:\bin\sih-2025-main\
    echo.
    pause
    exit /b 1
)

echo [✓] Found CHAT\main.py
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [✗] ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [✓] Python is installed
python --version
echo.

REM Kill any existing Flask servers
echo [~] Stopping any existing servers...
taskkill /F /FI "WINDOWTITLE eq *HydroLens Server*" >nul 2>&1
timeout /t 1 >nul
echo [✓] Clean
echo.

echo [~] Starting Flask server...
echo     This will open in a NEW window
echo.

REM Change to CHAT directory and start server in a NEW visible window
cd /d "%~dp0CHAT"
start "HydroLens Server - KEEP THIS OPEN" cmd /k "python main.py --serve"

echo [✓] Server window opened
echo.

echo [~] Waiting 12 seconds for server to start...
echo     (Loading data, initializing FAISS index...)
timeout /t 12 /nobreak

echo.
echo [~] Opening browser...
start http://127.0.0.1:5000

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║              HydroLens Started!               ║
echo ╚═══════════════════════════════════════════════╝
echo.
echo ✓ Server window is open (titled "HydroLens Server")
echo ✓ Browser should open to http://127.0.0.1:5000
echo.
echo IMPORTANT: DO NOT CLOSE THE SERVER WINDOW!
echo            Keep it running while using HydroLens
echo.
echo To stop HydroLens:
echo   - Close the "HydroLens Server" window
echo   OR
echo   - Press Ctrl+C in the server window
echo.
echo You can close THIS window now (not the server window!)
echo.

pause
