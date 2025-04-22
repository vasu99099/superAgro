import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import customerController from '../controller/customer.controller';
const customerRoutes: Router = Router();

customerRoutes.get(ROUTES.CUSTOMER.GETALLCUSTOMER, customerController.getAllCustomer);
customerRoutes.post(ROUTES.CUSTOMER.ADD_CUSTOMER, customerController.AddCustomer);
customerRoutes.put(ROUTES.CUSTOMER.UPDATECUSTOMER, customerController.updateCustomer);
customerRoutes.delete(ROUTES.CUSTOMER.DELETECUSTOMER, customerController.deleteCustomer);

export default customerRoutes;
