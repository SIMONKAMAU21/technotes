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
import { errorHandler } from "./middleware/error.js";
import morgan from "morgan";
import fs from "fs"
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { app, server } from "./lib/socket.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logStream = fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})
app.use(morgan('dev',{stream:logStream}))

// Base health check route
app.get("/", (req, res) => {
  res.redirect(`https://simon-kamau.vercel.app/`);
});
// app.get("/", (req, res) => {
//   res.send("Welcome to the School Management System API mark!")
// });
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

app.use(errorHandler)
// Server configuration
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDb().catch(console.dir);

  // console.warn(`Server is up and running on port 😄: ${PORT}`);
});

