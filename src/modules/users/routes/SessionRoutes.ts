import { Router } from 'express';
import SessionsControllers from '../controllers/SessionsControllers';
import { sessionSchema } from '../schemas/SessionSchema';

const sessionsRouter = Router();
const sessionsControllers = new SessionsControllers();

sessionsRouter.post('/', sessionSchema, sessionsControllers.create);

export default sessionsRouter;
