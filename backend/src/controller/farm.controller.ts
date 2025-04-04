import { NextFunction, Request, Response } from 'express';
import FarmService, { FarmType } from '../services/FarmService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import { validateInput } from '../validationSchema';
import AppError from '../utils/AppError';
import { FarmSchema } from '../validationSchema/farm.validation';

const getAllFarms = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const farmService = new FarmService();

    // Construct search query
    const searchQuery = req.query.search ? { farm_name: String(req.query.search) } : undefined;

    if (req.query.farm_id) {
      const id = parseInt(req.query.farm_id as string, 10);

      if (isNaN(id)) {
        return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid farm ID', null);
      }

      const farm = await farmService.getFarmById(id);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Farm fetched successfully', farm);
    }

    const { totalRecords, data } = await farmService.getAllFarms({
      ...req.query,
      search: searchQuery
    });

    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'All farms fetched successfully', {
      totalRecords,
      farms: data
    });
  } catch (error) {
    next(error);
  }
};

const addFarm = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(FarmSchema, req.body, res);
    if (!isValid) {
      return;
    }

    const farmService = new FarmService();
    const newFarm = await farmService.addFarm(req.body as FarmType);

    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Farm added successfully', newFarm);
  } catch (e) {
    next(e);
  }
};

const deleteFarm = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.body.farm_id) {
      return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Request');
    }

    const farmService = new FarmService();
    const deletedFarm = await farmService.deleteFarm(req.body.farm_id);

    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Farm deleted successfully', deletedFarm);
  } catch (e) {
    next(e);
  }
};

const updateFarm = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(FarmSchema, req.body, res, { isEdit: true });

    if (!isValid) {
      return;
    }

    const farmService = new FarmService();
    const updatedFarm = await farmService.updateFarm(req.body.farm_id, req.body);

    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Farm updated successfully', updatedFarm);
  } catch (e) {
    next(e);
  }
};

const farmController = {
  getAllFarms,
  addFarm,
  deleteFarm,
  updateFarm
};

export default farmController;
