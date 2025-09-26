const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Chat = require("./models/chatModel");
const personalChatHandler = require("./handlers/personalChat");

const SECRET_KEY = process.env.SECRET_KEY || "defaultsecret";

function initSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  // 🔑 Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  // 🔑 Main connection handler
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.user.email})`);

    // === Group chat messages ===
    socket.on("chatMessage", async (msgObj) => {
      try {
        const text = typeof msgObj === "string" ? msgObj : msgObj.message;
        if (!text) return;

        const savedMsg = await Chat.create({
          message: text,
          userId: socket.user.id,
        });

        io.emit("chatMessage", {
          id: savedMsg.id,
          message: savedMsg.message,
          createdAt: savedMsg.createdAt,
          user: socket.user.name,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    // === Personal chat messages ===
    personalChatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user?.email || "Unknown"}`);
    });
  });
}

module.exports = initSocket;
