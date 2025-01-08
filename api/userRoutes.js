import {Router} from 'express';
import { addUser, deleteUser, getAllUsers, getUserById, login, updateUser } from '../controllers/userController.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';

const userRouter =Router();

userRouter.post('/users/add', addUser);
userRouter.post('/users/login',login);
userRouter.delete('/users/:id',deleteUser);
userRouter.get('/users',getAllUsers);
userRouter.get('/users/:id',getUserById);
userRouter.put('/user/:id',updateUser)


export default userRouter;