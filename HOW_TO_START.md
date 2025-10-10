# 🚀 How to Start HYDROLENS.bat - Visual Guide

## 📍 Step-by-Step Instructions

### **Step 1: Find the File**
```
1. Open File Explorer (Windows Key + E)
2. Navigate to: d:\bin\sih-2025-main\
3. Look for: HYDROLENS.bat (batch file icon)
```

### **Step 2: Double-Click It**
```
1. Position your mouse over HYDROLENS.bat
2. Double-click with left mouse button
3. Wait for it to launch
```

### **Step 3: Wait (8 seconds)**
You'll see:
```
========================================
  HydroLens - Starting...
========================================

[1/2] Starting Flask server...
[2/2] Waiting for server to initialize...
[3/3] Opening browser...
```

### **Step 4: Browser Opens Automatically**
```
✅ Browser window opens
✅ URL: http://127.0.0.1:5000
✅ Chat interface loads
✅ Ready to use!
```

---

## 🎯 **What You Should See:**

### In the Console Window (Minimized):
```
Starting API server on http://127.0.0.1:5000
 * Serving Flask app 'main'
 * Running on http://127.0.0.1:5000
```

### In Your Browser:
```
╔═══════════════════════════════════════╗
║            🌊 HydroLens              ║
║                                       ║
║  [Type your message...]         ➤    ║
╚═══════════════════════════════════════╝
```

---

## 🎬 **Quick Test:**

Once the browser opens, type this:
```
show trend for Delhi 2024
```

Press **Enter** or click **➤**

You should see:
- ✅ Bot responds with text
- ✅ **A graph appears!** 📈
- ✅ Blue line showing extraction trend

---

## 🖱️ **Alternative Ways to Start:**

### **Method A: From Desktop (After Setup)**
```
1. Run: CREATE_DESKTOP_SHORTCUT.bat (one time)
2. Double-click desktop "HydroLens" icon
3. Done!
```

### **Method B: From Command Prompt**
```
1. Press Windows Key + R
2. Type: cmd
3. Press Enter
4. Type: cd d:\bin\sih-2025-main
5. Type: HYDROLENS.bat
6. Press Enter
```

### **Method C: From Windows Run**
```
1. Press Windows Key + R
2. Type: d:\bin\sih-2025-main\HYDROLENS.bat
3. Press Enter
```

### **Method D: From PowerShell**
```powershell
cd d:\bin\sih-2025-main
.\HYDROLENS.bat
```

---

## 🛑 **How to Stop:**

### **Easy Way:**
```
Double-click: STOP_HYDROLENS.bat
```

### **Manual Way:**
```
1. Find the console window titled "HydroLens Server"
2. Click the X button (close)
   OR
3. Click in the window and press Ctrl+C
```

### **Task Manager Way:**
```
1. Press Ctrl+Shift+Esc
2. Find "python.exe"
3. Right-click → End Task
```

---

## ❓ **Troubleshooting:**

### **Problem: Nothing Happens When Double-Clicking**
**Solution:**
- Right-click HYDROLENS.bat → Run as Administrator
- Check if Python is installed: `python --version`

### **Problem: Console Opens Then Closes Immediately**
**Solution:**
- Open Command Prompt
- Run: `cd d:\bin\sih-2025-main && HYDROLENS.bat`
- Read error message

### **Problem: "Port 5000 Already in Use"**
**Solution:**
```
1. Run: STOP_HYDROLENS.bat
2. Wait 5 seconds
3. Run: HYDROLENS.bat again
```

### **Problem: Browser Doesn't Open**
**Solution:**
- Manually open browser
- Go to: http://127.0.0.1:5000
- Check if default browser is set

### **Problem: "Python Not Found"**
**Solution:**
- Install Python 3.8+ from python.org
- During install, check "Add Python to PATH"

---

## 🎯 **Visual Flowchart:**

```
┌─────────────────────────┐
│  Double-click           │
│  HYDROLENS.bat          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Console Window Opens   │
│  (Minimized)            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Python Starts          │
│  Flask Server Starts    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Wait 8 Seconds...      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Browser Opens          │
│  http://127.0.0.1:5000  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  ✅ READY TO USE! 🎉    │
└─────────────────────────┘
```

---

## 📋 **Quick Reference:**

| Action | File |
|--------|------|
| **Start Server** | HYDROLENS.bat |
| **Stop Server** | STOP_HYDROLENS.bat |
| **Create Shortcut** | CREATE_DESKTOP_SHORTCUT.bat |
| **Add to Startup** | ADD_TO_WINDOWS_STARTUP.bat |

---

## 🎓 **Pro Tips:**

### **Tip 1: Pin to Taskbar**
```
1. Right-click HYDROLENS.bat
2. Create shortcut
3. Drag shortcut to taskbar
4. One-click access!
```

### **Tip 2: Create Keyboard Shortcut**
```
1. Right-click HYDROLENS.bat
2. Create shortcut
3. Right-click shortcut → Properties
4. In "Shortcut key" field, press: Ctrl+Alt+H
5. Click OK
6. Now press Ctrl+Alt+H to start!
```

### **Tip 3: Use Windows Search**
```
1. Press Windows Key
2. Type: HYDROLENS
3. Press Enter
```

---

## ✅ **Success Indicators:**

After starting, you should see:

✅ Console window opened (may be minimized)
✅ Console shows: "Starting API server..."
✅ Console shows: "Running on http://127.0.0.1:5000"
✅ Browser window opens within 8 seconds
✅ Address bar shows: http://127.0.0.1:5000
✅ Chat interface loads with HydroLens branding
✅ Input box ready for typing

If all ✅ - **You're good to go!** 🎉

---

## 🎊 **You're All Set!**

Just **double-click HYDROLENS.bat** whenever you want to use HydroLens!

It's that simple! 🚀
