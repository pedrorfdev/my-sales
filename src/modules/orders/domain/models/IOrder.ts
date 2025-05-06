import { ICustomer } from '@modules/customers/domain/models/ICostumer';
import { ICreateOrderProducts } from './ICreateOrderProducts';

export interface IOrder {
  id: number;
  order?: number;
  customer: ICustomer;
  order_products: ICreateOrderProducts[];
  created_at: Date;
  updated_at: Date;
}
