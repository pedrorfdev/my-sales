import uploadConfig from '@config/upload';
import AuthMiddleware from '@shared/middlewares/authMiddleware';
import { Router } from 'express';
import multer from 'multer';
import UpdateAvatarControllers from '../controllers/UpdateAvatarControllers';

const avatarRouter = Router();
const userAvatarController = new UpdateAvatarControllers();
const upload = multer(uploadConfig);

avatarRouter.patch(
  '/',
  AuthMiddleware.execute,
  upload.single('avatar'),
  userAvatarController.update,
);

export default avatarRouter;
