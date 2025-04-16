import {Router} from 'express';
import { addMessage, deleteMessage, deleteUserConversations, getAllMessages, getConversationBetweenUsers, getMessageById,  getMessagesInConversation, getUserConversations } from '../controllers/messageController.js';
import { Auth } from '../middleware/Auth.js';


const messageRouter =Router();

messageRouter.post('/message/add',Auth, addMessage);
messageRouter.delete('/message/:id',Auth,deleteMessage);
messageRouter.get('/messages',Auth,getAllMessages);
messageRouter.get('/message/:id',Auth,getMessageById);
// messageRouter.get('/messages/:id',getMessageBySenderId);
messageRouter.get("/messages/conversation/:userAId/:userBId",Auth, getConversationBetweenUsers);
messageRouter.get("/messages/user/:userId/conversations",Auth, getUserConversations);
messageRouter.get("/messages/conversation/:conversationId", Auth,getMessagesInConversation);
messageRouter.patch("/messages/conversation/:userId/:conversationId",Auth, deleteUserConversations);


export default messageRouter;