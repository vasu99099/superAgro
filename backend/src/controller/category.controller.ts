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

const getAllCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const categotySevice = new CategoryService();
    if (req.query.search) {
      req.query.search = { name: req.query.search };
    }
    const { totalRecords, data } = await categotySevice.getAllCategory(req.query);
    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'All Data fetched Successfully', {
      totalRecords,
      categories: data
    });
  } catch (e) {
    next(e);
  }
};

const AddCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(CategorySchema, req.body, res);
    if (!isValid) {
      return;
    }
    const categotySevice = new CategoryService();
    const newCategory = await categotySevice.addCategory(req.body as Category);
    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Category Added Successfully',
      newCategory
    );
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.body.category_id) {
      sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Request');
    }

    const categotySevice = new CategoryService();
    const deletedCategory = await categotySevice.deleteCategory(req.body.category_id);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Category deleted Successfully',
      deletedCategory
    );
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(CategorySchema, req.body, res, { isEdit: true });

    if (!isValid) {
      return;
    }
    const categotySevice = new CategoryService();
    const updatedCategory = await categotySevice.updateCategory(req.body.category_id, req.body);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Category Updated Successfully',
      updatedCategory
    );
  } catch (e) {
    next(e);
  }
};
const categoryController = {
  getAllCategory,
  AddCategory,
  deleteCategory,
  updateCategory,
};

export default categoryController;
