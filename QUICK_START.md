# HydroLens - Quick Start Guide

## ✅ All Issues Fixed!

- ✅ Multi-word states like "West Bengal" now work correctly
- ✅ Visualizations display actual data (no more empty graphs)
- ✅ State-level and location-level queries both work perfectly
- ✅ All 4 states supported: Delhi, West Bengal, Odisha, Haryana

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd CHAT
pip install -r requirements.txt
```

### Step 2: Start the Server
**Windows:**
```bash
start_server.bat
```

**Linux/Mac:**
```bash
chmod +x start_server.sh
./start_server.sh
```

**Or manually:**
```bash
python main.py --serve
```

### Step 3: Open the Chat Interface
Open `chat.html` in your web browser or navigate to:
```
http://127.0.0.1:5000/
```

## 💡 Example Queries with Visualizations

### Trend Plots
```
Show trend for Delhi 2024
Plot extraction graph for Rohini
Display groundwater trend for West Bengal
```

### Category Bar Charts
```
Category bar for Rohini 2024
Show categories for Delhi 2024
Distribution of groundwater for West Bengal 2023
```

### Data Queries
```
Groundwater extraction for Delhi Civil Lines 2024
Rainfall in Rohini 2024
Full information of Mayur Vihar 2024
```

## 📊 What You'll See

1. **Text Answer** - Explanation of the data
2. **Visualization** - Graph/chart image displayed inline
3. **Interactive Chat** - Continue asking questions

## ✨ Features

- ✅ **Trend Plots** - Groundwater extraction over time
- ✅ **Category Bar Charts** - Distribution of water categories
- ✅ **Multi-language Support** - English, Hindi, Bengali, Tamil, Telugu
- ✅ **Voice Input** - Click the mic button
- ✅ **Dark/Light Mode** - Toggle theme
- ✅ **Smart Data Retrieval** - Automatic state inference

## 🔧 Alternative Interfaces

### Streamlit Interface
```bash
cd CHAT
streamlit run app.py
```

### Alternative Streamlit Interface
```bash
cd CHAT
streamlit run streamlit_app.py
```

## 📁 File Structure

```
sih-2025-main/
├── chat.html                    # Main web chat interface
├── CHAT/
│   ├── main.py                  # Flask API + RAG + Visualizations
│   ├── app.py                   # Streamlit interface
│   ├── streamlit_app.py         # Alternative Streamlit
│   ├── data.json                # Groundwater dataset
│   ├── requirements.txt         # Python dependencies
│   ├── start_server.bat         # Windows start script
│   ├── start_server.sh          # Linux/Mac start script
│   └── README.md                # Detailed documentation
└── VISUALIZATION_INTEGRATION_SUMMARY.md  # Technical details
```

## 🆘 Troubleshooting

### "Error contacting visualization server"
**Solution:** Make sure Flask server is running
```bash
cd CHAT
python main.py --serve
```

### "No data available"
**Solution:** Check if the state/location/year exists in data.json

### Port 5000 already in use
**Solution:** Change port in main.py (line 610):
```python
app.run(host='127.0.0.1', port=5001, debug=False)
```

Then update chat.html API URL (line 343) to:
```javascript
fetch('http://127.0.0.1:5001/api/query', {
```

## 📚 More Information

- **Detailed Setup:** See [CHAT/README.md](CHAT/README.md)
- **Technical Details:** See [VISUALIZATION_INTEGRATION_SUMMARY.md](VISUALIZATION_INTEGRATION_SUMMARY.md)
- **API Documentation:** See [CHAT/README.md#api-endpoints](CHAT/README.md#api-endpoints)

## 🎯 Ready to Use!

Your system is now fully integrated with:
- ✅ Visualization generation in chat.html
- ✅ Connected data flow from data.json
- ✅ All three interfaces synchronized
- ✅ No code changes needed - just run and use!

**Happy querying!** 🌊💧
