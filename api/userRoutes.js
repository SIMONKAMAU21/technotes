import {Router} from 'express';
import { addUser, changePassword, deleteUser, getAllUsers, getUserById, login, updateUser } from '../controllers/userController.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';

const userRouter =Router();

userRouter.post('/users/add',Auth,checkAdmin, addUser);
userRouter.post('/users/login',login);
userRouter.delete('/users/:id',Auth,checkAdmin,deleteUser);
userRouter.get('/users',Auth,checkAdmin,getAllUsers);
userRouter.get('/users/:id',getUserById);
userRouter.put('/user/:id',Auth,checkAdmin,updateUser)
userRouter.post('/create/conversation');
userRouter.post('/user/password/:id',changePassword)



export default userRouter;