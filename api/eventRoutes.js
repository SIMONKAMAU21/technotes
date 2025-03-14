import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addEvent, deleteEvent, getAllEvents, updateEvent } from '../controllers/eventController.js';
import { checkUser } from '../middleware/checkUser.js';

const eventRouter =Router();
eventRouter.post('/event/add',Auth,checkUser, addEvent);
// eventRouter.post('/class/login',deleteClass);
eventRouter.delete('/event/:id',Auth,checkAdmin,deleteEvent);
eventRouter.get('/events',Auth,getAllEvents);
eventRouter.put('/event/:id',Auth,checkUser,updateEvent);

// eventRouter.get('/class/:id',getUserById)

export default eventRouter;