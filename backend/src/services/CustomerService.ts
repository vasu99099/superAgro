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
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  async getAllCustomer(query: any) {
    try {
      const { skip, take, orderBy, where } = paginateAndSort(query, this.userId);

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
        where: { customer_id, user_id: this.userId },
        include: { village: true, farms: { include: { village: { select: { name: true } } } } }
      });
      const formattedCustomers = {
        ...customer,
        farms: customer?.farms.map((farm) => ({
          ...farm,
          village_name: farm.village?.name
        }))
      };

      return formattedCustomers;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async getCustomerCount() {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const totalCustomers = await prisma.customer.count({ where: { user_id: this.userId } });

      const monthNewCustomers = await prisma.customer.count({
        where: {
          user_id: this.userId,
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
        where: { phone, user_id: this.userId }
      });

      if (existingCustomer) {
        throw new AppError(ERROR_MESSAGES.CUSTOMER.CUSTOMER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const newCustomer = await prisma.customer.create({
        data: { ...customer, user_id: this.userId }
      });
      return newCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async deleteCustomer(customer_id: number) {
    try {
      const deletedCustomer = await prisma.customer.delete({
        where: { customer_id, user_id: this.userId }
      });
      return deletedCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async updateCustomer(customer_id: number, data: CustomerType) {
    try {
      const existing = await prisma.customer.findFirst({
        where: {
          phone: data.phone,
          user_id: this.userId,
          NOT: { customer_id }
        }
      });

      if (existing) {
        throw new AppError(ERROR_MESSAGES.CUSTOMER.CUSTOMER_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const updatedCustomer = await prisma.customer.update({
        where: { customer_id, user_id: this.userId },
        data: data
      });
      return updatedCustomer;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default CustomerService;
