import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import farmController from '../controller/farm.controller';
const farmRoutes: Router = Router();

farmRoutes.get(ROUTES.FARM.GETALL_FARM, farmController.getAllFarms);
farmRoutes.post(ROUTES.FARM.ADD_FARM, farmController.addFarm);
farmRoutes.put(ROUTES.FARM.UPDATE_FARM, farmController.updateFarm);
farmRoutes.delete(ROUTES.FARM.DELETE_FARM, farmController.deleteFarm);

export default farmRoutes;
