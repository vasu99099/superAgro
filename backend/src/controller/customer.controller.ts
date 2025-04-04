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

const getAllCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const customerService = new CustomerService();

    // Construct search object safely
    const searchQuery = req.query.search ? { name: String(req.query.search) } : undefined;

    // Handle fetching a single customer by ID
    if (req.query.customer_id) {
      const id = parseInt(req.query.customer_id as string, 10);

      if (isNaN(id)) {
        return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid customer ID', null);
      }

      const customer = await customerService.getCustomerById(id);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        'Customer fetched successfully',
        customer
      );
    }

    const { totalRecords, data } = await customerService.getAllCustomer({
      ...req.query,
      search: searchQuery
    });

    return sendResponse(res, true, STATUS_CODES.SUCCESS, 'All customers fetched successfully', {
      totalRecords,
      customers: data
    });
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
    const customerSevice = new CustomerService();
    const newCustomer = await customerSevice.addCustomer(req.body as CustomerType);
    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Customer Added Successfully',
      newCustomer
    );
  } catch (e) {
    next(e);
  }
};

const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.body.customer_id) {
      sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Request');
    }

    const customerSevice = new CustomerService();
    const deletedCategory = await customerSevice.deleteCustomer(req.body.customer_id);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Customer deleted Successfully',
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
    const customerSevice = new CustomerService();
    const updatedCustomer = await customerSevice.updateCustomer(req.body.customer_id, req.body);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Category Updated Successfully',
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
