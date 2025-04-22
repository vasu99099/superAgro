import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import userController from '../controller/user.controller';

const authRoutes: Router = Router();

authRoutes.post(ROUTES.AUTH.LOGIN, userController.login);
authRoutes.post(ROUTES.AUTH.REGISTER, userController.register);

export default authRoutes;
