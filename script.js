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

// Handle New Chat button to start a fresh chat
const newChatBtn = document.getElementById("newChat");
if (newChatBtn && chatMessages) {
  newChatBtn.addEventListener("click", () => {
    localStorage.removeItem("chatData"); 
    chatMessages.innerHTML = "";       
    addMessage("bot", "Hello! How can I help you today?"); 
  });
}

// Function to save chat to localStorage
function saveChat() {
  const messages = [];
  document.querySelectorAll(".chat-messages .message").forEach(msg => {
    messages.push({ sender: msg.classList.contains("user") ? "user" : "bot", text: msg.textContent });
  });
  localStorage.setItem("chatData", JSON.stringify(messages));
}

// Function to load chat from localStorage
function loadChat() {
  const data = localStorage.getItem("chatData");
  if (data) {
    const messages = JSON.parse(data);
    messages.forEach(msg => {
      addMessage(msg.sender, msg.text);
    });
  } else {
    addMessage("bot", "Hello! How can I help you today?");
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  saveChat();
}

if (sendBtn && userInput && chatMessages) {
  loadChat();
  sendBtn.addEventListener("click", () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    userInput.value = "";
    
    // Send message to backend (example using fetch)
    fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
      // Optional: handle backend reply here
      // addMessage("bot", data.reply);
    })
    .catch(err => {
      console.error("Message send failed:", err);
    });
  });

    userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      sendBtn.click();    
    }
  });
}

// Clear chat data when logging out so a new chat starts next time
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("chatData"); // Remove saved chat when logging out
  });
}

// Sidebar hamburger toggle
const hamburger = document.getElementById("hamburger");
const sidebar = document.querySelector(".sidebar");

if (hamburger && sidebar) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
}

// index.html sidebar toggle
const indexHamburger = document.getElementById("hamburger");
const indexSidebar = document.querySelector(".index-sidebar");

if (indexHamburger && indexSidebar) {
  indexHamburger.addEventListener("click", () => {
    indexSidebar.classList.toggle("collapsed");
  });
}
