import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '../../../services/CreateUserService';
import ListUserService from '../../../services/ListUserService';

export default class UserControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const { page, skip, take } = request.query;

    const listUsers = container.resolve(ListUserService);

    const users = await listUsers.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take),
    });

    return response.json(instanceToInstance(users));
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
