# HydroLens Chatbot Integration Guide

This guide shows how to run the complete HydroLens chatbot system with the new FastAPI backend.

## Quick Start

### 1. Start the FastAPI Backend
```bash
cd backend
./start.sh
```
**or manually:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will be available at: `http://localhost:8000`

### 2. Serve the Frontend
```bash
# From the project root directory
python -m http.server 3000
```

The frontend will be available at: `http://localhost:3000`

### 3. Open the Chat Interface
Navigate to: `http://localhost:3000/chat.html`

## Demo Screenshots

![Chatbot Integration Demo](chatbot_integration_demo.png)

The chat interface successfully:
- ✅ Sends user messages to the FastAPI backend
- ✅ Receives and displays bot responses
- ✅ Shows demo responses when no AI model is loaded
- ✅ Maintains chat history in localStorage

## Adding Your AI Model

### Step 1: Prepare Your Model
Train your chatbot model using any supported framework:
- **Scikit-learn**: Save as `.pkl` file
- **PyTorch**: Save as `.pt` file  
- **Hugging Face**: Save all model files (config.json, pytorch_model.bin, etc.)

### Step 2: Place Model Files
Copy your model files to:
```
backend/chatbot_model/
├── README.md              # Keep this file
└── your_model.pkl         # Your trained model
```

### Step 3: Install Dependencies
Uncomment the relevant lines in `backend/requirements.txt`:
```python
# For PyTorch models
torch==2.1.0

# For Hugging Face models  
transformers==4.35.0

# For data processing
numpy==1.24.3
pandas==2.1.0
```

Then reinstall:
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Restart Backend
```bash
cd backend
python main.py
```

The model will be automatically detected and loaded!

## API Endpoints

The FastAPI backend provides several endpoints:

- **POST /chat** - Main chat endpoint
- **POST /api/send-message** - Frontend-compatible endpoint
- **GET /model-status** - Check model loading status
- **GET /docs** - Interactive API documentation
- **GET /setup-instructions** - Model setup guide

## Troubleshooting

### Backend Issues
- **Port 8000 in use**: Change port in `main.py`
- **Model not loading**: Check `chatbot_model/` directory and file format
- **Dependencies missing**: Install required packages from `requirements.txt`

### Frontend Issues
- **CORS errors**: Ensure backend is running on port 8000
- **No responses**: Check browser console for network errors
- **Chat not working**: Verify frontend can reach `http://localhost:8000`

### Integration Issues
- **Messages not sending**: Check that both frontend (port 3000) and backend (port 8000) are running
- **Responses not showing**: Verify the `script.js` is updated with the correct backend URL

## Production Deployment

For production deployment:

1. **Backend**: Use a production ASGI server like Gunicorn
2. **Frontend**: Serve static files with Nginx or Apache
3. **Security**: Update CORS settings to allow only your domain
4. **Environment**: Use environment variables for configuration

## System Architecture

```
Frontend (Port 3000)          Backend (Port 8000)
┌─────────────────┐          ┌─────────────────┐
│   chat.html     │          │   FastAPI App   │
│   script.js     │ ────────▶│   main.py       │
│                 │          │                 │
│                 │          │  ┌─────────────┐│
│                 │◀─────────│  │ Inference   ││
│                 │          │  │ Engine      ││
└─────────────────┘          │  └─────────────┘│
                             │         │       │
                             │  ┌─────────────┐│
                             │  │ AI Model    ││
                             │  │ (.pkl/.pt)  ││
                             │  └─────────────┘│
                             └─────────────────┘
```

The system is now fully integrated and ready for use with both demo responses and real AI models!