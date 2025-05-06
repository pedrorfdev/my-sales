import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomerRepositories';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateOrder } from '../domain/models/ICreateOrder';
import { IOrder } from '../domain/models/IOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';

@injectable()
export class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  async execute({ customer, products }: ICreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(
      Number(customer.id),
    );

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id', 404);
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids', 404);
    }

    const existsProductsIds = products.map(product => product.product_id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.product_id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].product_id}.`,
        404,
      );
    }

    const quantityAvailable = products.filter(product => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      existsProducts.filter(
        productExisten => productExisten.id === product.product_id,
      )[0].quantity < product.quantity;
    });

    if (!quantityAvailable.length) {
      throw new AppError(`The quantity is not available for`, 409);
    }

    const serializedProducts = products.map(product => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.product_id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updateProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updateProductQuantity);

    return order;
  }
}
