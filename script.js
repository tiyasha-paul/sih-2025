// Dark mode toggle
const darkToggle = document.getElementById("toggle-theme");
if (darkToggle) {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  });
}

// Chat logic
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

if (sendBtn && userInput && chatMessages) {
  sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    userInput.value = "";

    // Fake bot reply
    setTimeout(() => {
      addMessage("bot", "You said: " + text);
    }, 500);
  });
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
