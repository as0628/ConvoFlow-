document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const identifier = document.getElementById('identifier').value.trim(); // email or phone
  const password = document.getElementById('password').value.trim();

  // Detect email vs phone
  const isEmail = identifier.includes("@");
  const payload = isEmail
    ? { email: identifier, password }
    : { phone: identifier, password };

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Login response:", data);

    if (res.ok) {
      // Save JWT + user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);   // optional, useful for chat UI
      localStorage.setItem("email", data.email);
      localStorage.setItem("phone", data.phone);

      // Redirect to chat window
      window.location.href = "chat.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
