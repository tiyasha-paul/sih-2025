import os
import pickle
from typing import Optional, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatbotInference:
    def __init__(self, model_dir: str = "chatbot_model"):
        """
        Initialize the chatbot inference engine.
        
        Args:
            model_dir (str): Directory containing the trained model files
        """
        self.model_dir = model_dir
        self.model = None
        self.model_type = None
        self.load_model()
    
    def load_model(self) -> bool:
        """
        Load the trained model from the chatbot_model directory.
        
        Supported model types:
        - .pkl files (scikit-learn, pickle)
        - .pt files (PyTorch) 
        - Hugging Face models (model files in directory)
        
        Returns:
            bool: True if model loaded successfully, False otherwise
        """
        if not os.path.exists(self.model_dir):
            logger.warning(f"Model directory {self.model_dir} not found")
            return False
            
        # Check for different model file types
        model_files = os.listdir(self.model_dir)
        
        if not model_files:
            logger.info("No model files found in chatbot_model directory")
            return False
            
        # Try to load .pkl files (scikit-learn, pickle models)
        pkl_files = [f for f in model_files if f.endswith('.pkl')]
        if pkl_files:
            try:
                model_path = os.path.join(self.model_dir, pkl_files[0])
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                self.model_type = "pickle"
                logger.info(f"Loaded pickle model from {model_path}")
                return True
            except Exception as e:
                logger.error(f"Failed to load pickle model: {e}")
        
        # Try to load .pt files (PyTorch models)
        pt_files = [f for f in model_files if f.endswith('.pt')]
        if pt_files:
            try:
                # Uncomment when torch is available:
                # import torch
                # model_path = os.path.join(self.model_dir, pt_files[0])
                # self.model = torch.load(model_path)
                # self.model_type = "pytorch"
                # logger.info(f"Loaded PyTorch model from {model_path}")
                # return True
                logger.info("PyTorch model detected but torch not installed. Install torch to use .pt models.")
            except Exception as e:
                logger.error(f"Failed to load PyTorch model: {e}")
        
        # Try to load Hugging Face models
        config_files = [f for f in model_files if f in ['config.json', 'pytorch_model.bin']]
        if config_files:
            try:
                # Uncomment when transformers is available:
                # from transformers import AutoTokenizer, AutoModelForCausalLM
                # self.tokenizer = AutoTokenizer.from_pretrained(self.model_dir)
                # self.model = AutoModelForCausalLM.from_pretrained(self.model_dir)
                # self.model_type = "huggingface"
                # logger.info(f"Loaded Hugging Face model from {self.model_dir}")
                # return True
                logger.info("Hugging Face model detected but transformers not installed. Install transformers to use HF models.")
            except Exception as e:
                logger.error(f"Failed to load Hugging Face model: {e}")
        
        logger.warning("No compatible model found or failed to load model")
        return False
    
    def predict(self, message: str) -> str:
        """
        Generate a response to the user message.
        
        Args:
            message (str): User input message
            
        Returns:
            str: Chatbot response
        """
        if self.model is None:
            return self._get_dummy_response(message)
        
        try:
            # Add your model-specific inference logic here
            if self.model_type == "pickle":
                # Example for scikit-learn or custom pickle models
                # response = self.model.predict([message])[0]
                # return str(response)
                pass
            
            elif self.model_type == "pytorch":
                # Example for PyTorch models
                # import torch
                # with torch.no_grad():
                #     inputs = self.tokenizer.encode(message, return_tensors='pt')
                #     outputs = self.model.generate(inputs, max_length=100)
                #     response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                #     return response
                pass
            
            elif self.model_type == "huggingface":
                # Example for Hugging Face models
                # inputs = self.tokenizer.encode(message, return_tensors='pt')
                # outputs = self.model.generate(inputs, max_length=100, pad_token_id=self.tokenizer.eos_token_id)
                # response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                # return response.replace(message, "").strip()
                pass
            
            # If model type is recognized but inference fails, return dummy response
            return self._get_dummy_response(message)
            
        except Exception as e:
            logger.error(f"Error during model inference: {e}")
            return self._get_dummy_response(message)
    
    def _get_dummy_response(self, message: str) -> str:
        """
        Generate a dummy response when no model is available.
        
        Args:
            message (str): User input message
            
        Returns:
            str: Dummy response with instructions
        """
        dummy_responses = [
            "I'm a demo chatbot! To enable real AI responses, please place your trained model in the 'backend/chatbot_model/' directory.",
            "Hello! I'm currently running in demo mode. Upload your trained model (.pkl, .pt, or Hugging Face) to the chatbot_model folder to activate intelligent responses.",
            "I see you said: '{message}'. I'm in demo mode - add your AI model to get smart responses!",
            "Demo mode active! Place your trained chatbot model in backend/chatbot_model/ to enable real AI conversations.",
            "Thanks for your message! I'm waiting for a real AI model to be uploaded to give you better responses."
        ]
        
        import random
        response = random.choice(dummy_responses)
        
        # Some responses include the user message
        if '{message}' in response:
            response = response.format(message=message)
            
        return response
    
    def is_model_loaded(self) -> bool:
        """Check if a model is currently loaded."""
        return self.model is not None
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model."""
        return {
            "model_loaded": self.is_model_loaded(),
            "model_type": self.model_type,
            "model_dir": self.model_dir,
            "available_files": os.listdir(self.model_dir) if os.path.exists(self.model_dir) else []
        }


# Global inference instance
chatbot = ChatbotInference()

def get_chatbot_response(message: str) -> str:
    """
    Main function to get chatbot response.
    
    Args:
        message (str): User input message
        
    Returns:
        str: Chatbot response
    """
    return chatbot.predict(message)

def get_model_status() -> dict:
    """Get current model status and information."""
    return chatbot.get_model_info()