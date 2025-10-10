# 🎤 HydroLens Speech-to-Text Feature

## Overview

HydroLens now includes a powerful speech-to-text feature that allows users to input chat messages using voice commands instead of typing.

## How to Use Voice Input

1. **Navigate to Chat**: Go to `http://localhost:3000/chat.html`
2. **Find the Microphone**: Look for the 🎤 button in the chat input area
3. **Start Recording**: Click the microphone button to begin voice input
4. **Speak Clearly**: Your speech will be converted to text in real-time
5. **Stop Recording**: Click the microphone button again to stop
6. **Send Message**: Send your voice message as usual

## Features

- **Real-time Conversion**: See your speech converted to text as you speak
- **Multi-language Support**: Works with all supported languages:
  - English
  - हिन्दी (Hindi)
  - বাংলা (Bengali)
  - தமிழ் (Tamil)
  - తెలుగు (Telugu)
- **Visual Feedback**: Button changes color and shows recording animation
- **Error Handling**: Graceful fallback for unsupported browsers
- **Responsive Design**: Works on all devices and screen sizes

## Browser Compatibility

The speech-to-text feature uses the Web Speech API and works best in:
- ✅ Chrome (recommended)
- ✅ Edge
- ⚠️ Safari (partial support)
- ⚠️ Firefox (partial support)

## Quick Start Guide

### Option 1: Batch File (Windows)
```cmd
start.bat
```

### Option 2: PowerShell Script (Windows)
```powershell
.\start.ps1
```

### Option 3: Manual Start
```bash
node server.js
```

## Complete System Access

Once the server is running, you can access:

- **Home Page**: `http://localhost:3000/index.html`
- **Sign Up**: `http://localhost:3000/signup.html`
- **Login**: `http://localhost:3000/login.html`
- **Chat with Voice**: `http://localhost:3000/chat.html`

## User Flow

1. **Start**: Run `start.bat` or `node server.js`
2. **Sign Up**: Create account at `/signup.html`
3. **Login**: Authenticate at `/login.html`
4. **Chat**: Use voice input at `/chat.html`

## Troubleshooting

### Microphone Not Working
- Ensure your browser supports Web Speech API
- Check microphone permissions in browser settings
- Try refreshing the page and granting permissions

### Server Not Starting
- Check if Node.js is installed
- Verify MongoDB is running
- Check for port conflicts (3000)

### Static Files Not Loading
- Ensure all files are in `server/acc/public/` directory
- Check server logs for file serving errors

## Technical Details

- **Technology**: Web Speech API
- **Languages**: Multi-language support via browser
- **Integration**: Seamlessly integrated with existing chat system
- **Storage**: Voice input stored same as text messages
- **Security**: Uses existing JWT authentication

## Support

For issues with the speech-to-text feature:
1. Check browser compatibility
2. Verify microphone permissions
3. Try a different browser (Chrome recommended)
4. Check server logs for errors

---

**Enjoy hands-free chatting with HydroLens! 🎤**
