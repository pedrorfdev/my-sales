import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowProduct } from '../domain/models/IShowProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { Product } from '../infra/database/entities/Product';

@injectable()
export default class ShowProductService {
  constructor(
    @inject('ProducstRepository')
    private producstRepository: IProductsRepository,
  ) {}

  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await this.producstRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    return product as Product;
  }
}
