import AuthMiddleware from '@shared/middlewares/AuthMiddleware';
import { Router } from 'express';
import CustomerControllers from '../controllers/CustomersControllers';
import {
  createCustomerSchema,
  idParamsValidate,
  updateCustomerSchema,
} from '../schemas/CustomerSchema';

const customerRouter = Router();
const customerController = new CustomerControllers();

customerRouter.use(AuthMiddleware.execute);

customerRouter.get('/', customerController.index);
customerRouter.get('/:id', idParamsValidate, customerController.show);
customerRouter.post('/', createCustomerSchema, customerController.create);
customerRouter.patch('/:id', updateCustomerSchema, customerController.update);
customerRouter.delete('/:id', customerController.delete);

export default customerRouter;
