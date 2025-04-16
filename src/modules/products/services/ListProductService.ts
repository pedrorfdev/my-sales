import { Product } from '../database/entities/Product';
import { productRepositories } from '../database/repositories/ProductRepositories';

export default class ListProductService {
  async execute(): Promise<Product[]> {
    const products = await productRepositories.find();
    return products;
  }
}
