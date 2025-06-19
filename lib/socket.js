import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import { allowedOrigins } from "../config/allowedOrigins.js";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// FIXED: All socket event handlers must be INSIDE the connection handler
io.on("connection", (socket) => {
    io.emit("connected", socket.id);
//   console.error("User connected:", socket.id);
  
  // Emit connection confirmation
  socket.emit("connected", { message: "You are connected to Socket.io!" });
  
 socket.on("join", (userId) => {
    socket.join(userId); // Add this socket to a room named with the user ID
    console.log(`User ${userId} joined their room.`);
  });
  // Handle joining conversation rooms
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    io.to(conversationId).emit("user has joined", socket.id);
    // console.warn(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Handle leaving conversation rooms
  socket.on("leaveConversation", (conversationId) => {
    socket.leave(conversationId);
    socket.to(conversationId).emit("user has left", socket.id);
    // console.warn(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    socket.to(data.conversationId).emit("userTyping", {
      userId: socket.userId,
      conversationId: data.conversationId,
    });
  });

  socket.on("stopTyping", (data) => {
    socket.to(data.conversationId).emit("userStoppedTyping", {
      userId: socket.userId,
      conversationId: data.conversationId,
    });
  });

  // Handle user authentication (optional)
  socket.on('authenticate', (userData) => {
    socket.userId = userData.userId;
    socket.join(`user_${userData.userId}`);
    // console.log(`User ${userData.userId} authenticated and joined personal room`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {

    // console.log("User disconnected:", socket.id);
  });

  // Handle disconnecting (before full disconnect)
  socket.on("disconnecting", () => {
    // console.log("User disconnecting:", socket.id);
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });
});

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

export { io, app, server };