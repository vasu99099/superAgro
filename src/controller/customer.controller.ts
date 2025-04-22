import { NextFunction, Request, Response } from 'express';
import CategoryService, { Category } from '../services/CategoryService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import fileValidationSchema from '../validationSchema/user.validation';
import { validateInput } from '../validationSchema';
import ERROR_MESSAGES from '../constants/errorMessages';
import AppError from '../utils/AppError';
import { CategorySchema } from '../validationSchema/category.validation';
import { CustomerSchema } from '../validationSchema/customer.validation';
import CustomerService, { CustomerType } from '../services/CustomerService';

const getAllCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const customerService = new CustomerService(req.user.id);

    // Construct search object safely
    const searchQuery = req.query.search ? { name: String(req.query.search) } : undefined;

    // Handle fetching a single customer by ID
    if (req.query.customer_id) {
      const id = parseInt(req.query.customer_id as string, 10);

      if (isNaN(id)) {
        return sendResponse(
          res,
          false,
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.INVALID('Customer ID')
        );
      }

      const customer = await customerService.getCustomerById(id);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.FETCHED_SUCCESS('Customer'),
        customer
      );
    }

    const { totalRecords, data } = await customerService.getAllCustomer({
      ...req.query,
      search: searchQuery
    });

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.FETCHED_SUCCESS('Customer'),
      {
        totalRecords,
        customers: data
      }
    );
  } catch (error) {
    next(error);
  }
};

const AddCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(CustomerSchema, req.body, res);
    if (!isValid) {
      return;
    }
    const customerSevice = new CustomerService(req.user.id);
    const newCustomer = await customerSevice.addCustomer(req.body as CustomerType);
    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.CREATED_SUCCESS('Customer'),
      newCustomer
    );
  } catch (e) {
    next(e);
  }
};

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.body.customer_id) {
      sendResponse(res, false, STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.ID_REQUIRED('Customer'));
    }

    const customerSevice = new CustomerService(req.user.id);
    const deletedCategory = await customerSevice.deleteCustomer(Number(req.body.customer_id));

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.DELETE_SUCCESS('Customer'),
      deletedCategory
    );
  } catch (e) {
    next(e);
  }
};

const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(CustomerSchema, req.body, res, { isEdit: true });

    if (!isValid) {
      return;
    }
    const customerSevice = new CustomerService(req.user.id);
    const updatedCustomer = await customerSevice.updateCustomer(req.body.customer_id, req.body);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.UPDATE_SUCCESS('Customer'),
      updatedCustomer
    );
  } catch (e) {
    next(e);
  }
};
const customerController = {
  getAllCustomer,
  AddCustomer,
  deleteCustomer,
  updateCustomer
};

export default customerController;
