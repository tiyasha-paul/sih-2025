# 🚀 Quick Start Guide - HydroLens

## Problem: Can't see graphs in browser?

**Issue:** Opening `chat.html` directly (double-clicking the file) uses `file://` protocol which blocks API requests to the Flask server due to CORS security.

**Solution:** Access `chat.html` through the Flask web server instead.

---

## ✅ Simple 2-Step Solution

### **Step 1: Start the Server**

**Option A - Windows:**
- Double-click: `START_SERVER.bat`

**Option B - Command Line:**
```bash
cd CHAT
python main.py --serve
```

You should see:
```
Starting API server on http://127.0.0.1:5000
 * Serving Flask app 'main'
 * Running on http://127.0.0.1:5000
```

### **Step 2: Open Browser**

Go to: **http://127.0.0.1:5000**

**DO NOT** open the file directly (file:///d:/bin/sih-2025-main/chat.html) ❌

**DO** use the HTTP URL (http://127.0.0.1:5000) ✅

---

## 🎯 Test It Works

Once the page loads at http://127.0.0.1:5000:

1. Type in the chat: **"show trend for Delhi 2024"**
2. Press Enter or click Send (➤)
3. You should see:
   - Bot response with explanation
   - **A graph showing groundwater extraction trend** 📈

4. Try another query: **"show category bar for Haryana 2022"**
5. You should see:
   - **A bar chart with colored categories** 📊

---

## 🔍 How to Know It's Working

### ✅ **Working Correctly:**
- Browser shows: `http://127.0.0.1:5000` in address bar
- Chat interface loads
- When you send a query with "trend" or "category":
  - Bot responds with text
  - **Image appears below the text**
  - Server terminal shows: `"POST /api/query HTTP/1.1" 200`
  - Server terminal shows: `"GET /static/trend_*.png HTTP/1.1" 200`

### ❌ **Not Working (CORS Error):**
- Browser shows: `file:///d:/bin/sih-2025-main/chat.html`
- Browser console (F12) shows: `CORS policy: No 'Access-Control-Allow-Origin'`
- **No images appear**
- May show error: "Error contacting visualization server"

---

## 📊 Example Queries to Try

### Trend Plots:
- "show trend for Delhi 2024"
- "plot groundwater for West Bengal 2023"
- "graph extraction for Rohini"
- "trend for Haryana"

### Category Bar Charts:
- "show category bar for Delhi 2024"
- "category distribution for Haryana 2022"
- "bar chart for Odisha 2023"
- "categories for West Bengal"

### Data Queries (text only):
- "rainfall for Delhi Civil Lines 2024"
- "groundwater data for Rohini 2024"
- "SGWD for Mayur Vihar"

---

## 🛠️ Troubleshooting

### Problem 1: "Server not accessible" alert
**Cause:** Flask server not running
**Solution:**
```bash
cd CHAT
python main.py --serve
```

### Problem 2: Graphs not showing
**Cause:** Accessing via `file://` instead of `http://`
**Solution:** Close the file, use http://127.0.0.1:5000

### Problem 3: Port 5000 already in use
**Cause:** Another application using port 5000
**Solution:**
- Close other Flask apps
- Or edit main.py line 663: change `port=5000` to `port=5001`

### Problem 4: Module not found errors
**Cause:** Missing Python packages
**Solution:**
```bash
pip install flask flask-cors matplotlib pandas numpy langchain langchain-community langchain-huggingface faiss-cpu googletrans==4.0.0-rc1
```

---

## 📁 Files Reference

- **START_SERVER.bat** - Windows launcher script
- **chat.html** - Main web interface (access via http://127.0.0.1:5000)
- **test_visualization.html** - Test interface (access via http://127.0.0.1:5000/test_visualization.html)
- **CHAT/main.py** - Flask server + backend logic
- **CHAT/static/** - Generated graphs folder
- **INTEGRATION_SUMMARY.md** - Full technical documentation

---

## 🎓 Understanding the Architecture

```
┌─────────────────────────────────────────┐
│  Browser: http://127.0.0.1:5000         │
│  (chat.html served by Flask)            │
└─────────────────┬───────────────────────┘
                  │ HTTP Request
                  ↓
┌─────────────────────────────────────────┐
│  Flask Server (Port 5000)               │
│  - Serves chat.html                     │
│  - Processes /api/query                 │
│  - Generates graphs                     │
│  - Saves to /static/                    │
└─────────────────┬───────────────────────┘
                  │ Returns graph URL
                  ↓
┌─────────────────────────────────────────┐
│  Browser displays image:                │
│  http://127.0.0.1:5000/static/trend.png │
└─────────────────────────────────────────┘
```

**Key Point:** Everything goes through the Flask server, so you must access via `http://` not `file://`

---

## ✨ Quick Reference Card

| Task | Action |
|------|--------|
| Start Server | Run `START_SERVER.bat` or `python main.py --serve` |
| Access Interface | Open http://127.0.0.1:5000 in browser |
| Test Trend Plot | Type: "show trend for Delhi 2024" |
| Test Category Bar | Type: "show category bar for Haryana 2022" |
| Stop Server | Press Ctrl+C in terminal |
| View Logs | Look at terminal where server is running |
| View Generated Graphs | Browse to `CHAT/static/` folder |

---

## 🎉 You're All Set!

1. Run `START_SERVER.bat`
2. Open http://127.0.0.1:5000 in browser
3. Start asking questions and viewing graphs!

**That's it!** The CORS issue is solved by accessing through the Flask server instead of opening the HTML file directly.
