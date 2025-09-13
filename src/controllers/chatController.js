const Chat = require('../models/chat');
const fetch = require('node-fetch');

exports.getChatHistory = async (req, res) => {
  const chat = await Chat.findOne({ userId: req.userId });
  res.json(chat || { messages: [] });
};

exports.saveMessage = async (req, res) => {
  const { sender, text } = req.body;
  let chat = await Chat.findOne({ userId: req.userId });
  if (!chat) {
    chat = new Chat({ userId: req.userId, messages: [] });
  }
  chat.messages.push({ sender, text });
  await chat.save();

  try {
    const response = await fetch('http://localhost:8000/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    res.json({ success: true, message: data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error calling python chatbot' });
  }
};