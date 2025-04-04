import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import prismaErrorHandler from '../utils/prismaErrorHandler';
import { paginateAndSort } from '../utils/pagination';

export interface FarmType {
  farm_name: string;
  customer_id: number;
  village_id: number;
  longitude?: string;
  latitude?: string;
}

class FarmService {
  async getAllFarms(query: any) {
    try {
      const { skip, take, orderBy, where } = paginateAndSort(query);

      const [allFarms, totalRecords] = await prisma.$transaction([
        prisma.farms.findMany({
          where,
          orderBy,
          skip,
          take,
          include: { customer: true, village: true }
        }),
        prisma.farms.count({ where })
      ]);

      return {
        totalRecords,
        data: allFarms
      };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async getFarmById(farm_id: number) {
    try {
      const farm = await prisma.farms.findUnique({
        where: { farm_id },
        include: { customer: true, village: true }
      });

      if (!farm) {
        throw new AppError('Farm not found', STATUS_CODES.NOT_FOUND);
      }

      return farm;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async addFarm(data: FarmType) {
    try {
      const newFarm = await prisma.farms.create({
        data
      });

      return newFarm;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async deleteFarm(farm_id: number) {
    try {
      const deletedFarm = await prisma.farms.delete({
        where: { farm_id }
      });

      return deletedFarm;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async updateFarm(farm_id: number, data: FarmType) {
    try {
      const updatedFarm = await prisma.farms.update({
        where: { farm_id },
        data
      });

      return updatedFarm;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default FarmService;
