import { hashPassword, sendBadRequest, sendCreated, sendDeleteSuccess, sendNotFound, sendServerError } from "../helpers/helperFunctions.js";
import Message from "../model/messageModal.js";
import User from "../model/userModal.js";

export const addMessage = async (req, res) => {
    const { senderId, receiverId, content, timestamp } =
        req.body;
    try {
        const senderExists = await User.findOne({ _id: senderId }).lean().exec();
        if (!senderExists) {
            return sendBadRequest(res, "sender does not exists");
        }
        const recieverExists = await User.findOne({ _id: receiverId }).lean().exec();
        if (!recieverExists) {
            return sendBadRequest(res, "reciver does not exists");
        }
       
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            timestamp,
        });

        // Save Message to the database
        await newMessage.save();

        sendCreated(res, `message sent to ${receiverId} successfully`, newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const deleteMessage = async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (!message) {
        sendNotFound(res, "Message not found");
    }
    if (message) {
        await message.deleteOne();
        sendDeleteSuccess(res, "Message deleted succefully");
    } else {
        res.status(500).json({ message: "Server error" });
    }
};


export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).populate('senderId','name').populate('receiverId','name').sort({ name: -1 });

        if (!messages || messages.length === 0) {
            return sendNotFound(res, "No Messages found");
        } else {
            return res.status(200).json(messages);
        }
    } catch (error) {
        console.log('error', error)
        return res.status(500).json({ message: "Server error" });
    }
};


export const getMessageById = async (req, res) => {
    try {
        const messages = await Message.findById(req.params.id).populate('senderId','name').populate('receiverId','name')
        if (messages) {
            res.status(200).send(messages)
        } else {
            sendNotFound(res, "no Message with the id is found")
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const getMessageBySenderId = async (req, res) => {
    try {
        const messages = await Message.find({senderId: req.params.senderId,receiverId:req.params.receiverId}).lean().exec()
        if (messages.length > 0) {
            res.status(200).send(messages)
        } else {
            sendNotFound(res, "no Message found for the provided receiver id or receiver id")
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Server error" });
    }
}


