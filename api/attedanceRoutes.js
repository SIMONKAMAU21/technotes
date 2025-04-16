import {Router} from 'express';
import { addAttedance, deleteAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import { Auth } from '../middleware/Auth.js';

const attendanceRouter =Router();

attendanceRouter.post('/attedance/add',Auth, addAttedance);
// attendanceRouter.post('/users/login',login);
attendanceRouter.delete('/attedance/:id',Auth,deleteAttendance);
attendanceRouter.get('/attedances',Auth,getAllAttendance);
// attendanceRouter.get('/users/:id',getUserById)

export default attendanceRouter;