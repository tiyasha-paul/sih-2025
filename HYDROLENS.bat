@echo off
REM =============================================
REM  HydroLens Auto-Launcher
REM  This script starts the server AND opens the browser automatically
REM =============================================

echo.
echo ========================================
echo   HydroLens - Starting...
echo ========================================
echo.

REM Change to the CHAT directory
cd /d "%~dp0CHAT"

REM Start the Flask server in a minimized window
echo [1/2] Starting Flask server...
start /min "HydroLens Server" python main.py --serve

REM Wait for server to start (8 seconds should be enough)
echo [2/2] Waiting for server to initialize...
timeout /t 8 /nobreak >nul

REM Open the default browser to the application
echo [3/3] Opening browser...
start http://127.0.0.1:5000

echo.
echo ========================================
echo   HydroLens is now running!
echo ========================================
echo.
echo The browser should open automatically.
echo If not, go to: http://127.0.0.1:5000
echo.
echo The server is running in a separate window.
echo To stop the server, close the "HydroLens Server" window
echo or press Ctrl+C in the server window.
echo.
echo You can close THIS window safely now.
echo ========================================
echo.

pause
