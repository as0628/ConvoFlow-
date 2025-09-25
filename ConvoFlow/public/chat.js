const token = localStorage.getItem("token"); // set this after login
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Connect to Socket.IO backend
const socket = io(); // assumes same origin; if backend is on another host: io("http://localhost:3000")

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

// Helper: Render one message
function addMessageToUI(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${msg.Signup?.name || "Unknown"}:</strong> ${msg.message} 
    <small>${new Date(msg.createdAt).toLocaleTimeString()}</small>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message
sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  // Save message to DB via API
  await fetch("/api/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: text }),
  });

  // Emit live event
  socket.emit("chatMessage", {
    message: text,
    createdAt: new Date(),
    Signup: { name: localStorage.getItem("name") || "You" } // optional: show instantly
  });

  input.value = "";
});

// Listen for live messages
socket.on("chatMessage", (msg) => {
  addMessageToUI(msg);
});

// Initial load
loadMessages();
