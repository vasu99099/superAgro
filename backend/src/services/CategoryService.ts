import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import { paginateAndSort } from '../utils/pagination';
import prismaErrorHandler from '../utils/prismaErrorHandler';

export interface Category {
  name: string;
  description?: string;
}

class CategoryService {
  async getAllCategory(query: any) {
    try {
       const { skip, take, orderBy, where } = paginateAndSort(query);
       let allCategories, totalRecords;
        if (!query.page) {
          // No pagination – return all records
          [allCategories, totalRecords] = await prisma.$transaction([
            prisma.category.findMany({ where, orderBy }),
            prisma.category.count({ where }),
          ]);
        } else {
          // Pagination applied
          [allCategories, totalRecords] = await prisma.$transaction([
            prisma.category.findMany({ where, orderBy, skip, take }),
            prisma.category.count({ where }),
          ]);
        }
      return {
        totalRecords,
        data: allCategories
      };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  

  async addCategory(category: Category) {
    try {
      const { name, description } = category;

      const existingCategory = await prisma.category.findUnique({
        where: { name }
      });

      if (existingCategory) {
        throw new AppError(ERROR_MESSAGES.POST.POST_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const newCategory = await prisma.category.create({
        data: {
          name,
          description
        }
      });
      return newCategory;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async deleteCategory(category_id: number) {
    try {
      const deletedCategory = await prisma.category.delete({
        where: { category_id }
      });
      return deletedCategory;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async updateCategory(category_id: number, data: Category) {
    try {
      const updatedCategory = await prisma.category.update({
        where: { category_id },
        data: data
      });
      return updatedCategory;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default CategoryService;
