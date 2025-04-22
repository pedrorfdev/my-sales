import { Router } from 'express';
import UserControllers from '../controllers/UsersControllers';
import { createUserSchema } from '../schemas/UserSchema';

const usersRouter = Router();
const usersControllers = new UserControllers();

usersRouter.get('/', usersControllers.index);
usersRouter.post('/', createUserSchema, usersControllers.create);

export default usersRouter;
