import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import customerController from '../controller/customer.controller';
import villageController from '../controller/village.controller';
const villageRoutes: Router = Router();

villageRoutes.get(ROUTES.VILLAGE.GET_VILLAGE, villageController.getVillage);
villageRoutes.post(ROUTES.CUSTOMER.ADD_CUSTOMER, customerController.AddCustomer);
villageRoutes.put(ROUTES.CUSTOMER.UPDATECUSTOMER, customerController.updateCustomer);
villageRoutes.delete(ROUTES.CUSTOMER.DELETECUSTOMER, customerController.deleteCustomer);

export default villageRoutes;
