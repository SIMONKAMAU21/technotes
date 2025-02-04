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
const ACCOUNT_ID = process.env.ACCOUNT_ID; // Make sure this is correct

// Function to send a message to Chatwoot
// const sendToChatwoot = async (conversationId, message) => {
//   try {
//     const response = await axios.post(
//       `${CHATWOOT_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations/${conversationId}/messages`,
//       {
//         content: message,
//         message_type: "incoming",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${CHATWOOT_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Message sent to Chatwoot:", response.data);
//   } catch (error) {
//     console.error("Error sending message to Chatwoot:", error.response?.data || error.message);
//   }
// };

// Function to fetch or create a Chatwoot conversation
// const fetchOrCreateConversation = async (contactId, inboxId) => {
//   const payload = {
//     source_id: contactId,
//     inbox_id: inboxId,
//     contact_id: contactId,
//     additional_attributes: {},
//     custom_attributes: { priority_conversation_number: 1 },
//     status: "open",
//     message: {
//       content: "Hello! How can I assist you today?",
//       template_params: {
//         name: "sample_issue_resolution",
//         category: "UTILITY",
//         language: "en_US",
//         processed_params: { "1": "Chatwoot" },
//       },
//     },
//   };

//   try {
//     console.log("Creating conversation with payload:", payload);

//     const response = await axios.post(
//       `${CHATWOOT_BASE_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations`,
//       payload,
//       {
//         headers: {
//           api_access_token: `T5pFM4hnChzw7hRcr9rXc4R5`, // Use the correct header parameter name
//           "Content-Type": "application/json", // Ensure JSON content type
//         },
//       }
//     );

//     console.log("Conversation created successfully:", response.data);
//     return response.data.id;
//   } catch (error) {
//     console.error(
//       "Error fetching or creating conversation:",
//       error.response?.data || error.message,
//       "Payload:",
//       payload
//     );
//     return null;
//   }
// };





// // Slack event handler
// app.post("/api/slack/events", async (req, res) => {
//   const event = req.body;

//   // Slack URL verification
//   if (event.type === "url_verification") {
//     console.log("Slack URL verification received");
//     return res.status(200).send(event.challenge);
//   }

//   // Validate Slack event structure
//   if (!event.event || !event.event.user || !event.event.text) {
//     console.error("Invalid Slack event structure:", event);
//     return res.status(400).send("Invalid event");
//   }

//   console.log("Processing Slack Event:", event);

//   const contactId = event.event.user; // Slack user ID
//   const inboxId = "LEjAqysmuaRGAfFjL8sb7euN"; // Replace with a valid Chatwoot inbox ID
//   const message = event.event.text;

//   try {
//     const conversationId = await fetchOrCreateConversation(contactId, inboxId);
//     console.log("Chatwoot conversationId:", conversationId);

//     if (conversationId) {
//       await sendToChatwoot(conversationId, message);
//       console.log("Message sent to Chatwoot");
//     } else {
//       console.error("Failed to create or fetch conversation in Chatwoot");
//     }
//   } catch (err) {
//     console.error("Error handling Slack event:", err.message);
//   }

//   res.status(200).send("Event processed");
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

// Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.warn(`Server is up and running on port 😄: ${PORT}`);
});

export default app;
