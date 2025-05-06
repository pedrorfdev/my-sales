import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IDeleteProduct } from '../domain/models/IDeleteProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private producstRepository: IProductsRepository,
  ) {}

  async execute({ id }: IDeleteProduct): Promise<void> {
    const redisCache = new RedisCache();
    const product = await this.producstRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    await redisCache.invalidate('api-mysales_PRODUCT_LIST');

    await this.producstRepository.remove(product);
  }
}
