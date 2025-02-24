const socket = io('http://localhost:3000');
const msgContainer = document.getElementById('msg-container');
const msgForm = document.getElementById('send-container');
const msgInput = document.getElementById('msg-input');

const name = prompt("What is your name?");
appendMessage("You joined the chat", "system");
socket.emit('new-user', name);

// Listen for chat messages
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`, "received");
});

// Listen for user connection
socket.on('user-connected', name => {
    appendMessage(`${name} connected`, "system");
});

// Listen for user disconnection
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`, "system");
});

// Handle message submission
msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = msgInput.value.trim();
    if (message === "") return;

    appendMessage(`You: ${message}`, "sent");
    socket.emit('send-chat-message', message);
    msgInput.value = '';
});

// Function to append messages
function appendMessage(message, type) {
    const msgElement = document.createElement('div');
    msgElement.innerText = message;

    // Differentiate message types (sent, received, system messages)
    if (type === "sent") {
        msgElement.style.backgroundColor = "#007bff";
        msgElement.style.color = "white";
        msgElement.style.alignSelf = "flex-end";
    } else if (type === "received") {
        msgElement.style.backgroundColor = "#ddd";
        msgElement.style.color = "black";
    } else {
        msgElement.style.backgroundColor = "#f9f9f9";
        msgElement.style.fontStyle = "italic";
        msgElement.style.textAlign = "center";
    }

    msgElement.style.padding = "10px";
    msgElement.style.borderRadius = "5px";
    msgElement.style.margin = "5px 0";
    msgElement.style.maxWidth = "70%";

    msgContainer.appendChild(msgElement);
    msgContainer.scrollTop = msgContainer.scrollHeight; // Auto-scroll to latest message
}
