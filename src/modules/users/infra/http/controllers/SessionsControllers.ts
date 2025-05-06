import CreateSessionService from '@modules/users/services/CreateSessionService';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsControllers {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const createSession = container.resolve(CreateSessionService);

    const userToken = await createSession.execute({
      email,
      password,
    });

    return response.json(instanceToInstance(userToken));
  }
}
