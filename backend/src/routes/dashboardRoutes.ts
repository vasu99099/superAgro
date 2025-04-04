import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import customerController from '../controller/customer.controller';
import villageController from '../controller/village.controller';
import dashboardController from '../controller/dashboard.controller';
const dashboardRoutes: Router = Router();

dashboardRoutes.get(ROUTES.BASE, dashboardController.getDashboardData);

export default dashboardRoutes;
