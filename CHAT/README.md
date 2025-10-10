# HydroLens Chat Interface - Setup Guide

## Overview
This system provides multiple interfaces for querying groundwater data with visualization capabilities:
- **chat.html**: Web-based chat interface with visualization support
- **app.py**: Streamlit app with auto-visualization
- **streamlit_app.py**: Alternative Streamlit interface
- **main.py**: Flask API server for serving visualizations

## Prerequisites
```bash
pip install streamlit langchain-huggingface langchain-community faiss-cpu flask flask-cors googletrans==4.0.0rc1 matplotlib pandas numpy python-dotenv langchain-google-genai transformers torch peft datasets
```

## Running the System

### Option 1: Using chat.html (Recommended for visualizations)

1. **Start the Flask API server:**
   ```bash
   cd CHAT
   python main.py --serve
   ```
   This starts the server at `http://127.0.0.1:5000`

2. **Open chat.html in your browser:**
   - Simply open `chat.html` in your web browser
   - Or navigate to `http://127.0.0.1:5000/` if the Flask server is running

3. **Query examples:**
   - `Show trend for Delhi 2024`
   - `Category bar for Rohini 2024`
   - `Plot graph for West Bengal`
   - `Groundwater extraction for Delhi Civil Lines 2024`
   - `Rainfall in Rohini 2024`

### Option 2: Using Streamlit (app.py)

```bash
cd CHAT
streamlit run app.py
```

### Option 3: Using Alternative Streamlit Interface

```bash
cd CHAT
streamlit run streamlit_app.py
```

## Features

### Visualization Types

1. **Trend Plot**: Shows groundwater extraction trends over time
   - Keywords: `trend`, `plot`, `graph`, `extraction`
   - Example: "Show trend for Delhi 2024"

2. **Category Bar Chart**: Distribution of groundwater categories
   - Keywords: `category`, `bar`, `distribution`
   - Example: "Category bar for Rohini 2024"

### Data Queries

- **Groundwater Data**: Extraction, SGWD%, categories
- **Rainfall Data**: Precipitation levels
- **Multi-language Support**: English, Hindi, Bengali, Tamil, Telugu

## How Visualizations Work

When you ask for a visualization in **chat.html**:

1. The query is sent to the Flask API at `/api/query`
2. The API extracts location, state, and year from your query
3. It generates the appropriate matplotlib visualization
4. The image is saved to `/static/` directory
5. The image URL is returned and displayed in the chat

## Troubleshooting

### "Error contacting visualization server"
- Make sure Flask server is running: `python CHAT/main.py --serve`
- Check that port 5000 is not blocked

### "No data available"
- Verify the state and year exist in your dataset
- Check `data.json` for available locations

### Visualizations not showing
- Ensure matplotlib backend is set correctly (already configured as 'Agg')
- Check browser console for CORS errors
- Verify `/static/` directory exists and has write permissions

## File Structure

```
CHAT/
├── main.py              # Flask API + RAG system + Visualizations
├── app.py               # Streamlit interface
├── streamlit_app.py     # Alternative Streamlit interface
├── data.json            # Groundwater dataset
├── faiss_index/         # Vector store for RAG
├── static/              # Generated visualization images (auto-created)
└── metadata.json        # Preprocessed metadata (auto-generated)

chat.html                # Web chat interface (root directory)
```

## API Endpoints

- `GET /` - Serves chat.html
- `GET /CHAT/metadata.json` - Returns dataset metadata
- `POST /api/query` - Main query endpoint
  - Request: `{ "query": "string", "lang": "string" }`
  - Response: `{ "answer": "string", "graph": "/static/image.png" }`
- `GET /static/<filename>` - Serves generated visualization images

## Notes

- All three interfaces (chat.html, app.py, streamlit_app.py) are now synchronized
- Visualizations are automatically generated based on query keywords
- The system uses state inference to determine location context
- Images are timestamped to prevent caching issues
