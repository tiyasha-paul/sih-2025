# Chatbot Model Directory

This directory is where you should place your trained chatbot model files.

## Supported Model Formats:

### 1. Pickle Models (.pkl)
- Scikit-learn models
- Custom pickle objects
- Place your .pkl file directly in this directory

### 2. PyTorch Models (.pt)
- PyTorch trained models
- Place your .pt file directly in this directory
- Make sure to install: `pip install torch`

### 3. Hugging Face Models
- Transformer models from Hugging Face
- Place all model files (config.json, pytorch_model.bin, tokenizer files) in this directory
- Make sure to install: `pip install transformers`

## Setup Instructions:

1. Train your chatbot model using your preferred framework
2. Save the model in one of the supported formats above
3. Copy the model file(s) to this directory
4. Install any additional dependencies in requirements.txt
5. Restart the FastAPI server

The model will be automatically detected and loaded when the server starts.

## Current Status:
- No model files detected
- API will return dummy responses until a model is placed here

## Example Model Files:
```
chatbot_model/
├── my_model.pkl          # Scikit-learn model
├── pytorch_model.pt      # PyTorch model
└── huggingface/          # Hugging Face model directory
    ├── config.json
    ├── pytorch_model.bin
    ├── tokenizer.json
    └── tokenizer_config.json
```