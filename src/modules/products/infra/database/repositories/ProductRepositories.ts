import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { AppDataSource } from '@shared/infra/typeorm/data-source';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/Product';

type SearchParams = {
  page: number;
  skip: number;
  take: number;
};

export default class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product);
  }

  async create({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });

    await this.ormRepository.save(product);

    return product;
  }

  async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);

    return product;
  }

  async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  async findByName(name: string): Promise<Product | null> {
    return this.ormRepository.findOneBy({ name });
  }

  async findById(id: string): Promise<Product | null> {
    return this.ormRepository.findOneBy({ id });
  }

  async findAll({ page, skip, take }: SearchParams): Promise<IProductPaginate> {
    const [products, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: products,
    };

    return result;
  }

  async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const existentProducts = await this.ormRepository.find({
      where: { id: In(productsIds) },
    });

    return existentProducts;
  }
}
