#!/bin/bash

# HydroLens FastAPI Backend Startup Script

echo "🚀 Starting HydroLens Chatbot Backend..."
echo ""

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ to continue."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Please run this script from the backend/ directory"
    echo "   Example: cd backend && ./start.sh"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check for model files
echo ""
echo "🔍 Checking for AI models..."
if [ -z "$(ls -A chatbot_model/ 2>/dev/null | grep -v README.md)" ]; then
    echo "⚠️  No AI model found in chatbot_model/ directory"
    echo "   The API will run in demo mode with dummy responses"
    echo "   To enable real AI responses:"
    echo "   1. Place your trained model (.pkl, .pt, or Hugging Face files) in chatbot_model/"
    echo "   2. Restart this script"
else
    echo "✅ AI model files detected in chatbot_model/"
fi

echo ""
echo "🌐 Starting FastAPI server..."
echo "   API will be available at: http://localhost:8000"
echo "   API docs available at: http://localhost:8000/docs"
echo "   Setup guide available at: http://localhost:8000/setup-instructions"
echo ""
echo "💡 To stop the server, press Ctrl+C"
echo ""

# Start the server
python main.py