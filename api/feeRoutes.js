import {Router} from 'express';
import { addFee, deleteFee, getAllfees, getfeeById, getfeeByStudentId } from '../controllers/feeController.js';


const feeRouter =Router();

feeRouter.post('/fee/add',addFee);
feeRouter.delete('/fee/:id',deleteFee);
feeRouter.get('/fees',getAllfees);
feeRouter.get('/fee/:id',getfeeById)
feeRouter.get('/fees/:studentId',getfeeByStudentId)


export default feeRouter;