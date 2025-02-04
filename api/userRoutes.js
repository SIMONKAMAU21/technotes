import {Router} from 'express';
import { addUser, createConversation, deleteUser, getAllUsers, getUserById, login, updateUser } from '../controllers/userController.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';

const userRouter =Router();

userRouter.post('/users/add',Auth,checkAdmin, addUser);
userRouter.post('/users/login',login);
userRouter.delete('/users/:id',Auth,checkAdmin,deleteUser);
userRouter.get('/users',checkAdmin,getAllUsers);
userRouter.get('/users/:id',getUserById);
userRouter.put('/user/:id',Auth,checkAdmin,updateUser)
userRouter.post('/create/conversation',createConversation)



export default userRouter;