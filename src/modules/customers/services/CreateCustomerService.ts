import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomerRepositories';
import { Customer } from '../infra/database/entities/Customer';

@injectable()
export default class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const emailExists = await this.customerRepositories.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.', 409);
    }

    const customer = await this.customerRepositories.create({
      name,
      email,
    });

    return customer;
  }
}
