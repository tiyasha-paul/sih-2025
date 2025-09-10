const Chat = require('../models/Chat');

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
  res.json({ success: true });
};