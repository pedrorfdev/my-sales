import RedisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductPaginate } from '../domain/models/IProductPaginate';
import {
  IProductsRepository,
  SearchParams,
} from '../domain/repositories/IProductsRepository';

@injectable()
export default class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private producstRepository: IProductsRepository,
  ) {}

  async execute({ page, skip, take }: SearchParams): Promise<IProductPaginate> {
    const redisCache = new RedisCache();

    let products = await redisCache.recovery<IProductPaginate>(
      'api-mysales-PRODUCT_LIST',
    );

    if (!products) {
      products = await this.producstRepository.findAll({ page, skip, take });

      await redisCache.save(
        'api-mysales-PRODUCT_LIST',
        JSON.stringify(products),
      );
    }

    return products as IProductPaginate;
  }
}
