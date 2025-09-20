Write-Host "Starting HydroLens Chat System with Speech-to-Text..." -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Server will start at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Available pages:" -ForegroundColor Yellow
Write-Host "- Index/Home: http://localhost:3000/index.html" -ForegroundColor White
Write-Host "- Sign Up:    http://localhost:3000/signup.html" -ForegroundColor White
Write-Host "- Login:      http://localhost:3000/login.html" -ForegroundColor White
Write-Host "- Chat:       http://localhost:3000/chat.html (with voice input!)" -ForegroundColor White
Write-Host ""
Write-Host "Features:" -ForegroundColor Yellow
Write-Host "- Speech-to-text voice input (🎤 button)" -ForegroundColor White
Write-Host "- Multi-language support" -ForegroundColor White
Write-Host "- JWT Authentication" -ForegroundColor White
Write-Host "- Real-time chat with AI" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Change to the script directory
Set-Location $PSScriptRoot

# Start the server
node server.js
