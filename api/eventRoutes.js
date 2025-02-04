import {Router} from 'express';
import { checkAdmin } from '../middleware/checkAdmin.js';
import { Auth } from '../middleware/Auth.js';
import { addEvent, deleteEvent, getAllEvents } from '../controllers/eventController.js';

const eventRouter =Router();

eventRouter.post('/event/add',Auth, addEvent);
// eventRouter.post('/class/login',deleteClass);
eventRouter.delete('/event/:id',deleteEvent);
eventRouter.get('/events',getAllEvents);
// eventRouter.put('/class/:id',updateClass);

// eventRouter.get('/class/:id',getUserById)

export default eventRouter;