// create server
import http from "http";
import app from "./app.js";
import "./config/cron.js";
import { Server } from "socket.io";

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
    }
});

// Set global io instance for use in controllers/services
global.io = io;

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // User joins a personal room named by their userId for targeted notifications
    socket.on("join", (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

