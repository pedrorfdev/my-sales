import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { Product } from '../infra/database/entities/Product';

@injectable()
export default class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private producstRepository: IProductsRepository,
  ) {}

  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const redisCache = new RedisCache();
    const product = await this.producstRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    const productExists = await this.producstRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError('There is already one productwith this name', 409);
    }

    await redisCache.invalidate('api-mysales_PRODUCT_LIST');

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.producstRepository.save(product);

    return product as Product;
  }
}
