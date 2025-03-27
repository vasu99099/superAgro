import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import prismaErrorHandler from '../utils/prismaErrorHandler';

export interface Category {
  name: string;
  description?: string;
}

class CategoryService {
  async getAllCategory() {
    try {
      const allCategories = await prisma.category.findMany();
      // if (!allCategories) {
      //   throw new AppError(ERROR_MESSAGES.AUTH.NO_ACCOUND_FOUND, STATUS_CODES.NOT_FOUND);
      // }
      return allCategories;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async addCategory(category : Category) {
    try {
      const { name, description } = category;

      const existingCategory = await prisma.category.findUnique({ where: { name } });
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
    } catch(error) {
      throw prismaErrorHandler(error);
    }
  }
  async deleteCategory(category_id: number) {
    try {
      const deletedCategory = await prisma.category.delete({
        where: { category_id },
    });
    return deletedCategory;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async updateCategory(category_id: number, data : Category) {
    try {
      const updatedCategory = await prisma.category.update({
          where: { category_id },
          data: data, // Fields to update
      });
      return updatedCategory;
    } catch (error) {
        throw prismaErrorHandler(error);
    }
  }
}

export default CategoryService;
