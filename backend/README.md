# HydroLens Chatbot Backend

A FastAPI-based backend for the HydroLens chatbot that supports AI model integration for intelligent conversations about groundwater data.

## Features

- 🚀 **FastAPI REST API** with automatic documentation
- 🤖 **AI Model Integration** supporting multiple formats (Pickle, PyTorch, Hugging Face)
- 🔄 **Frontend Integration** compatible with existing JavaScript frontend
- 🛡️ **Error Handling** with graceful fallbacks
- 📊 **Model Status Monitoring** to check loaded models
- 🎯 **Demo Mode** with dummy responses when no model is available

## Quick Start

### Option 1: Using the startup script (Recommended)
```bash
cd backend
./start.sh
```

### Option 2: Manual setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Main Endpoints
- **POST /chat** - Main chat endpoint for user messages
- **POST /api/send-message** - Alternative endpoint for frontend compatibility
- **GET /model-status** - Get information about loaded models
- **GET /** - Health check endpoint
- **GET /docs** - Interactive API documentation
- **GET /setup-instructions** - Model setup guide

### Example Request
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Example Response
```json
{
  "reply": "Hello! I'm here to help you with groundwater data questions.",
  "model_loaded": true
}
```

## AI Model Integration

### Supported Model Formats

1. **Pickle Models (.pkl)**
   - Scikit-learn models
   - Custom pickle objects
   - Place `.pkl` file in `chatbot_model/` directory

2. **PyTorch Models (.pt)**
   - PyTorch trained models
   - Install: `pip install torch`
   - Place `.pt` file in `chatbot_model/` directory

3. **Hugging Face Models**
   - Transformer models from Hugging Face
   - Install: `pip install transformers`
   - Place all model files in `chatbot_model/` directory

### Adding Your Model

1. **Train your chatbot model** using your preferred framework
2. **Save the model** in one of the supported formats
3. **Copy model files** to the `chatbot_model/` directory
4. **Install dependencies** (uncomment relevant lines in `requirements.txt`)
5. **Restart the server** - the model will be automatically detected and loaded

### Model Directory Structure
```
chatbot_model/
├── README.md                 # Instructions (keep this)
├── my_model.pkl             # Option 1: Pickle model
├── pytorch_model.pt         # Option 2: PyTorch model
└── huggingface_model/       # Option 3: Hugging Face model
    ├── config.json
    ├── pytorch_model.bin
    ├── tokenizer.json
    └── tokenizer_config.json
```

## File Structure

```
backend/
├── main.py                  # FastAPI application
├── requirements.txt         # Python dependencies
├── start.sh                # Startup script
├── utils/
│   └── inference.py        # Model loading and inference logic
└── chatbot_model/          # Directory for AI model files
    └── README.md           # Model setup instructions
```

## Development

### Adding New Model Types

To support additional model formats, edit `utils/inference.py`:

1. Add detection logic in `load_model()`
2. Add inference logic in `predict()`
3. Update `requirements.txt` with necessary dependencies

### Customizing Responses

- **Dummy responses**: Edit `_get_dummy_response()` in `utils/inference.py`
- **Error handling**: Modify exception handling in `main.py`
- **Response format**: Update Pydantic models in `main.py`

## Frontend Integration

The backend is designed to work seamlessly with the existing JavaScript frontend:

- Endpoint `/api/send-message` matches frontend expectations
- JSON request/response format is compatible
- CORS enabled for cross-origin requests
- Error handling provides user-friendly messages

### Frontend Usage
```javascript
fetch("http://localhost:8000/api/send-message", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Your question here" })
})
.then(res => res.json())
.then(data => {
  console.log("Bot reply:", data.reply);
});
```

## Configuration

### Environment Variables
- `MODEL_DIR`: Custom model directory path (default: "chatbot_model")
- `API_PORT`: Custom API port (default: 8000)
- `LOG_LEVEL`: Logging level (default: "INFO")

### Production Deployment
For production deployment:
1. Set `allow_origins` in CORS middleware to specific frontend URLs
2. Configure proper logging
3. Use a production ASGI server like Gunicorn
4. Set up environment variables for configuration

## Troubleshooting

### Common Issues

**"No module named 'torch'"**
- Install PyTorch: `pip install torch`

**"No module named 'transformers'"**
- Install Transformers: `pip install transformers`

**"Model not loading"**
- Check model file is in `chatbot_model/` directory
- Verify file format is supported
- Check server logs for error details

**"CORS error in frontend"**
- Ensure backend is running on port 8000
- Check frontend is using correct backend URL

## License

This project is part of the HydroLens application for SIH 2025.