import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addClass, deleteClass, getAllClasses, getClassByTeacher, updateClass } from '../controllers/classController.js';

const classRouter =Router();

classRouter.post('/class/add', addClass);
classRouter.get('/class/teacher/:id',getClassByTeacher);
classRouter.delete('/class/:id',deleteClass);
classRouter.get('/classes',getAllClasses);
classRouter.put('/class/:id',updateClass);

// classRouter.get('/class/:id',getUserById)

export default classRouter;