import { Router } from 'express';
import categoryController from '../controller/category.controller';
import { ROUTES } from '../constants/routes';

const categoryRoutes: Router = Router();

categoryRoutes.get(ROUTES.CATEGORY.GETALLCATEGORY, categoryController.getAllCategory);
categoryRoutes.post(ROUTES.CATEGORY.ADDCATEGORY, categoryController.AddCategory);
categoryRoutes.delete(ROUTES.CATEGORY.DELETECATEGORY, categoryController.deleteCategory);
categoryRoutes.put(ROUTES.CATEGORY.UPDATECATEGORY, categoryController.updateCategory);

export default categoryRoutes;
