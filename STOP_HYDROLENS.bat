@echo off
REM =============================================
REM  Stop HydroLens Server
REM  This script stops all running Flask/Python servers
REM =============================================

echo.
echo ========================================
echo   Stopping HydroLens Server...
echo ========================================
echo.

REM Kill all Python processes running main.py
taskkill /F /FI "WINDOWTITLE eq HydroLens Server*" 2>nul

REM Alternative: Kill Flask processes by port
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo ========================================
echo   HydroLens Server Stopped
echo ========================================
echo.
echo All Flask servers on port 5000 have been stopped.
echo You can now close this window.
echo.

pause
