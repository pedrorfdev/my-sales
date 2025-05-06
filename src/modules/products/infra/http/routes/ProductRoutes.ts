import { Router } from 'express';
import ProductsControllers from '../controllers/ProductsControllers';
import {
  createProductSchema,
  idParamsValidation,
  updateProductSchema,
} from '../schemas/ProductSchemas';

const productsRouter = Router();
const productsControllers = new ProductsControllers();

productsRouter.get('/', productsControllers.index);
productsRouter.get('/:id', idParamsValidation, productsControllers.show);
productsRouter.post('/', createProductSchema, productsControllers.create);
productsRouter.put('/:id', updateProductSchema, productsControllers.update);
productsRouter.delete('/:id', idParamsValidation, productsControllers.delete);

export default productsRouter;
