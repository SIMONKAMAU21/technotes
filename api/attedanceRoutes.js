import {Router} from 'express';
import { addAttedance, deleteAttendance, getAllAttendance } from '../controllers/attendanceController.js';

const attendanceRouter =Router();

attendanceRouter.post('/attedance/add', addAttedance);
// attendanceRouter.post('/users/login',login);
attendanceRouter.delete('/attedance/:id',deleteAttendance);
attendanceRouter.get('/attedances',getAllAttendance);
// attendanceRouter.get('/users/:id',getUserById)

export default attendanceRouter;