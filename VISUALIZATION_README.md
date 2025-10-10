# 🌊 HydroLens Visualization Module - Complete Guide

**Auto-Start Groundwater Visualization System**

---

## 🚀 FASTEST Way to Start (3 Options)

### ⚡ Option 1: One-Click Launch (EASIEST)
```
Double-click: HYDROLENS.bat
✅ Server starts automatically
✅ Browser opens automatically
✅ Ready to use in 8 seconds!
```

### 🖥️ Option 2: Desktop Shortcut (RECOMMENDED)
```
1. Double-click: CREATE_DESKTOP_SHORTCUT.bat
2. Use desktop icon from now on
✅ No console windows
✅ Silent startup
✅ Professional look
```

### ⚙️ Option 3: Always-On (POWER USERS)
```
Double-click: ADD_TO_WINDOWS_STARTUP.bat
✅ Starts with Windows
✅ Always available
✅ Zero manual work
```

---

## 📊 What You Can Do

### 1. Trend Plots (Time-Series)
**Query Examples:**
- "show trend for Delhi 2024"
- "plot groundwater for West Bengal 2023"
- "graph extraction for Rohini"

**What You Get:** 📈
- Blue line showing extraction over time
- Dashed line showing average extractable resources
- Year-by-year comparison

### 2. Category Bar Charts
**Query Examples:**
- "show category bar for Haryana 2022"
- "category distribution for Delhi 2024"
- "bar chart for Odisha"

**What You Get:** 📊
- 🟢 Safe areas (≤70% SGWD)
- 🟡 Semi-Critical (70-90%)
- 🟠 Critical (90-100%)
- 🔴 Over-Exploited (>100%)

### 3. Data Queries
**Query Examples:**
- "rainfall for Delhi Civil Lines 2024"
- "groundwater data for Rohini"
- "SGWD for Mayur Vihar 2024"

**What You Get:** 📋
- Specific numeric data
- Category classification
- Rainfall information

---

## 🎯 Step-by-Step First Use

### Step 1: Choose Your Method
Pick one from the 3 options above. We recommend **Option 2 (Desktop Shortcut)**.

### Step 2: First Launch
```
1. Double-click your chosen launcher
2. Wait 8 seconds
3. Browser opens to: http://127.0.0.1:5000
```

### Step 3: Test It
Type this query:
```
show trend for Delhi 2024
```

You should see:
- ✅ Bot response with explanation
- ✅ A graph showing extraction trends
- ✅ Blue line and dashed line on the chart

### Step 4: Try Another
Type this query:
```
show category bar for Haryana 2022
```

You should see:
- ✅ Bot response about categories
- ✅ A colorful bar chart
- ✅ Different colors for different safety levels

### Step 5: Explore!
Try different:
- States: Delhi, Odisha, Haryana, West Bengal
- Locations: Rohini, Mayur Vihar, Narela, etc.
- Years: 2021-2025
- Languages: English, हिन्दी, বাংলা, தமிழ், తెలుగు

---

## 🗂️ All Files Explained

### 🚀 Launcher Files:
| File | What It Does | When to Use |
|------|--------------|-------------|
| **HYDROLENS.bat** | Starts server + opens browser | Quick daily use |
| **start_hydrolens.vbs** | Silent version (no console) | Clean desktop experience |
| **START_SERVER.bat** | Server only (manual browser) | When debugging |

### 🛠️ Setup Files:
| File | What It Does | When to Use |
|------|--------------|-------------|
| **CREATE_DESKTOP_SHORTCUT.bat** | Makes desktop icon | One-time setup |
| **ADD_TO_WINDOWS_STARTUP.bat** | Auto-start on boot | Always-on access |
| **REMOVE_FROM_WINDOWS_STARTUP.bat** | Remove auto-start | When not needed daily |

### 🛑 Control Files:
| File | What It Does | When to Use |
|------|--------------|-------------|
| **STOP_HYDROLENS.bat** | Stops all servers | When done using |

### 📖 Documentation:
| File | What It Explains |
|------|------------------|
| **AUTO_START_GUIDE.md** | Detailed auto-start options |
| **QUICKSTART.md** | Fast getting started guide |
| **HOW_TO_FIX_CORS.md** | Fix browser access issues |
| **INTEGRATION_SUMMARY.md** | Technical architecture |
| **VISUALIZATION_README.md** | This file |

---

## 🔧 Common Issues & Solutions

### ❌ Problem: Graphs Not Showing
**Cause:** Opening chat.html as file:// instead of http://
**Solution:**
```
1. Don't double-click chat.html
2. Use HYDROLENS.bat instead
3. Access via http://127.0.0.1:5000
```
**Details:** See [HOW_TO_FIX_CORS.md](HOW_TO_FIX_CORS.md)

### ❌ Problem: Port 5000 Already in Use
**Cause:** Server already running or another app using port
**Solution:**
```
1. Run: STOP_HYDROLENS.bat
2. Then run: HYDROLENS.bat again
```

### ❌ Problem: Browser Doesn't Open Automatically
**Cause:** System delay or default browser not set
**Solution:**
```
Manually open browser to: http://127.0.0.1:5000
```

### ❌ Problem: "Module not found" Error
**Cause:** Missing Python packages
**Solution:**
```bash
pip install flask flask-cors matplotlib pandas numpy
pip install langchain langchain-community langchain-huggingface
pip install faiss-cpu googletrans==4.0.0-rc1
```

---

## 💡 Pro Tips

### Tip 1: Bookmark the URL
```
1. Open http://127.0.0.1:5000
2. Press Ctrl+D to bookmark
3. Name it "HydroLens"
4. Quick access anytime!
```

### Tip 2: Multiple Queries at Once
```
Type multiple queries in sequence:
1. "show trend for Delhi 2024"
2. Wait for response
3. "show category bar for Delhi 2024"
4. Compare both visualizations!
```

### Tip 3: Use New Chat Button
```
Click "+ New Chat" to clear and start fresh
Perfect for comparing different regions
```

### Tip 4: Try Voice Input
```
Click the 🎤 microphone button
Speak your query
Hands-free operation!
```

### Tip 5: Dark/Light Mode
```
Click "Dark Mode" / "Light Mode" button
Toggle based on preference
Easy on the eyes!
```

---

## 📊 Data Coverage Reference

### States Available:
- 🏛️ **Delhi** - 102 locations
  - Examples: Rohini, Mayur Vihar, Narela, Delhi Civil Lines
- 🏖️ **Odisha** - 216 locations
- 🌾 **Haryana** - 356 locations
  - Examples: Adampur, Aleo, Ambala
- 🌾 **West Bengal** - 272 locations

### Years Available:
- 2021-2022
- 2022-2023
- 2023-2024
- 2024-2025

### Data Points per Location:
- Groundwater Extraction (hectare-meters)
- Annual Extractable Resources (hectare-meters)
- Rainfall (millimeters)
- SGWD (Stage of Groundwater Development %)
- Safety Category

---

## 🎨 Understanding the Graphs

### Trend Plot Explained:
```
📈 TREND PLOT ANATOMY:

Y-Axis (Vertical)
│
│   ──────────── Dashed Line = Average Extractable
│    /\  /\
│   /  \/  \    Blue Line = Actual Extraction
│  /        \
│ /          \
└─────────────────── X-Axis (Horizontal = Years)
  2021 2022 2023 2024

Interpretation:
- Line going UP = Increasing extraction (⚠️ warning)
- Line ABOVE dashed = Exceeding sustainable level (🔴 danger)
- Line BELOW dashed = Within safe limits (🟢 good)
```

### Category Bar Explained:
```
📊 CATEGORY BAR ANATOMY:

Count
│
20│     █
  │     █
15│ █   █       █
  │ █   █   █   █
10│ █   █   █   █
  │ █   █   █   █
 5│ █   █   █   █
  │ █   █   █   █
  └─────────────────
    🟢  🟡  🟠  🔴
    Safe Semi Crit Over

Interpretation:
- Taller 🟢 bar = More safe areas (good!)
- Taller 🔴 bar = More over-exploited (bad!)
- Compare across years to see trends
```

---

## 🌐 Language Support

### Available Languages:
1. **English** - Default
2. **हिन्दी (Hindi)** - Full support
3. **বাংলা (Bengali)** - Full support
4. **தமிழ் (Tamil)** - Full support
5. **తెలుగు (Telugu)** - Full support

### How to Change:
```
1. Click language dropdown (top of input)
2. Select your language
3. Type queries in that language
4. Responses come in selected language
```

### Example in Hindi:
```
Query: "दिल्ली 2024 के लिए ट्रेंड दिखाएं"
Response: Hindi response + graph
```

---

## 🔒 Security & Privacy

### Local Only:
- ✅ Server binds to 127.0.0.1 (localhost)
- ✅ Not accessible from network
- ✅ Not accessible from internet
- ✅ All data processed locally

### No External Calls:
- ✅ No telemetry
- ✅ No analytics
- ✅ No tracking
- ✅ Fully offline (except optional Gemini)

### Data Storage:
- ✅ Graphs saved in local /static/ folder
- ✅ No cloud upload
- ✅ You control all data

---

## 🎓 How It Works (Technical Overview)

### Architecture:
```
Your Browser (http://127.0.0.1:5000)
    ↓ Sends query: "show trend for Delhi 2024"
Flask Server (main.py)
    ↓ Extracts: location=Delhi, year=2024, type=trend
Query Parser (extract_location_and_year)
    ↓ Calls function
Graph Generator (plot_extraction_trend)
    ↓ Uses Matplotlib
PNG File Generated (trend_20251010.png)
    ↓ Saved to /static/
URL Returned (/static/trend_20251010.png)
    ↓ Sent to browser
Your Browser Displays Graph! 📈
```

### Technologies Used:
- **Flask** - Web server
- **Matplotlib** - Graph generation
- **Pandas** - Data processing
- **FAISS** - Vector search
- **LangChain** - AI pipeline
- **HuggingFace** - Embeddings
- **Google Gemini** - AI fallback (optional)

---

## 📋 Quick Reference Card

### Start Server:
```batch
HYDROLENS.bat
```

### Stop Server:
```batch
STOP_HYDROLENS.bat
```

### Access Interface:
```
http://127.0.0.1:5000
```

### Test Queries:
```
show trend for Delhi 2024
show category bar for Haryana 2022
rainfall for Rohini 2024
```

### Supported Keywords:
| Intent | Keywords |
|--------|----------|
| Trend Plot | trend, plot, graph, extraction, visualize |
| Category Bar | category, categories, bar, distribution |
| Data Query | rainfall, groundwater, SGWD, data, information |

---

## ✅ Success Checklist

After launching, verify:

- [ ] Server started (console shows: "Running on http://127.0.0.1:5000")
- [ ] Browser opened automatically
- [ ] Chat interface loads
- [ ] Address bar shows: http://127.0.0.1:5000 (NOT file://)
- [ ] Test query: "show trend for Delhi 2024"
- [ ] Graph appears below response
- [ ] Graph is a blue line chart
- [ ] Try second query: "show category bar for Haryana 2022"
- [ ] Bar chart appears with colors
- [ ] No errors in browser console (F12)
- [ ] Server console shows HTTP 200 status

If all checked ✅ - **You're good to go!** 🎉

---

## 🎯 Next Steps

### Daily Use Workflow:
```
Morning:
1. Double-click desktop HydroLens icon
2. Browser opens automatically
3. Start querying!

Evening:
4. Close browser
5. Run STOP_HYDROLENS.bat (optional)
```

### Advanced Usage:
1. Read [AUTO_START_GUIDE.md](AUTO_START_GUIDE.md) for auto-start options
2. Read [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) for technical details
3. Customize queries for your research needs
4. Generate reports with multiple visualizations

### Share with Others:
1. Copy entire sih-2025-main folder
2. Share the folder
3. Recipient runs CREATE_DESKTOP_SHORTCUT.bat
4. They're ready to use!

---

## 🎊 Summary

**What You Got:**
- ✅ Auto-launching visualization system
- ✅ No manual server start needed
- ✅ Browser opens automatically
- ✅ Trend plots for any location/year
- ✅ Category bars for distribution analysis
- ✅ Multi-language support
- ✅ Desktop shortcut option
- ✅ Windows startup option
- ✅ Complete documentation

**How to Use:**
1. Double-click `HYDROLENS.bat` (or desktop icon)
2. Type queries in the chat
3. View beautiful graphs!

**That's it!** Enjoy exploring groundwater data with HydroLens! 🌊💧

---

*For technical support, see [QUICKSTART.md](QUICKSTART.md) or [HOW_TO_FIX_CORS.md](HOW_TO_FIX_CORS.md)*
