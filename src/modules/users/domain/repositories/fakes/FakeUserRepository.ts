import { User } from '@modules/users/infra/database/entities/User';
import { ICreateUser } from '../../models/ICreateUser';
import { IPaginateUser } from '../../models/IPaginateUser';
import { IUser } from '../../models/IUser';
import { IUsersRepository } from '../IUserRepositories';

export default class FakeUserRepository implements IUsersRepository {
  private users: User[] = [];

  async findAll({
    page,
    skip,
    take,
  }: {
    page: number;
    skip: number;
    take: number;
  }): Promise<IPaginateUser> {
    throw new Error('Method not implemented.');
  }
  async findByName(name: string): Promise<IUser | null> {
    return this.users.find(user => user.name === name) as IUser;
  }
  async findById(id: number): Promise<IUser | null> {
    return this.users.find(user => user.id === id) as IUser;
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find(user => user.email === email) as IUser;
  }
  async create(data: ICreateUser): Promise<IUser> {
    const user = new User();

    user.id = this.users.length + 1;
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;

    this.users.push(user);

    return user as IUser;
  }

  async save(user: IUser): Promise<void> {
    const findIndex = this.users.findIndex(
      findUser => findUser.email === user.email,
    );

    if (findIndex !== 1) {
      this.users[findIndex] = user;
    } else {
      this.users.push(user);
    }
  }
}
