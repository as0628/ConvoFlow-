const token = localStorage.getItem("token");
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const recipientInput = document.getElementById("recipientInput");
const connectBtn = document.getElementById("connectBtn");
const statusText = document.getElementById("status");

let roomId = null; // will be set when connected
let myEmail = localStorage.getItem("email");

// Connect to Socket.IO backend with JWT
const socket = io("http://localhost:3000", {
  auth: { token }
});

// Helper → Generate unique roomId
function generateRoomId(user1, user2) {
  return [user1, user2].sort().join("_");
}

// Connect to recipient
connectBtn.addEventListener("click", async () => {
  const recipient = recipientInput.value.trim();
  if (!recipient) {
    alert("Enter recipient email or phone");
    return;
  }

  try {
    // ✅ Validate recipient via API
    const res = await fetch(`/api/users/validate?email=${recipient}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (!data.exists) {
      statusText.textContent = "❌ User not found.";
      return;
    }

    // ✅ Generate roomId
    roomId = generateRoomId(myEmail, recipient);

    // ✅ Join the room
    socket.emit("join_room", { roomId, recipient });
    statusText.textContent = `✅ Connected with ${recipient}`;

    // Clear chat box for this room
    messagesDiv.innerHTML = "";

  } catch (err) {
    console.error("Error validating recipient:", err);
  }
});

// Render one message
function addMessageToUI(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${msg.sender || "Unknown"}:</strong> 
                   ${msg.message} 
                   <small>${new Date(msg.createdAt).toLocaleTimeString()}</small>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send personal message
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text || !roomId) return;

  const msgData = {
    roomId,
    message: text,
    sender: myEmail
  };

  socket.emit("personalMessage", msgData);
  input.value = "";
});

// Listen for personal messages
socket.on("personalMessage", (msg) => {
  addMessageToUI(msg);
});
