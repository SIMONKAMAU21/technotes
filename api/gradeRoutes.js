import {Router} from 'express';
import { addGrade, deleteGrade, getAllGrades, getGradeById, getGradeByStudentId } from '../controllers/gradeController.js';


const gradeRouter =Router();

gradeRouter.post('/grade/add',addGrade);
gradeRouter.delete('/grade/:id',deleteGrade);
gradeRouter.get('/grades',getAllGrades);
gradeRouter.get('/grade/:id',getGradeById)
gradeRouter.get('/grades/:studentId/:subjectId',getGradeByStudentId)


export default gradeRouter;