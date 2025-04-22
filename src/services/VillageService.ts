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
}

export default VillageService;
