import {Router} from 'express';
import { addMessage, deleteMessage, deleteUserConversations, getAllMessages, getConversationBetweenUsers, getMessageById,  getMessagesInConversation, getUserConversations } from '../controllers/messageController.js';


const messageRouter =Router();

messageRouter.post('/message/add',addMessage);
messageRouter.delete('/message/:id',deleteMessage);
messageRouter.get('/messages',getAllMessages);
messageRouter.get('/message/:id',getMessageById);
// messageRouter.get('/messages/:id',getMessageBySenderId);
messageRouter.get("/messages/conversation/:userAId/:userBId", getConversationBetweenUsers);
messageRouter.get("/messages/user/:userId/conversations", getUserConversations);
messageRouter.get("/messages/conversation/:conversationId", getMessagesInConversation);
messageRouter.patch("/messages/conversation/:userId/:conversationId", deleteUserConversations);


export default messageRouter;