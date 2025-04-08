import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { productController } from '../controller/product.controller';

const productRoutes: Router = Router();

productRoutes.get(ROUTES.PRODUCT.GET_PRODUCT, productController.getAllCustomer);
productRoutes.get(ROUTES.PRODUCT.GET_PRODUCT_BY_ID, productController.getById);
productRoutes.post(ROUTES.PRODUCT.ADD_PRODUCT, productController.create);
productRoutes.put(ROUTES.PRODUCT.UPDATE_PRODUCT, productController.updateCustomer);
productRoutes.delete(ROUTES.PRODUCT.DELETE_PRODUCT, productController.deleteCustomer);

export default productRoutes;
