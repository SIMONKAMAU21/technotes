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
import axios from "axios";

dotenv.config();
connectDb().catch(console.dir);

const app = express();

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.json());

// Base health check route
app.get("/", (req, res) => {
  res.send(`Health check: Server running on port ${PORT}... 😄`);
});

// Chatwoot API credentials
const CHATWOOT_API_TOKEN = process.env.CHATWOOT_API_TOKEN;
const CHATWOOT_BASE_URL = process.env.CHATWOOT_BASE_URL;

// Function to send a message to Chatwoot
const sendToChatwoot = async (conversationId, message) => {
  try {
    const response = await axios.post(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/{account_id}/conversations/${conversationId}/messages`,
      {
        content: message,
        message_type: "incoming",
      },
      {
        headers: {
          Authorization: `Bearer ${CHATWOOT_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Message sent to Chatwoot:", response.data);
  } catch (error) {
    console.error("Error sending message to Chatwoot:", error.response?.data || error.message);
  }
};

// Function to fetch or create a Chatwoot conversation
const fetchOrCreateConversation = async (contactId, inboxId) => {
  try {
    // Step 1: Check if a conversation exists for the contact
    const response = await axios.get(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/{account_id}/conversations`,
      {
        headers: {
          Authorization: `Bearer ${CHATWOOT_API_TOKEN}`,
        },
      }
    );

    const conversation = response.data.conversations.find(
      (conv) => conv.contact_id === contactId
    );

    if (conversation) {
      return conversation.id; // Return existing conversation ID
    }

    // Step 2: Create a new conversation if one doesn't exist
    const newConversation = await axios.post(
      `${CHATWOOT_BASE_URL}/api/v1/accounts/{account_id}/conversations`,
      {
        source_id: contactId,
        inbox_id: inboxId,
        status: "open",
      },
      {
        headers: {
          Authorization: `Bearer ${CHATWOOT_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return newConversation.data.id; // Return new conversation ID
  } catch (error) {
    console.error("Error fetching or creating conversation:", error.response?.data || error.message);
    return null;
  }
};

// Slack event handler
app.post("/api/slack/events", async (req, res) => {
  const event = req.body;

  // Slack URL verification
  if (event.type === "url_verification") {
    return res.status(200).send(event.challenge);
  }

  console.log("Slack Event:", event);

  // Handle message events from Slack
  if (event.event && event.event.type === "message") {
    const contactId = event.event.user; // Slack user ID
    const inboxId = "LEjAqysmuaRGAfFjL8sb7euN"; // Replace with the Chatwoot inbox ID
    const message = event.event.text;

    // Fetch or create a Chatwoot conversation
    const conversationId = await fetchOrCreateConversation(contactId, inboxId);

    if (conversationId) {
      // Send the Slack message to Chatwoot
      await sendToChatwoot(conversationId, message);
    } else {
      console.error("Unable to fetch or create a Chatwoot conversation");
    }
  }

  res.status(200).send("Event received");
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

// Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.warn(`Server is up and running on port 😄: ${PORT}`);
});

export default app;
