const Chat = require('./models/chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIzaSyCLI1LkxnrgHCHGoOqfjt3D9J0ga75N_Xc');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.getChatHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.userId });
    res.json(chat || { messages: [] });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to load chat history' });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;

    // Validate input
    if (!sender || !text) {
      return res.status(400).json({ error: 'Sender and text are required' });
    }

    let chat = await Chat.findOne({ userId: req.userId });
    if (!chat) {
      chat = new Chat({ userId: req.userId, messages: [] });
    }
    chat.messages.push({ sender, text, timestamp: new Date() });
    await chat.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

exports.generateAIResponse = async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are a helpful assistant for groundwater data analysis. Answer questions about groundwater, water quality, assessments, and related topics. User question: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
};
