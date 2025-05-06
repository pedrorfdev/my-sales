import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowProfileService from '../../../services/ShowProfileService';
import UpdateProfileService from '../../../services/UpdateProfileService';

export default class ProfileController {
  async show(request: Request, response: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService);
    const id = Number(request.user.id);
    const user = await showProfile.execute({ id });

    return response.json(user);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const user_id = Number(request.user.id);
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(user);
  }
}
