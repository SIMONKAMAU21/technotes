import {Router} from 'express';
import { addMessage, deleteMessage, getAllMessages, getMessageById, getMessageBySenderId } from '../controllers/messageController.js';


const messageRouter =Router();

messageRouter.post('/message/add',addMessage);
messageRouter.delete('/message/:id',deleteMessage);
messageRouter.get('/messages',getAllMessages);
messageRouter.get('/message/:id',getMessageById)
messageRouter.get('/message/:studentId',getMessageBySenderId)


export default messageRouter;