@echo off
REM =============================================
REM Auto-Start Server (Called by HTML pages)
REM Checks if server is running, starts if not
REM =============================================

REM Check if port 5000 is in use
netstat -ano | find ":5000" | find "LISTENING" >nul 2>&1

if %errorlevel% equ 0 (
    REM Server is already running
    exit /b 0
) else (
    REM Server not running, start it
    cd /d "%~dp0CHAT"
    start /min "" python main.py --serve
    exit /b 0
)
