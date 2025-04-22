import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { productController } from '../controller/product.controller';

const productRoutes: Router = Router();

productRoutes.get(ROUTES.PRODUCT.GET_PRODUCT, productController.getAllProduct);
productRoutes.post(ROUTES.PRODUCT.ADD_PRODUCT, productController.create);
productRoutes.put(ROUTES.PRODUCT.UPDATE_PRODUCT, productController.updateProduct);
productRoutes.delete(ROUTES.PRODUCT.DELETE_PRODUCT, productController.deleteProduct);
productRoutes.post(ROUTES.PRODUCT.PRODUCT_IMAGES, productController.productPresigned);

export default productRoutes;
