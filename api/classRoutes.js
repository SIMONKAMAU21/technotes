import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addClass, deleteClass, getAllClasses } from '../controllers/classController.js';

const classRouter =Router();

classRouter.post('/class/add', addClass);
// classRouter.post('/class/login',deleteClass);
classRouter.delete('/class/:id',deleteClass);
classRouter.get('/classes',getAllClasses);
// classRouter.get('/class/:id',getUserById)

export default classRouter;