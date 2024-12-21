import {Router} from 'express';
import { addSubject, deleteSubject, getAllSubjects } from '../controllers/subjectController.js';

const subjectRouter =Router();

subjectRouter.post('/subject/add', addSubject);
// subjectRouter.post('/users/login',login);
subjectRouter.delete('/subject/:id',deleteSubject);
subjectRouter.get('/subjects',getAllSubjects);
// subjectRouter.get('/users/:id',getUserById)

export default subjectRouter;