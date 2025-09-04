// Dark mode toggle
function setInitialButtonText(btn, isDark) {
  if (!btn) return;
  btn.textContent = isDark ? "Light Mode" : "Dark Mode";
}

const darkToggle = document.getElementById("toggle-theme");
if (darkToggle) {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark");
    setInitialButtonText(darkToggle, true);
  }
  else if (darkMode === "false"){
    document.body.classList.remove("dark");
    setInitialButtonText(darkToggle, false);
  }
  else{
    document.body.classList.add("dark");
    setInitialButtonText(darkToggle, true);
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
    darkToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
}

const darkModeChat = document.getElementById("darkToggle");
if (darkModeChat) {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.body.classList.add("dark");
    setInitialButtonText(darkModeChat, true);
  }
  else if(darkMode === "false") {
    document.body.classList.remove("dark");
    setInitialButtonText(darkModeChat, false);
  }
  else{
    document.body.classList.add("dark");
    setInitialButtonText(darkModeChat, true);
  }

  darkModeChat.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
    darkModeChat.textContent = isDark ? "Light Mode" : "Dark Mode";
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
