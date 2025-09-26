const token = localStorage.getItem("token");
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Connect to Socket.IO backend with JWT
const socket = io("http://localhost:3000", {
  auth: { token }
});

// Fetch old messages from DB
async function loadMessages() {
  try {
    const res = await fetch("/api/chat/messages", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    messagesDiv.innerHTML = "";
    data.forEach(addMessageToUI);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

// Render one message
function addMessageToUI(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${msg.user || msg.Signup?.name || "Unknown"}:</strong> 
                   ${msg.message} 
                   <small>${new Date(msg.createdAt).toLocaleTimeString()}</small>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message (only via socket)
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  // Emit live event → server will save to DB + broadcast
  socket.emit("chatMessage", { message: text });

  input.value = "";
});

// Listen for live messages
socket.on("chatMessage", (msg) => {
  addMessageToUI(msg);
});

// Initial load
loadMessages();
