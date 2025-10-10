# 🔧 Fix: Graphs Not Showing in Browser

## ❌ The Problem

You were opening `chat.html` **directly** by double-clicking the file:
```
file:///d:/bin/sih-2025-main/chat.html
```

This causes **CORS (Cross-Origin Resource Sharing)** errors:
- Browser blocks API requests from `file://` to `http://127.0.0.1:5000`
- Graphs cannot load
- Console shows error: `"CORS policy: No 'Access-Control-Allow-Origin'"`

---

## ✅ The Solution

Access `chat.html` **through the Flask web server** instead:

### Step 1: Start the Server
```bash
# Option 1: Double-click this file
START_SERVER.bat

# Option 2: Use command line
cd CHAT
python main.py --serve
```

Wait for:
```
Starting API server on http://127.0.0.1:5000
 * Running on http://127.0.0.1:5000
```

### Step 2: Open in Browser
**Instead of:** `file:///d:/bin/sih-2025-main/chat.html` ❌

**Use:** **http://127.0.0.1:5000** ✅

---

## 🎯 Visual Comparison

### ❌ WRONG WAY (Doesn't Work)
```
┌──────────────────────────────────────┐
│  Windows Explorer                     │
│                                       │
│  📁 sih-2025-main                    │
│    📄 chat.html  ← Double-click     │
│                                       │
└──────────────────────────────────────┘
         ↓ Opens as
┌──────────────────────────────────────┐
│  Browser Address Bar:                │
│  file:///d:/bin/sih-2025-main/...   │ ← CORS ERROR!
└──────────────────────────────────────┘
```

**Result:**
- ❌ No graphs display
- ❌ API requests blocked
- ❌ Console error: CORS policy

---

### ✅ RIGHT WAY (Works!)
```
┌──────────────────────────────────────┐
│  Terminal / Command Prompt            │
│                                       │
│  > cd CHAT                            │
│  > python main.py --serve             │
│  Starting server on                   │
│  http://127.0.0.1:5000               │
└──────────────────────────────────────┘
         ↓ Then type in browser
┌──────────────────────────────────────┐
│  Browser Address Bar:                │
│  http://127.0.0.1:5000               │ ← WORKS!
└──────────────────────────────────────┘
```

**Result:**
- ✅ Graphs display correctly
- ✅ API requests work
- ✅ No CORS errors

---

## 🧪 Test It Works

Once you open **http://127.0.0.1:5000**:

1. Type: `show trend for Delhi 2024`
2. Press Enter
3. **You should see a graph appear!** 📈

4. Type: `show category bar for Haryana 2022`
5. Press Enter
6. **You should see a bar chart!** 📊

---

## 🔍 How to Verify

### Check Browser Address Bar:

**✅ Correct:**
```
http://127.0.0.1:5000
```

**❌ Wrong:**
```
file:///d:/bin/sih-2025-main/chat.html
```

### Check Browser Console (Press F12):

**✅ Correct (No errors):**
```
POST http://127.0.0.1:5000/api/query 200 OK
GET http://127.0.0.1:5000/static/trend_*.png 200 OK
```

**❌ Wrong (CORS error):**
```
Access to fetch at 'http://127.0.0.1:5000/api/query' from origin 'null'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

---

## 📋 Quick Checklist

- [ ] Close any `file://` browser tabs
- [ ] Start Flask server: `python main.py --serve`
- [ ] See: `Running on http://127.0.0.1:5000`
- [ ] Open browser to: `http://127.0.0.1:5000`
- [ ] Address bar shows: `http://` NOT `file://`
- [ ] Type test query: `show trend for Delhi 2024`
- [ ] Graph appears below bot response
- [ ] No CORS errors in console (F12)

---

## 🎓 Why This Happens

**Technical Explanation:**

Modern browsers enforce **Same-Origin Policy** for security:

- `file://` pages have origin = `null`
- `http://127.0.0.1:5000` has origin = `http://127.0.0.1:5000`
- Requests from `null` → `http://127.0.0.1:5000` = **BLOCKED**
- Requests from `http://127.0.0.1:5000` → `http://127.0.0.1:5000` = **ALLOWED**

**Solution:** Serve everything from the same origin (the Flask server).

---

## 🚀 Recommended Workflow

### Every Time You Want to Use HydroLens:

1. **Open Terminal/Command Prompt**
   ```bash
   cd d:\bin\sih-2025-main
   ```

2. **Run Launcher**
   ```bash
   START_SERVER.bat
   ```
   OR
   ```bash
   cd CHAT
   python main.py --serve
   ```

3. **Open Browser**
   - Go to: http://127.0.0.1:5000
   - **Bookmark this URL** for easy access

4. **Use the Application**
   - Type queries
   - View graphs
   - Explore data

5. **Stop Server (when done)**
   - Press `Ctrl+C` in the terminal

---

## 🎯 Summary

| Issue | Fix |
|-------|-----|
| Opening file directly | Use Flask server |
| `file://` URL | Use `http://127.0.0.1:5000` |
| CORS errors | Same origin = no CORS |
| Graphs not loading | Server serves everything |
| Double-clicking HTML | Run `START_SERVER.bat` instead |

---

## ✨ Final Step

1. **Right now:** Close any `file://` tabs
2. **Run:** `START_SERVER.bat` (or `python main.py --serve`)
3. **Open:** http://127.0.0.1:5000
4. **Test:** Type "show trend for Delhi 2024"
5. **Enjoy:** Watch the graph appear! 🎉

---

**Your graphs will now work perfectly!** 📊📈
