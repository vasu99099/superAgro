import { Router } from 'express';

import dashboardController from '../controller/dashboard.controller';

import { ROUTES } from '../constants/routes';

const dashboardRoutes: Router = Router();

dashboardRoutes.get(ROUTES.BASE, dashboardController.getDashboardData);

export default dashboardRoutes;
