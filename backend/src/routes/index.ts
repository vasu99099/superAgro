import { Router } from 'express';
import authRoutes from './authRoutes';
import { BATH_PATH } from '../constants/routes';

const indexRoutes: Router = Router();

indexRoutes.use(BATH_PATH.AUTH, authRoutes);

export default indexRoutes;
