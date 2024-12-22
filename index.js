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


dotenv.config();
connectDb().catch(console.dir);
// connectDb()
const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions))
app.use(express.json())

app.get("/", (req, res) => {
  res.send(`helth check  port :${PORT} is running.... smile😄`);
});

app.use('/api', userRouter);
app.use('/api',classRouter);
app.use('/api',studentRouter);
app.use("/api",subjectRouter);
app.use('/api',attendanceRouter);
app.use('/api',feeRouter);
app.use('/api',gradeRouter);
app.use('/api',messageRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.warn(`Server is up and running on port 😄: ${PORT}`);
});

export default app;