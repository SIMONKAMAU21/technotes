import {Router} from 'express';
import { addSubject, deleteSubject, getAllSubjects, getSubjectByTeacher, updateSubject } from '../controllers/subjectController.js';

const subjectRouter =Router();

subjectRouter.post('/subject/add', addSubject);
// subjectRouter.post('/users/login',login);
subjectRouter.delete('/subject/:id',deleteSubject);
subjectRouter.get('/subjects',getAllSubjects);
subjectRouter.put('/subject/:id',updateSubject);
subjectRouter.get('/subjects/:id',getSubjectByTeacher);


// subjectRouter.get('/users/:id',getUserById)

export default subjectRouter;