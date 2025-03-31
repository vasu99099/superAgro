import ERROR_MESSAGES from "../constants/errorMessages";
import STATUS_CODES from "../constants/statusCode";
import prisma from "../lib/prismaInit";
import AppError from "../utils/AppError";
import prismaErrorHandler from "../utils/prismaErrorHandler";

export interface Category {
  name: string;
  description?: string;
}

class CategoryService {
  async getAllCategory(query : any) {
    try {
      let { page = 1, order = 'desc', order_by = '', page_size = 10, search = '' } = query;
        // Convert values to appropriate types
        const take = parseInt(page_size) || 10;
        const skip = (parseInt(page) - 1) * take;
        order = ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'desc';

        // Define filtering conditions
        const where = search
            ? {
                  name: {
                      contains: search,
                  },
              }
            : {};

        const allCategories = await prisma.category.findMany({
            where,
            orderBy: order_by ? { [order_by]: order } : undefined,
            skip,
            take,
        });
        const totalRecords = await prisma.category.count({ where });     
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
        where: { name },
      });
      if (existingCategory) {
        throw new AppError(
          ERROR_MESSAGES.POST.POST_ALREADY_EXISTS,
          STATUS_CODES.CONFLICT
        );
      }
      const newCategory = await prisma.category.create({
        data: {
          name,
          description,
        },
      });
      return newCategory;
    } catch (error) {
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
  async updateCategory(category_id: number, data: Category) {
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
