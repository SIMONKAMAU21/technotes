import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  conversationId: { type: String, required: true },
  read: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
