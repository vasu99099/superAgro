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

class VillageService {
  async getVillages(query: any) {
    try {
      const villages = await prisma.village.findMany({ select: { name: true, id: true } });
      const formattedVillages = villages.map((village) => ({
        label: village.name,
        value: village.id
      }));
      return formattedVillages;
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

export default VillageService;
