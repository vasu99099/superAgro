import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import prismaErrorHandler from '../utils/prismaErrorHandler';
import { paginateAndSort } from '../utils/pagination';
import ERROR_MESSAGES from '../constants/errorMessages';
import TmpImageService from './TmpImageService';
import { Dosage } from '@prisma/client';

export enum PackingUnit {
  MG = 'mg',
  G = 'g',
  KG = 'kg',
  ML = 'ml',
  L = 'l'
}

export interface ProductImageInput {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}
export interface ProductPackagingInput {
  packSize: Number;
  packagingType: PackingUnit;
}
interface suggestionInputType {
  product_id: number;
  note: string;
}
export interface DosageInputType {
  farm_id: number;
  customer_id: number;
  isClosed: boolean;
  suggestions: suggestionInputType[];
}

class SuggestedPesticideService {
  async getDosageByFarmId(farm_id: number): Promise<{ open: Dosage[]; closed: Dosage[] }> {
    try {
      const dosage = await prisma.dosage.findMany({
        where: { farm_id },
        include: { suggestions: { include: { product: { select: { name: true } } } } }
      });

      const transformedDosages = dosage.map((dosage) => ({
        ...dosage,
        suggestions: dosage.suggestions.map((suggestion) => ({
          ...suggestion,
          product: suggestion.product.name
        }))
      }));

      const openDosage: Dosage[] = [],
        closeDosage: Dosage[] = [];

      transformedDosages.forEach((td) =>
        td.isClosed ? closeDosage.push(td) : openDosage.push(td)
      );

      return { open: openDosage, closed: closeDosage };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async getDosageByDosageId(dosage_id: number) {
    try {
      const dosage = await prisma.dosage.findUnique({
        where: { dosage_id },
        include: { suggestions: { include: { product: true } }, farm: true }
      });
      return dosage;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async addDosage(dosageData: DosageInputType) {
    try {
      const { suggestions, ...dosageInfo } = dosageData;

      const dosage = await prisma.dosage.create({
        data: {
          ...dosageInfo,
          suggestions: {
            create:
              suggestions?.map((pack) => ({
                product_id: pack.product_id,
                note: pack.note
              })) || []
          }
        },
        include: {
          suggestions: true
        }
      });
      return dosage;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async markDosageAsPurchased(dosage_id: number) {
    try {
      const dosage = await prisma.dosage.update({ where: { dosage_id }, data: { isClosed: true } });
      return dosage;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async updateDosage(dosage_id: number, dosageData: DosageInputType) {
    try {
      const { suggestions, ...dosageInfo } = dosageData;

      if (suggestions && suggestions.length > 0) {
        await prisma.suggestedPesticide.deleteMany({
          where: { dosage_id }
        });
      }

      const updatedDosage = await prisma.dosage.update({
        where: { dosage_id },
        data: {
          farm_id: dosageInfo.farm_id,
          suggestions: suggestions
            ? {
                create: suggestions.map((pack) => ({
                  product_id: pack.product_id,
                  note: pack.note
                }))
              }
            : undefined
        }
      });

      return updatedDosage;
    } catch (error) {
      console.log('error', error);
      throw prismaErrorHandler(error);
    }
  }

  async deleteDosage(dosage_id: number) {
    try {
      const deleted = await prisma.dosage.delete({
        where: { dosage_id }
      });
      return deleted;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default SuggestedPesticideService;
