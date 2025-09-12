const Chat = require('./models/chat');

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
