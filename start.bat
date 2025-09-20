@echo off
echo Starting HydroLens Chat System with Speech-to-Text...
echo ==================================================
echo.
echo Server will start at: http://localhost:3000
echo.
echo Available pages:
echo - Index/Home: http://localhost:3000/index.html
echo - Sign Up:    http://localhost:3000/signup.html
echo - Login:      http://localhost:3000/login.html
echo - Chat:       http://localhost:3000/chat.html (with voice input!)
echo.
echo Features:
echo - Speech-to-text voice input (🎤 button)
echo - Multi-language support
echo - JWT Authentication
echo - Real-time chat with AI
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
node server.js
