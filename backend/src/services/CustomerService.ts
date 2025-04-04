import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import { paginateAndSort } from '../utils/pagination';
import prismaErrorHandler from '../utils/prismaErrorHandler';

export interface CustomerType {
  name: string;
  address?: string;
  village_id: number;
  phone: string;
  whatsapp_number?: string;
  email?: string;
}

class CustomerService {
  async getAllCustomer(query: any) {
    try {
      const { skip, take, orderBy, where } = paginateAndSort(query);

      const [allCustomers, totalRecords] = await prisma.$transaction([
        prisma.customer.findMany({
          where,
          orderBy,
          skip,
          take,
          include: { village: true, farms: { include: { village: { select: { name: true } } } } }
        }),
        prisma.customer.count({ where })
      ]);

      const formattedCustomers = allCustomers.map((customer) => ({
        ...customer,
        farms: customer.farms.map((farm) => ({
          ...farm,
          village_name: farm.village?.name
        }))
      }));

      return {
        totalRecords,
        data: formattedCustomers
      };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async getCustomerById(customer_id: number) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { customer_id },
        include: { village: true, farms: true }
      });
      return customer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async getCustomerCount() {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const totalCustomers = await prisma.customer.count();

      const monthNewCustomers = await prisma.customer.count({
        where: {
          created_at: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      return { totalCustomers, monthNewCustomers };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async addCustomer(customer: CustomerType) {
    try {
      const { phone } = customer;

      const existingCustomer = await prisma.customer.findUnique({
        where: { phone }
      });

      if (existingCustomer) {
        throw new AppError(ERROR_MESSAGES.CUSTOMER.CUSTOMER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const newCustomer = await prisma.customer.create({
        data: customer
      });
      return newCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async deleteCustomer(customer_id: number) {
    try {
      const deletedCustomer = await prisma.customer.delete({
        where: { customer_id }
      });
      return deletedCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async updateCustomer(customer_id: number, data: CustomerType) {
    try {
      const updatedCustomer = await prisma.customer.update({
        where: { customer_id },
        data: data
      });
      return updatedCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default CustomerService;
