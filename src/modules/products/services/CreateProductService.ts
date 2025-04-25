import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { Product } from '../database/entities/Product';
import { productRepositories } from '../database/repositories/ProductRepositories';

interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const productExists = await productRepositories.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name', 409);
    }

    const product = productRepositories.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-mysales_PRODUCT_LIST');
    await productRepositories.save(product);

    return product;
  }
}
