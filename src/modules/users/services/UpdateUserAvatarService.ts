import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import path from 'path';
import { User } from '../database/entities/User';
import { usersRepositories } from '../database/repositories/UserRepositories';

interface IUpdateUserAvatar {
  userId: number;
  avatarFileName: string;
}

export default class UpdateUserAvatarService {
  async execute({ userId, avatarFileName }: IUpdateUserAvatar): Promise<User> {
    const user = await usersRepositories.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    await usersRepositories.save(user);

    return user;
  }
}
