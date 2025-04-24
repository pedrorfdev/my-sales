import { customerRepositories } from '@modules/customers/database/repositories/CustomerRepositories';
import { Product } from '@modules/products/database/entities/Product';
import { productRepositories } from '@modules/products/database/repositories/ProductRepositories';
import AppError from '@shared/errors/AppError';
import { Order } from '../database/entities/Order';
import { orderRepositories } from '../database/repositories/OrderRepositories';

interface ICreateOrder {
  customer_id: string;
  products: Product[];
}

export class CreateOrderService {
  async execute({ customer_id, products }: ICreateOrder): Promise<Order> {
    const customerExists = await customerRepositories.findById(
      Number(customer_id),
    );

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id', 404);
    }

    const existsProducts = await productRepositories.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids', 404);
    }

    const existsProductsIds = products.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}.`,
        404,
      );
    }

    const quantityAvailable = products.filter(product => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      existsProducts.filter(
        productExisten => productExisten.id === product.id,
      )[0].quantity < product.quantity;
    });

    if (!quantityAvailable.length) {
      throw new AppError(`The quantity is not available for`, 409);
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await orderRepositories.createOrder({
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

    await productRepositories.save(updateProductQuantity);

    return order;
  }
}
