import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addEvent, deleteEvent, getAllEvents, updateEvent } from '../controllers/eventController.js';

const eventRouter =Router();

eventRouter.post('/event/add',Auth, addEvent);
// eventRouter.post('/class/login',deleteClass);
eventRouter.delete('/event/:id',deleteEvent);
eventRouter.get('/events',Auth,getAllEvents);
eventRouter.put('/event/:id',Auth,updateEvent);

// eventRouter.get('/class/:id',getUserById)

export default eventRouter;