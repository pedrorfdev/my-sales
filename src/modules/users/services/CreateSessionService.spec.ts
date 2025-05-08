/* eslint-disable @typescript-eslint/no-require-imports */
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../domain/repositories/fakes/FakeUserRepository';
import { User } from '../infra/database/entities/User';
import CreateSessionService from './CreateSessionService';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-token'),
}));

const mockUserData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'John@gmail.com',
    password: '123456',
    created_at: new Date(),
    updated_at: new Date(),
    getAvatarUrl() {
      return 'avatar.jpg';
    },
  } as User,
];

let fakeUserRepository: FakeUserRepository;
let createSessionService: CreateSessionService;

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    createSessionService = new CreateSessionService(fakeUserRepository);
  });

  it('should be able to authenticate with valid credentials', async () => {
    const user = { ...mockUserData[0] };
    const { email, password } = user;

    await fakeUserRepository.create(user);

    (require('bcrypt').hash as jest.Mock).mockResolvedValue('hashed-password');
    (require('bcrypt').compare as jest.Mock).mockResolvedValue(true);

    const response = await createSessionService.execute({ email, password });

    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe(email);
  });

  it('should not be able to authenticate with non-existing credentials', async () => {
    await expect(
      createSessionService.execute({
        email: 'nonexisting@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = { ...mockUserData[0] };
    const { email } = user;

    await fakeUserRepository.create(user);

    (require('bcrypt').hash as jest.Mock).mockResolvedValue('hashed-password');
    (require('bcrypt').compare as jest.Mock).mockResolvedValue(false);

    await expect(
      createSessionService.execute({
        email,
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
