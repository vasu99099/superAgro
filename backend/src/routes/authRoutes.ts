import { Router } from 'express';
import { login } from '../controller/user.controller';
import { ROUTES } from '../constants/routes';

const authRoutes: Router = Router();

authRoutes.post(ROUTES.AUTH.LOGIN, login);

export default authRoutes;
