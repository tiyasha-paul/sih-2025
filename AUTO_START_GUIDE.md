# 🚀 HydroLens Auto-Start Guide

## 🎯 Quick Answer: 3 Ways to Auto-Start

I've created **3 different solutions** for you. Choose the one that fits your needs:

---

## ✅ Option 1: Double-Click Launcher (RECOMMENDED)

**Best for:** Quick launch whenever you need it

### How to Use:
1. **Double-click:** `HYDROLENS.bat`
2. Wait 8 seconds
3. Browser opens automatically to http://127.0.0.1:5000
4. Start using HydroLens!

### Features:
- ✅ Starts server automatically
- ✅ Opens browser automatically
- ✅ Shows server window (minimized)
- ✅ Easy to stop (close the server window or press Ctrl+C)

### Files:
- **HYDROLENS.bat** - Main launcher (shows console)
- **start_hydrolens.vbs** - Silent launcher (no console)

---

## ✅ Option 2: Desktop Shortcut

**Best for:** Easy access from desktop

### Setup (One-Time):
1. **Double-click:** `CREATE_DESKTOP_SHORTCUT.bat`
2. A "HydroLens" icon appears on your desktop

### How to Use:
1. **Double-click** the desktop icon
2. Browser opens automatically
3. Done!

### Features:
- ✅ Clean desktop icon
- ✅ No console windows
- ✅ Silent background startup
- ✅ Professional look

---

## ✅ Option 3: Windows Startup (Auto-Start on Boot)

**Best for:** Always-on access, starts when Windows starts

### Setup (One-Time):
1. **Double-click:** `ADD_TO_WINDOWS_STARTUP.bat`
2. Confirm when prompted

### What Happens:
- Every time you log into Windows, HydroLens starts automatically
- Browser opens to http://127.0.0.1:5000
- Runs silently in the background

### To Remove:
- **Double-click:** `REMOVE_FROM_WINDOWS_STARTUP.bat`

### Features:
- ✅ Fully automatic
- ✅ No manual action needed
- ✅ Always available
- ⚠️ Uses system resources continuously

---

## 📋 Comparison Table

| Feature | HYDROLENS.bat | Desktop Shortcut | Windows Startup |
|---------|---------------|------------------|-----------------|
| **Setup Time** | None (ready now) | 5 seconds | 10 seconds |
| **Console Window** | Yes (minimized) | No | No |
| **Auto on Boot** | ❌ | ❌ | ✅ |
| **Easy to Stop** | Very Easy | Easy | Easy |
| **Resource Usage** | Only when running | Only when running | Always running |
| **Best For** | Daily use | Frequent use | Always-on access |

---

## 🎮 All Available Scripts

### 🚀 Launchers:
| File | Description |
|------|-------------|
| **HYDROLENS.bat** | Quick launcher (shows console) |
| **start_hydrolens.vbs** | Silent launcher (no console) |
| **START_SERVER.bat** | Server only (no auto browser) |

### 🖥️ Desktop:
| File | Description |
|------|-------------|
| **CREATE_DESKTOP_SHORTCUT.bat** | Create desktop icon |

### ⚙️ Windows Startup:
| File | Description |
|------|-------------|
| **ADD_TO_WINDOWS_STARTUP.bat** | Add to Windows startup |
| **REMOVE_FROM_WINDOWS_STARTUP.bat** | Remove from startup |

### 🛑 Stop Server:
| File | Description |
|------|-------------|
| **STOP_HYDROLENS.bat** | Stop all running servers |

---

## 🎯 Recommended Setup

### For Most Users (Recommended):
```
1. Run: CREATE_DESKTOP_SHORTCUT.bat
2. Double-click desktop icon whenever you need HydroLens
```

### For Power Users:
```
1. Run: ADD_TO_WINDOWS_STARTUP.bat
2. HydroLens always available at http://127.0.0.1:5000
```

### For Quick Testing:
```
1. Double-click: HYDROLENS.bat
2. Server starts with visible console
```

---

## 🔧 How Each Option Works

### Option 1: HYDROLENS.bat
```batch
1. Starts Flask server in minimized window
2. Waits 8 seconds
3. Opens browser to http://127.0.0.1:5000
4. Shows status message
```

### Option 2: Desktop Shortcut
```
1. Creates .lnk file on desktop
2. Points to start_hydrolens.vbs
3. VBScript starts server silently
4. Opens browser after 8 seconds
```

### Option 3: Windows Startup
```
1. Adds shortcut to Startup folder:
   %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
2. Windows runs it on login
3. Server starts automatically
4. Browser opens automatically
```

---

## 🛑 How to Stop the Server

### If using HYDROLENS.bat:
- Close the "HydroLens Server" window
- OR press Ctrl+C in the console

### If using silent mode (VBS):
- Run: `STOP_HYDROLENS.bat`
- OR open Task Manager → End "python.exe"

### Quick Stop Command:
```batch
# Run this in command prompt:
taskkill /F /FI "WINDOWTITLE eq HydroLens Server*"
```

---

## 🔍 Troubleshooting

### Problem: "Port 5000 already in use"
**Solution:**
```batch
# Stop existing server first
STOP_HYDROLENS.bat

# Then restart
HYDROLENS.bat
```

### Problem: Browser doesn't open automatically
**Solution:**
- Manually go to: http://127.0.0.1:5000
- Check if default browser is set correctly
- Wait 10-15 seconds (some systems are slower)

### Problem: Server starts but browser shows error
**Solution:**
```batch
# Check server is running
netstat -an | find "5000"

# Should show: 0.0.0.0:5000 or 127.0.0.1:5000 LISTENING
```

### Problem: Can't find where server is running
**Solution:**
```batch
# Check all Python processes
tasklist | find "python"

# Or use Task Manager → Details → python.exe
```

---

## 📝 Step-by-Step Walkthrough

### First-Time Setup (5 minutes):

**Step 1:** Test Manual Start
```
1. Double-click: HYDROLENS.bat
2. Wait for browser to open
3. Verify graphs work: "show trend for Delhi 2024"
4. Close console window to stop
```

**Step 2:** Create Desktop Shortcut
```
1. Double-click: CREATE_DESKTOP_SHORTCUT.bat
2. Check desktop for new HydroLens icon
3. Test it: Double-click the icon
4. Verify it works
```

**Step 3:** (Optional) Add to Startup
```
1. Double-click: ADD_TO_WINDOWS_STARTUP.bat
2. Restart computer
3. Verify HydroLens starts automatically
```

---

## 🎓 Technical Details

### What Happens Behind the Scenes:

**1. Server Start:**
```python
# This runs in background:
cd CHAT
python main.py --serve

# Output:
# Starting API server on http://127.0.0.1:5000
```

**2. Wait Period:**
```
# 8 seconds delay to ensure:
- Python interpreter loads
- Flask initializes
- FAISS index loads
- Routes register
- Server binds to port 5000
```

**3. Browser Launch:**
```batch
# Windows command:
start http://127.0.0.1:5000

# This uses your default browser
# Alternatives:
start chrome http://127.0.0.1:5000
start firefox http://127.0.0.1:5000
```

---

## 🔒 Security Notes

### Safe to Use:
- ✅ Server only binds to `127.0.0.1` (localhost)
- ✅ Not accessible from network/internet
- ✅ No external connections required
- ✅ All data processed locally

### Privacy:
- ✅ No telemetry
- ✅ No analytics
- ✅ No external API calls (except optional Gemini)
- ✅ Fully offline capable

---

## 💡 Pro Tips

### Tip 1: Bookmark the URL
```
1. Open http://127.0.0.1:5000
2. Bookmark it (Ctrl+D)
3. Name it: "HydroLens"
4. Access from bookmarks anytime
```

### Tip 2: Create Browser Profile
```
1. Create dedicated Chrome/Firefox profile for HydroLens
2. Set http://127.0.0.1:5000 as homepage
3. Auto-opens when you start the profile
```

### Tip 3: Pin to Taskbar (Windows 11)
```
1. Create desktop shortcut first
2. Drag shortcut to taskbar
3. One-click access from taskbar
```

### Tip 4: Custom Icon
```
1. Right-click desktop shortcut
2. Properties → Change Icon
3. Browse to custom .ico file
4. Apply
```

---

## 🎯 Quick Reference

### Daily Workflow:
```
1. Double-click: Desktop Icon or HYDROLENS.bat
2. Wait for browser to open
3. Use HydroLens
4. Close browser when done
5. Run STOP_HYDROLENS.bat (optional)
```

### Always-On Workflow:
```
1. Run ADD_TO_WINDOWS_STARTUP.bat once
2. HydroLens available 24/7 at http://127.0.0.1:5000
3. Just open browser to URL anytime
```

---

## ✨ Summary

You now have **multiple ways** to auto-start HydroLens:

1. **🚀 HYDROLENS.bat** - Quick manual start + browser
2. **🖥️ Desktop Shortcut** - One-click desktop access
3. **⚙️ Windows Startup** - Fully automatic on boot

**My Recommendation:**
- Start with: **Desktop Shortcut** (best balance)
- Upgrade to: **Windows Startup** (if you use it daily)

**Next Step:** Run `CREATE_DESKTOP_SHORTCUT.bat` right now! 🎉
