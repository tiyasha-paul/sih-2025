@echo off
REM =============================================
REM  Create Desktop Shortcut for HydroLens
REM =============================================

echo.
echo Creating desktop shortcut for HydroLens...
echo.

REM Get the desktop path
set DESKTOP=%USERPROFILE%\Desktop

REM Create VBScript to make the shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = "%DESKTOP%\HydroLens.lnk" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%~dp0start_hydrolens.vbs" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> CreateShortcut.vbs
echo oLink.Description = "HydroLens - Groundwater Monitoring System" >> CreateShortcut.vbs
echo oLink.IconLocation = "%SystemRoot%\System32\shell32.dll,24" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs

REM Run the VBScript
cscript //nologo CreateShortcut.vbs

REM Clean up
del CreateShortcut.vbs

echo.
echo ========================================
echo   Desktop Shortcut Created!
echo ========================================
echo.
echo A "HydroLens" shortcut has been created on your desktop.
echo.
echo Double-click it to automatically:
echo   1. Start the Flask server
echo   2. Open your browser to the application
echo.
echo No console windows will appear!
echo.

pause
