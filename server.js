const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

app.use(express.static(path.join(__dirname,'public')))

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user joining
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    // Handle chat messages
    socket.on('send-chat-message', (message) => {
        if (users[socket.id]) {
            socket.broadcast.emit('chat-message', {
                message: message,
                name: users[socket.id],
            });
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('user-disconnected', users[socket.id]);
            delete users[socket.id];
        }
    });
});

// Start the server
server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
