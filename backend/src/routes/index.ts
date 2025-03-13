import { Router } from 'express';
import authRoutes from './authRoutes';
import { ROUTES } from '../constants/routes';

const indexRoutes: Router = Router();

indexRoutes.use(ROUTES.AUTH.BASE, authRoutes);

export default indexRoutes;
