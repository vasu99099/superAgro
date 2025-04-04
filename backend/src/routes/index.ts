import { Request, Response, Router } from 'express';
import authRoutes from './authRoutes';
import { ROUTES } from '../constants/routes';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import ERROR_MESSAGES from '../constants/errorMessages';
import userRoutes from './userRoutes';
import adminAuthUser from '../middleware/adminAuth';
import categoryRoutes from './categoryRoutes';
import customerRoutes from './customerRoutes';
import villageRoutes from './villageRoutes';
import farmRoutes from './farmRoutes';
import dashboardRoutes from './dashboardRoutes';
import productRoutes from './productRoutes';

const indexRoutes: Router = Router();

indexRoutes.use(ROUTES.AUTH.BASE, authRoutes);
indexRoutes.use(adminAuthUser);
indexRoutes.use(ROUTES.USER.BASE, userRoutes);
indexRoutes.use(ROUTES.DASHBOARD.BASE, dashboardRoutes);
indexRoutes.use(ROUTES.CATEGORY.BASE, categoryRoutes);
indexRoutes.use(ROUTES.CUSTOMER.BASE, customerRoutes);
indexRoutes.use(ROUTES.FARM.BASE, farmRoutes);
indexRoutes.use(ROUTES.VILLAGE.BASE, villageRoutes);
indexRoutes.use(ROUTES.PRODUCT.BASE, productRoutes);

indexRoutes.use('*', (req: Request, res: Response) => {
  throw new AppError(ERROR_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
});

export default indexRoutes;
