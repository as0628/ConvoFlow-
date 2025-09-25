const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const signupRoutes = require("./routes/signupRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app); // ✅ correct
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json()); // parses JSON from requests into JS objects
app.use(express.urlencoded({ extended: true })); // parses HTML form data into JS objects

// Logging requests to access.log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream })); // log requests

// Serve static files
app.use(express.static(path.join(__dirname, "public"))); 

// Routes
app.use("/api/auth", signupRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg); // broadcast message
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

// Serve home.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/home.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${req.method}] ${req.url} → Error:`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // ✅ must use server.listen




// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();

// const signupRoutes = require("./routes/signupRoutes");
// const chatRoutes = require("./routes/chatRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());// parses JSON from requests into JS objects.
// app.use(express.urlencoded({ extended: true }));//parses HTML form data into JS objects

// // Logging requests to access.log
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );//without these lines we wouldn’t have a saved record of server activity

// app.use(morgan("combined", { stream: accessLogStream })); // Log requests to access.log in detailed format

// // Serve static files
// app.use(express.static(path.join(__dirname, "public"))); // /public folder accessible at the root url


// //Routes
// app.use("/api/auth", signupRoutes);
// app.use("/api/chat", chatRoutes);


// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/home.html"));
// });// Serve home.html at root URL



// app.use((err, req, res, next) => {
//   console.error(`[${req.method}] ${req.url} → Error:`, err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });// Handle errors and send JSON response

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));