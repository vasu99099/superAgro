import { NextFunction, Request, Response } from 'express';
import FarmService, { FarmType } from '../services/FarmService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import { validateInput } from '../validationSchema';
import AppError from '../utils/AppError';
import { FarmSchema } from '../validationSchema/farm.validation';
import ERROR_MESSAGES from '../constants/errorMessages';

const getAllFarms = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const farmService = new FarmService();

    const searchQuery = req.query.search ? { farm_name: String(req.query.search) } : undefined;

    if (req.query.farm_id) {
      const id = parseInt(req.query.farm_id as string, 10);

      if (isNaN(id)) {
        return sendResponse(
          res,
          false,
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.INVALID('Farm Id'),
          null
        );
      }

      const farm = await farmService.getFarmById(id);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.FETCHED_SUCCESS('Farm'),
        farm
      );
    }

    const { totalRecords, data } = await farmService.getAllFarms({
      ...req.query,
      search: searchQuery
    });

    return sendResponse(res, true, STATUS_CODES.SUCCESS, ERROR_MESSAGES.FETCHED_SUCCESS('Farm'), {
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

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.CREATED_SUCCESS('Farm'),
      newFarm
    );
  } catch (e) {
    next(e);
  }
};

const deleteFarm = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.body.farm_id) {
      return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.ID_REQUIRED('Farm'));
    }

    const farmService = new FarmService();
    const deletedFarm = await farmService.deleteFarm(req.body.farm_id);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.DELETE_SUCCESS('Farm'),
      deletedFarm
    );
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

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.UPDATE_SUCCESS('Farm'),
      updatedFarm
    );
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
