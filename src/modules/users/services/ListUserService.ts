import { inject, injectable } from 'tsyringe';
import { IPaginateUser } from '../domain/models/IPaginateUser';
import { IUsersRepository } from '../domain/repositories/IUserRepositories';
import { SearchParams } from '../infra/database/repositories/UserRepositories';

@injectable()
export default class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRpository: IUsersRepository,
  ) {}

  async execute({ page, skip, take }: SearchParams): Promise<IPaginateUser> {
    const users = await this.usersRpository.findAll({ page, skip, take });
    return users;
  }
}
