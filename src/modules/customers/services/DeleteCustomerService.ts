import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowCustomer } from '../domain/models/IShowCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomerRepositories';

@injectable()
export default class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private readonly customerRepositories: ICustomersRepository,
  ) {}

  async execute({ id }: IShowCustomer): Promise<void> {
    const customer = await this.customerRepositories.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    await this.customerRepositories.remove(customer);
  }
}
