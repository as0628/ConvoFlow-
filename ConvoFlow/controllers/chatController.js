const Chat = require("../models/chatModel");
const Signup = require("../models/signupModel");

// GET all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      include: [{ model: Signup, attributes: ["name"] }],
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// POST send message
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const newMessage = await Chat.create({
      userId: req.user.id,   // from JWT middleware
      message,
    });

    res.json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
