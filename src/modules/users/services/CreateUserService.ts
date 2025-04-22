import AppError from '@shared/errors/AppError';
import { hash } from 'bcrypt';
import { usersRepositories } from '../database/repositories/UserRepositories';

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExists = await usersRepositories.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.', 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = usersRepositories.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepositories.save(user);

    return user;
  }
}
