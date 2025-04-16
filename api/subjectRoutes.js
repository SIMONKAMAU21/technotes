import {Router} from 'express';
import { addSubject, deleteSubject, getAllSubjects, getSubjectByTeacher, updateSubject } from '../controllers/subjectController.js';
import { Auth } from '../middleware/Auth.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const subjectRouter =Router();

subjectRouter.post('/subject/add',Auth,checkAdmin, addSubject);
// subjectRouter.post('/users/login',login);
subjectRouter.delete('/subject/:id',Auth,checkAdmin, deleteSubject);
subjectRouter.get('/subjects',Auth,checkAdmin,getAllSubjects);
subjectRouter.put('/subject/:id',Auth,checkAdmin,updateSubject);
subjectRouter.get('/subjects/:id',getSubjectByTeacher);


// subjectRouter.get('/users/:id',getUserById)

export default subjectRouter;