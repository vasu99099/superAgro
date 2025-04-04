import { NextFunction, Request, Response } from 'express';
import CategoryService, { Category } from '../services/CategoryService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import fileValidationSchema from '../validationSchema/user.validation';
import { validateInput } from '../validationSchema';
import ERROR_MESSAGES from '../constants/errorMessages';
import { AuthRequest } from '../middleware/adminAuth';
import AppError from '../utils/AppError';
import { CategorySchema } from '../validationSchema/category.validation';
import { CustomerSchema } from '../validationSchema/customer.validation';
import CustomerService, { CustomerType } from '../services/CustomerService';
import VillageService from '../services/VillageService';

const getVillage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const villageSevice = new VillageService();

    const data = await villageSevice.getVillages(req.query);
    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'All Data fetched Successfully', data);
  } catch (e) {
    next(e);
  }
};

const villageController = {
  getVillage
};

export default villageController;
