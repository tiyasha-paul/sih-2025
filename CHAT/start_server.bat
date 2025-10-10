@echo off
echo ========================================
echo HydroLens Visualization Server
echo ========================================
echo.
echo Starting Flask API server on http://127.0.0.1:5000
echo.
echo Once started, you can:
echo   1. Open chat.html in your browser
echo   2. Ask questions with visualizations like:
echo      - "Show trend for Delhi 2024"
echo      - "Category bar for Rohini 2024"
echo      - "Plot graph for West Bengal"
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
python main.py --serve

pause
