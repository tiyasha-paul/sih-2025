// Function to check if JWT token is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (e) {
    return true;
  }
}

// Function to validate token and redirect if expired
function validateToken() {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('chatData');
    alert('Your session has expired. Please log in again.');
    window.location.href = 'login.html';
  }
}

// Apply stored theme immediately on page load
const darkMode = localStorage.getItem("darkMode");
if (darkMode === "true") {
  document.body.classList.add("dark");
} else if (darkMode === "false") {
  document.body.classList.remove("dark");
}

// Validate token on page load
validateToken();


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

// Function to load chat from server or localStorage
async function loadChat() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:3000/api/chat/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(msg => {
            addMessage(msg.sender, msg.text);
          });
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load chat from server:', err);
    }
  }

  // Fallback to localStorage
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
  sendBtn.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    userInput.value = "";

    // Show loading state
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot loading";
    loadingDiv.textContent = "Thinking...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      // Save message to Node.js server
      const saveResponse = await fetch("http://localhost:3000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sender: "user", text: text })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save message');
      }

      // Get bot response from Python server
      const botResponse = await fetch("http://localhost:8000/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      if (botResponse.ok) {
        const botData = await botResponse.json();
        // Remove loading message
        chatMessages.removeChild(loadingDiv);
        addMessage("bot", botData.response);
      } else {
        throw new Error('Failed to get bot response');
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Remove loading message
      if (chatMessages.contains(loadingDiv)) {
        chatMessages.removeChild(loadingDiv);
      }
      addMessage("bot", "Sorry, I couldn't process your message. Please try again.");
    }
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

const googleBtn = document.getElementById('googleSignInBtn');
if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    window.location.href = 'http://localhost:8000/auth/login';
  });
}

// Function to show updates message
function showUpdatesMessage() {
  alert('Will bring more updates soon..');
}
