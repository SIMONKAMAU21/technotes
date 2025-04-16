import {Router} from 'express';
import { addGrade, deleteGrade, getAllGrades, getGradeById, getGradeByStudentId } from '../controllers/gradeController.js';
import { Auth } from '../middleware/Auth.js';


const gradeRouter =Router();

gradeRouter.post('/grade/add',Auth, addGrade);
gradeRouter.delete('/grade/:id',Auth,deleteGrade);
gradeRouter.get('/grades',Auth,getAllGrades);
gradeRouter.get('/grade/:id',Auth,getGradeById)
gradeRouter.get('/grades/:studentId/:subjectId',Auth,getGradeByStudentId)


export default gradeRouter;