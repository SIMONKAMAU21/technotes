import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addClass, deleteClass, getAllClasses, getClassByTeacher, updateClass } from '../controllers/classController.js';

const classRouter =Router();

classRouter.post('/class/add',Auth,checkAdmin, addClass);
classRouter.get('/class/teacher/:id',Auth,checkAdmin,getClassByTeacher);
classRouter.delete('/class/:id',Auth,checkAdmin,deleteClass);
classRouter.get('/classes',Auth,checkAdmin,getAllClasses);
classRouter.put('/class/:id',Auth,checkAdmin,updateClass);

// classRouter.get('/class/:id',getUserById)

export default classRouter;