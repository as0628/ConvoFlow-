const Chat = require("../models/chatModel"); // reuse your chat model

module.exports = function personalChatHandler(io, socket) {
  // ✅ Join a private room
  socket.on("join_room", ({ roomId, recipient }) => {
    socket.join(roomId);
    console.log(`🔗 ${socket.user.email} joined room ${roomId}`);
  });

  // ✅ Handle personal message
  socket.on("personalMessage", async ({ roomId, message, sender }) => {
    if (!roomId || !message) return;

    try {
      // Save in DB (optional: add recipient field)
      const savedMsg = await Chat.create({
        message,
        userId: socket.user.id,
        roomId
      });

      // Broadcast only inside this room
      io.to(roomId).emit("personalMessage", {
        id: savedMsg.id,
        message: savedMsg.message,
        createdAt: savedMsg.createdAt,
        sender
      });

      console.log(`📩 [${roomId}] ${sender}: ${message}`);
    } catch (err) {
      console.error("Error saving personal message:", err);
    }
  });
};
