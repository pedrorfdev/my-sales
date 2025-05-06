import { ICustomer } from '@modules/customers/domain/models/ICostumer';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import {
  ICustomersRepository,
  Pagination,
} from '@modules/customers/domain/repositories/ICustomerRepositories';
import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { Repository } from 'typeorm';
import { Customer } from '../entities/Customer';

export default class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Customer);
  }

  async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = this.ormRepository.create({
      name,
      email,
    });

    await this.ormRepository.save(customer);

    return customer;
  }

  async save(customer: ICustomer): Promise<ICustomer> {
    await this.ormRepository.save(customer);
    return customer;
  }

  async remove(customer: ICustomer): Promise<void> {
    await this.ormRepository.remove(customer);

    return;
  }

  async findById(id: number): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ id });

    return customer;
  }

  async findAndCount({
    take,
    skip,
  }: Pagination): Promise<[ICustomer[], number]> {
    const [customers, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    });

    return [customers, total];
  }

  async findByName(name: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ name });

    return customer;
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = await this.ormRepository.findOneBy({ email });

    return customer;
  }
}
