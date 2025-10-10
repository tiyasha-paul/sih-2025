@echo off
REM =============================================
REM  Add HydroLens to Windows Startup
REM  This will make HydroLens start automatically when Windows boots
REM =============================================

echo.
echo ========================================
echo   Add HydroLens to Windows Startup?
echo ========================================
echo.
echo This will make HydroLens start automatically
echo every time you log into Windows.
echo.
echo Press any key to continue, or Ctrl+C to cancel...
pause >nul

REM Get the startup folder path
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

REM Create VBScript to make the shortcut in Startup folder
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateStartupShortcut.vbs
echo sLinkFile = "%STARTUP%\HydroLens Server.lnk" >> CreateStartupShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateStartupShortcut.vbs
echo oLink.TargetPath = "%~dp0server-autostart.vbs" >> CreateStartupShortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> CreateStartupShortcut.vbs
echo oLink.Description = "HydroLens Server - Auto-start on Windows boot" >> CreateStartupShortcut.vbs
echo oLink.IconLocation = "%SystemRoot%\System32\shell32.dll,24" >> CreateStartupShortcut.vbs
echo oLink.Save >> CreateStartupShortcut.vbs

REM Run the VBScript
cscript //nologo CreateStartupShortcut.vbs

REM Clean up
del CreateStartupShortcut.vbs

echo.
echo ========================================
echo   Added to Windows Startup!
echo ========================================
echo.
echo HydroLens will now start automatically when you log into Windows.
echo.
echo To remove it later, run: REMOVE_FROM_WINDOWS_STARTUP.bat
echo.
echo The shortcut was added to:
echo %STARTUP%
echo.

pause
