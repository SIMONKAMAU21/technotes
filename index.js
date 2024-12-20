import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import { allowedOrigins } from "./config/allowedOrigins.js";
import userRouter from "./api/userRoutes.js";
import classRouter from "./api/classRoutes.js";
import studentRouter from "./api/studentRoutes.js";


dotenv.config();
connectDb().catch(console.dir);
// connectDb()
const app = express();
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json())

app.get("/", (req, res) => {
  res.send(`helth check  port :${PORT} is running.... smile😄`);
});

app.use('/api', userRouter);
app.use('/api',classRouter);
app.use('/api',studentRouter);
// app.use("/api",patientRouter);
// app.use('/api',medicalRouter);
// app.use('/api',treatmentRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.warn(`Server is up and running on port 😄: ${PORT}`);
});

export default app;