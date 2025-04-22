import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { dosageController } from '../controller/dosage.controller';

const dosageRoutes: Router = Router();
dosageRoutes.get(ROUTES.DOSAGE.GET_FARM_DOSAGE, dosageController.getDosage);
dosageRoutes.get(ROUTES.DOSAGE.GET_DOSAGE_BY_ID, dosageController.getDosageBYId);
dosageRoutes.post(ROUTES.DOSAGE.ADD_DOSAGE, dosageController.create);
dosageRoutes.put(ROUTES.DOSAGE.MARK_DASOAGE_AS_PURCHASED, dosageController.markDosageAsPurchased);
dosageRoutes.put(ROUTES.DOSAGE.UPDATE_DOSAGE, dosageController.updateDosage);
dosageRoutes.delete(ROUTES.DOSAGE.DELETE_DOSAGE, dosageController.deleteDosage);

export default dosageRoutes;
