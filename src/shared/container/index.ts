import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomerRepositories';
import CustomersRepository from '@modules/customers/infra/database/repositories/CustomerRepositories';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/database/repositories/OrderRepositories';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/database/repositories/ProductRepositories';
import { IUsersRepository } from '@modules/users/domain/repositories/IUserRepositories';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import UsersRepository from '@modules/users/infra/database/repositories/UserRepositories';
import UserTokensRepository from '@modules/users/infra/database/repositories/UserTokensRepositoires';
import { container } from 'tsyringe';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
