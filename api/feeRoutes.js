import {Router} from 'express';
import { addFee, deleteFee, getAllfees, getfeeById, getfeeByStudentId } from '../controllers/feeController.js';
import { Auth } from '../middleware/Auth.js';


const feeRouter =Router();

feeRouter.post('/fee/add',Auth, addFee);
feeRouter.delete('/fee/:id',Auth ,deleteFee);
feeRouter.get('/fees',Auth ,getAllfees);
feeRouter.get('/fee/:id',Auth ,getfeeById)
feeRouter.get('/fees/:studentId',Auth ,getfeeByStudentId)


export default feeRouter;