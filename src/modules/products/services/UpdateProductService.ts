import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { Product } from '../database/entities/Product';
import { productRepositories } from '../database/repositories/ProductRepositories';

interface IUpdateProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const product = await productRepositories.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    const productExists = await productRepositories.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError('There is already one productwith this name', 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productRepositories.save(product);

    await redisCache.invalidate('api-mysales_PRODUCT_LIST');

    return product;
  }
}
