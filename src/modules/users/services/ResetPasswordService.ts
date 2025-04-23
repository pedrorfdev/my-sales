import AppError from '@shared/errors/AppError';
import { hash } from 'bcrypt';
import { addHours, isAfter } from 'date-fns';
import { usersRepositories } from '../database/repositories/UserRepositories';
import { UserTokensRepositories } from '../database/repositories/UserTokensRepositoires';

interface IResetPassword {
  token: string;
  password: string;
}

export default class ResetPasswordService {
  async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await UserTokensRepositories.findByToken(token);

    if (!userToken) {
      throw new AppError('User token not exists.', 404);
    }

    const user = await usersRepositories.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User not exists.', 404);
    }

    const tokenCreatedAt = userToken.create_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.', 401);
    }

    user.password = await hash(password, 10);

    await usersRepositories.save(user);
  }
}
