import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { allowedOrigins } from "./config/allowedOrigins.js";
import userRouter from "./api/userRoutes.js";
import classRouter from "./api/classRoutes.js";
import studentRouter from "./api/studentRoutes.js";
import subjectRouter from "./api/subjectRoutes.js";
import attendanceRouter from "./api/attedanceRoutes.js";
import feeRouter from "./api/feeRoutes.js";
import gradeRouter from "./api/gradeRoutes.js";
import messageRouter from "./api/messageRoutes.js";
import eventRouter from "./api/eventRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
connectDb().catch(console.dir);

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

io.on("connection", (socket) => {
  // console.log("connected", socket.connected);
  socket.emit("connected", { message: "You are connected to Socket.io!" });
  socket.on("disconnecting", () => {
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

// Base health check route
app.get("/", (req, res) => {
  res.redirect(`https://simon-kamau.vercel.app/`);
});

// Route imports
app.use("/api", userRouter);
app.use("/api", classRouter);
app.use("/api", studentRouter);
app.use("/api", subjectRouter);
app.use("/api", attendanceRouter);
app.use("/api", feeRouter);
app.use("/api", gradeRouter);
app.use("/api", messageRouter);
app.use("/api", eventRouter);

// Server configuration
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // console.warn(`Server is up and running on port 😄: ${PORT}`);
});
export { io };
export default app;
