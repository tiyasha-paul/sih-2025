@echo off
echo Testing HYDROLENS startup...
echo.
echo Step 1: Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)
echo ✓ Python found
echo.

echo Step 2: Checking CHAT folder...
if exist "CHAT\main.py" (
    echo ✓ CHAT\main.py exists
) else (
    echo ERROR: CHAT\main.py not found!
    pause
    exit /b 1
)
echo.

echo Step 3: Stopping any existing servers...
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul
echo ✓ Cleaned up
echo.

echo Step 4: Starting Flask server...
cd CHAT
start "HydroLens Server" cmd /k python main.py --serve
echo ✓ Server starting...
echo.

echo Step 5: Waiting 10 seconds for server to initialize...
timeout /t 10 /nobreak
echo.

echo Step 6: Opening browser...
start http://127.0.0.1:5000
echo ✓ Browser should open now
echo.

echo ========================================
echo   HydroLens Started!
echo ========================================
echo.
echo If browser didn't open, go to: http://127.0.0.1:5000
echo.
echo To stop: Close the "HydroLens Server" window
echo.
pause
