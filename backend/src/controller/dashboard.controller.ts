import { NextFunction, Request, Response } from 'express';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import CustomerService from '../services/CustomerService';
import { cacheData, getCachedData } from '../lib/rediesInit';

interface DashboardType {
  totalCustomers: number;
  monthNewCustomers: number;
}

const getDashboardData = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // const dataFromRedies = await getCachedData<DashboardType>('dashboard');
    const dataFromRedies =false;
    let DashboardData: DashboardType = { totalCustomers: 0, monthNewCustomers: 0 };
    if (!dataFromRedies) {
      const customerService = new CustomerService();
      const { monthNewCustomers, totalCustomers } = await customerService.getCustomerCount();
      DashboardData.monthNewCustomers = monthNewCustomers;
      DashboardData.totalCustomers = totalCustomers;
      // cacheData('dashboard', DashboardData);
    } else {
      DashboardData = dataFromRedies;
    }
    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      'Customer fetched successfully',
      DashboardData
    );
  } catch (e) {
    next(e);
  }
};

const dashboardController = {
  getDashboardData
};

export default dashboardController;
