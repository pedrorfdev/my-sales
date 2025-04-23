import AppError from '@shared/errors/AppError';
import { usersRepositories } from '../database/repositories/UserRepositories';
import { UserTokensRepositories } from '../database/repositories/UserTokensRepositoires';

interface IForgotPassword {
  email: string;
}

export default class SendForgotPasswordEmailService {
  async execute({ email }: IForgotPassword): Promise<void> {
    const user = await usersRepositories.findByEmail(email);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const token = await UserTokensRepositories.generate(user.id);

    console.log(token);
  }
}
