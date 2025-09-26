// ===== LOGIN.JS =====
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = document.getElementById("identifier").value.trim(); // email or phone
  const password = document.getElementById("password").value.trim();

  if (!identifier || !password) {
    alert("Please enter email/phone and password");
    return;
  }

  const isEmail = identifier.includes("@");
  const payload = isEmail
    ? { email: identifier, password }
    : { phone: identifier, password };

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save user info AFTER successful login
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name); // store name
      localStorage.setItem("email", data.email);

      // Redirect to chat page
      window.location.href = "chat.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
