import { Router } from 'express';
import { ROUTES } from '../constants/routes'

import { getUser, login, register } from '../controller/user.controller';

const authRoutes: Router = Router();

authRoutes.get(ROUTES.AUTH.GETUSER, getUser);
authRoutes.post(ROUTES.AUTH.LOGIN, login);
authRoutes.post(ROUTES.AUTH.REGISTER, register);


export default authRoutes;
