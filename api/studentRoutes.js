import {Router} from 'express';
import { addStudent, deleteStudent, getAllStudents, getStudentByClassId, updateStudent } from '../controllers/studentController.js';
import { Auth } from '../middleware/Auth.js';
import { checkAdmin } from '../middleware/checkAdmin.js';

const studentRouter =Router();

studentRouter.post('/student/add', Auth,checkAdmin, addStudent);
// studentRouter.post('/class/login',deleteClass);
studentRouter.delete('/student/:id',Auth,checkAdmin,deleteStudent);
studentRouter.get('/students',Auth,checkAdmin,getAllStudents);
studentRouter.put('/student/:id',Auth,checkAdmin,updateStudent);
studentRouter.get('/students/class/:id',Auth,checkAdmin,getStudentByClassId);

// studentRouter.get('/class/:id',getUserById)

export default studentRouter;