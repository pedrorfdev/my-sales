import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private producstRepository: IProductsRepository,
  ) {}

  async execute({ name, price, quantity }: ICreateProduct): Promise<IProduct> {
    const redisCache = new RedisCache();
    const productExists = await this.producstRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name', 409);
    }

    const product = await this.producstRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-mysales-PRODUCT_LIST');

    return product;
  }
}
