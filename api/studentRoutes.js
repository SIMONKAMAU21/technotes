import {Router} from 'express';
import { addStudent, deleteStudent, getAllStudents, getStudentByClassId, updateStudent } from '../controllers/studentController.js';

const studentRouter =Router();

studentRouter.post('/student/add', addStudent);
// studentRouter.post('/class/login',deleteClass);
studentRouter.delete('/student/:id',deleteStudent);
studentRouter.get('/students',getAllStudents);
studentRouter.put('/student/:id',updateStudent);
studentRouter.get('/students/class/:id',getStudentByClassId);

// studentRouter.get('/class/:id',getUserById)

export default studentRouter;