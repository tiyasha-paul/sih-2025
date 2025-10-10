@echo off
echo ========================================
echo   Starting HydroLens Server...
echo ========================================
echo.
echo Server will start on http://127.0.0.1:5000
echo.
echo After server starts, open your browser and go to:
echo   http://127.0.0.1:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd CHAT
python main.py --serve

pause
