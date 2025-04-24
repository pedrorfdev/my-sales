import { AppDataSource } from '@shared/typeorm/data-source';
import { In } from 'typeorm';
import { Product } from '../entities/Product';

interface IFindProducts {
  id: string;
}

export const productRepositories = AppDataSource.getRepository(Product).extend({
  async findByName(name: string): Promise<Product | null> {
    return this.findOneBy({ name });
  },

  async findById(id: string): Promise<Product | null> {
    return this.findOneBy({ id });
  },

  async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const existentProducts = await this.find({
      where: { id: In(productsIds) },
    });

    return existentProducts;
  },
});
