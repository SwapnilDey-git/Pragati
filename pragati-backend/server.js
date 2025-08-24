require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// --- CORS FIX ---
// Added your new origin 'http://127.0.0.1:5500' to the list
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5500"];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// --- API ROUTES ---
// Make sure you have created the 'models' and 'routes' folders and files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/worker', require('./routes/worker'));
app.use('/api/contractor', require('./routes/contractor'));

// --- REAL-TIME SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('broadcastJob', (jobDetails) => {
    socket.broadcast.emit('newJobNotification', jobDetails);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});