document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const identifier = document.getElementById('identifier').value.trim(); // email or phone
  const password = document.getElementById('password').value.trim();

  // Determine if the identifier is email or phone
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
      // Save JWT and user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("isPremium", data.isPremium);

      // Redirect based on premium status
      if (data.isPremium === 1 || data.isPremium === true) {
        window.location.href = "premiumexpense.html";
      } else {
        window.location.href = "expense.html";
      }
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
