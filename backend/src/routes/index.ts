import { Request, Response, Router } from 'express';
import authRoutes from './authRoutes';
import { ROUTES } from '../constants/routes';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import ERROR_MESSAGES from '../constants/errorMessages';
import userRoutes from './userRoutes';
import adminAuthUser from '../middleware/adminAuth';

const indexRoutes: Router = Router();

indexRoutes.use(ROUTES.AUTH.BASE, authRoutes);
indexRoutes.use(adminAuthUser);
indexRoutes.use(ROUTES.USER.BASE, userRoutes);

indexRoutes.use('*', (req: Request, res: Response) => {
  throw new AppError(ERROR_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
});

export default indexRoutes;
