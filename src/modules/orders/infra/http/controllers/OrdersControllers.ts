import ListOrderService from '@modules/orders/services/ListOrderService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateOrderService } from '../../../services/CreateOrderService';
import { ShowOrderService } from '../../../services/ShowOrderService';
export default class OrdersControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 15;
    const listOrders = container.resolve(ListOrderService);

    const orders = await listOrders.execute({ page, limit });

    return response.json(orders);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute(id);

    return response.json(order);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { customer, products } = request.body;
    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer,
      products,
    });

    return response.json(order);
  }
}
