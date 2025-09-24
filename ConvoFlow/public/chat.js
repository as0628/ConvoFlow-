const token = localStorage.getItem("token"); // set this after login
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Fetch all messages
async function loadMessages() {
  const res = await fetch("/api/chat/messages", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  messagesDiv.innerHTML = "";
  data.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<strong>${msg.Signup.name}:</strong> ${msg.message} <small>${new Date(msg.createdAt).toLocaleTimeString()}</small>`;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;
  await fetch("/api/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: text }),
  });
  input.value = "";
  loadMessages();
});

// Initial load
loadMessages();
