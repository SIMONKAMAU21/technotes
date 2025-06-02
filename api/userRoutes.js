import {Router} from 'express';
import { addUser, changePassword, deleteUser, getAllUsers, getUserById, login, updateUser, uploadProfilePhoto } from '../controllers/userController.js';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { upload } from '../middleware/multer.js';

const userRouter =Router();

userRouter.post('/users/add',Auth,checkAdmin, addUser);
userRouter.post('/users/login',login);
userRouter.delete('/users/:id',Auth,checkAdmin,deleteUser);
userRouter.get('/users',Auth,getAllUsers);
userRouter.post('/user',getUserById);
userRouter.put('/user/:id',Auth,checkAdmin,updateUser)
userRouter.post('/create/conversation');
userRouter.post('/user/password/:id',changePassword)
userRouter.post('/user/:id/upload-photo',upload.single("photo"),Auth,uploadProfilePhoto)



export default userRouter;