import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import prismaErrorHandler from '../utils/prismaErrorHandler';
import { paginateAndSort } from '../utils/pagination';
import ERROR_MESSAGES from '../constants/errorMessages';

export interface ProductImageInput {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface ProductInputType {
  userId: number;
  name: string;
  hsc_code?: string;
  content_technical?: string;
  categoryId: number;
  images?: ProductImageInput[];
}

class ProductService {
  async getAllProducts(query: any) {
    try {
      const { skip, take, orderBy, where } = paginateAndSort(query);

      const [allProducts, totalRecords] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take,
          include: {
            category: true,
            ProductImage: true,
          }
        }),
        prisma.product.count({ where })
      ]);

      return {
        totalRecords,
        data: allProducts
      };
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async getProductById(product_id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { product_id },
        include: {
          category: true,
          ProductImage: true,
        }
      });

      if (!product) {
        throw new AppError('Product not found', STATUS_CODES.NOT_FOUND);
      }

      return product;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async addProduct(productData: ProductInputType) {
    try {
      const { images, ...productInfo } = productData;

      const existingProduct = await prisma.product.findFirst({
        where: { name: productInfo.name }
      });

      if (existingProduct) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.PRODUCT_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const newProduct = await prisma.product.create({
        data: {
          ...productInfo,
          ProductImage: {
            create:
              images?.map((img) => ({
                url: img.url,
                altText: img.altText || '',
                isPrimary: img.isPrimary ?? false
              })) || []
          }
        },
        include: {
          ProductImage: true,
          user: true,
          category: true
        }
      });

      return newProduct;
    } catch (error) {
      console.log('first', error);
      throw prismaErrorHandler(error);
    }
  }

  async updateProduct(product_id: number, data: Partial<ProductInputType>) {
    try {
      const updated = await prisma.product.update({
        where: { product_id },
        data
      });

      return updated;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async deleteProduct(product_id: number) {
    try {
      const deleted = await prisma.product.delete({
        where: { product_id }
      });

      return deleted;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default ProductService;
