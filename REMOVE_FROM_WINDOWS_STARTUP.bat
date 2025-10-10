@echo off
REM =============================================
REM  Remove HydroLens from Windows Startup
REM =============================================

echo.
echo ========================================
echo   Removing HydroLens from Startup...
echo ========================================
echo.

REM Get the startup folder path
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

REM Delete the shortcut
del "%STARTUP%\HydroLens.lnk" 2>nul

if exist "%STARTUP%\HydroLens.lnk" (
    echo.
    echo ERROR: Could not remove shortcut.
    echo Please delete manually from:
    echo %STARTUP%\HydroLens.lnk
    echo.
) else (
    echo.
    echo ========================================
    echo   Removed from Windows Startup!
    echo ========================================
    echo.
    echo HydroLens will no longer start automatically.
    echo You can still run it manually using HYDROLENS.bat
    echo.
)

pause
