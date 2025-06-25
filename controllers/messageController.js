import {
  hashPassword,
  sendBadRequest,
  sendCreated,
  sendDeleteSuccess,
  sendNotFound,
  sendServerError,
} from "../helpers/helperFunctions.js";
import { io } from "../lib/socket.js";
import Message from "../model/messageModal.js";
import User from "../model/userModal.js";
import mongoose, { Types } from "mongoose";

export const addMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const senderExists = await User.findById(senderId).lean().exec();
    const receiverExists = await User.findById(receiverId).lean().exec();

    if (!senderExists || !receiverExists) {
      return sendBadRequest(res, "Sender or Receiver does not exist");
    }

    const conversationId = [senderId, receiverId].sort().join("_");

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      conversationId,
      timestamp: new Date(),
      read: false,
    });

    await newMessage.save();

    io.to(conversationId).emit("messageAdded", newMessage);
    sendCreated(res, `Message sent to ${receiverId} successfully`, newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    sendServerError(res, "Server error");
  }
};

export const deleteMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    sendNotFound(res, "Message not found");
  }
  if (message) {
    const messageId = message._id;
    await message.deleteOne();
    io.emit("messageDeleted", messageId);
    sendDeleteSuccess(res, "Message deleted succefully");
  } else {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate("senderId", "name")
      .populate("receiverId", "name")
      .sort({ name: -1 });
    io.emit("messageFetched", messages);
    if (!messages || messages.length === 0) {
      return sendNotFound(res, "No Messages found");
    } else {
      return res.status(200).json(messages);
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const messages = await Message.findById(req.params.id)
      .populate("senderId", "name")
      .populate("receiverId", "name");
    if (messages) {
      res.status(200).send(messages);
    } else {
      sendNotFound(res, "no Message with the id is found");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversationBetweenUsers = async (req, res) => {
  const { userAId, userBId } = req.params;

  try {
    const conversationId = [userAId, userBId].sort().join("_");

    const messages = await Message.find({ conversationId, deleted: false })
      .sort({ timestamp: 1 }) // Oldest first
      .populate("senderId", "name")
      .populate("receiverId", "name");

    if (!messages.length) {
      return sendNotFound(res, "No conversation found");
    }

    io.emit("conversationFetched", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    sendServerError(res, "Server error");
  }
};

export const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new Types.ObjectId(userId) },
            { receiverId: new Types.ObjectId(userId) },
          ],
          deleted: { $ne: true },
        },
      },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.timestamp": -1 } },
    ]);

    // Manual population of sender and receiver
    const populated = await Promise.all(
      conversations.map(async (conversation) => {
        const sender = await User.findById(
          conversation.lastMessage.senderId
        ).select("name photo");
        const receiver = await User.findById(
          conversation.lastMessage.receiverId
        ).select("name photo");
        return {
          ...conversation,
          lastMessage: {
            ...conversation.lastMessage,
            senderId: sender,
            receiverId: receiver,
          },
        };
      })
    );
    // console.log('populated', {...populated , userId})
    io.to(userId).emit("userConversationsFetched", populated);
    res.status(200).json(populated);
  } catch (error) {
    console.error("Error getting user conversations:", error);
    sendServerError(res, "Server error");
  }
};

export const deleteUserConversations = async (req, res) => {
  try {
    const { userId, conversationId } = req.params;
    // console.log("userId", userId);
    // console.log("conversationId", conversationId);
    const result = await Message.updateMany(
      { conversationId },
      { $addToSet: { deletedBy: userId },deleted:true }
    );
    // console.log("result", result);
    if (result.modifiedCount > 0) {
      io.emit("userConversationsDeleted", {conversationId});
      return sendDeleteSuccess(res, "Conversations deleted successfully");
    } else {
      return sendNotFound(
        res,
        "No conversations found for the given user ID and conversation ID"
      );
    }
  } catch (error) {
    console.log(error);
    return sendServerError(res, "Server error");
  }
};

export const getMessagesInConversation = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 }) // Oldest first
      .populate("senderId", "name")
      .populate("receiverId", "name");
    if (!messages.length) {
      return sendNotFound(res, "No messages found in this conversation");
    }
    io.to(conversationId).emit("messagesInConversationFetched", messages);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return sendServerError(res, "Server error");
  }
};
