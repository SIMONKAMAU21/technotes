import {Router} from 'express';
import { addUser, deleteUser, getAllUsers, getUserById, login } from '../controllers/userController.js';

const userRouter =Router();

userRouter.post('/users/add', addUser);
userRouter.post('/users/login',login);
userRouter.delete('/users/:id',deleteUser);
userRouter.get('/users',getAllUsers);
userRouter.get('/users/:id',getUserById)

export default userRouter;