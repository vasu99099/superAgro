import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import multer from 'multer';
import categoryController from '../controller/category.controller';
const categoryRoutes: Router = Router();

categoryRoutes.get(ROUTES.CATEGORY.GETALLCATEGORY, categoryController.getAllCategory);
categoryRoutes.post(ROUTES.CATEGORY.ADDCATEGORY, categoryController.AddCategory);
categoryRoutes.delete(ROUTES.CATEGORY.DELETECATEGORY, categoryController.deleteCategory)
categoryRoutes.put(ROUTES.CATEGORY.UPDATECATEGORY, categoryController.updateCategory)

export default categoryRoutes;
