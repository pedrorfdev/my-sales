import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowCustomer } from '../domain/models/IShowCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomerRepositories';
import { Customer } from '../infra/database/entities/Customer';

@injectable()
export default class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customerRepositories.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    return customer;
  }
}
