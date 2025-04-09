import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import STATUS_CODES from '../constants/statusCode';
import prismaErrorHandler from '../utils/prismaErrorHandler';
import { paginateAndSort } from '../utils/pagination';
import ERROR_MESSAGES from '../constants/errorMessages';
import TmpImageService from './TmpImageService';

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

export interface ProductInputType {
  userId: number;
  name: string;
  hsc_code?: string;
  content_technical?: string;
  categoryId: number;
  ProductImage?: ProductImageInput[];
  ProductPackaging?: ProductPackagingInput[];
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
            ProductPackaging: { select: { packSize: true, packagingType: true } }
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
          ProductPackaging: { select: { packSize: true, packagingType: true } }
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
      const {
        userId,
        ProductImage: images,
        ProductPackaging: productPacks,
        ...productInfo
      } = productData;

      const existingProduct = await prisma.product.findFirst({
        where: { name: productInfo.name, userId }
      });

      if (existingProduct) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.PRODUCT_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      const newProduct = await prisma.product.create({
        data: {
          ...productInfo,
          userId,
          ProductPackaging: {
            create:
              productPacks?.map((pack) => ({
                packSize: Number(pack.packSize),
                packagingType: pack.packagingType
              })) || []
          },
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
      TmpImageService.confirmImage(images?.map((i) => i.url) ?? []);
      return newProduct;
    } catch (error) {
      console.log('first', error);
      throw prismaErrorHandler(error);
    }
  }

  async updateProduct(productId: number, productData: ProductInputType) {
    try {
      const {
        ProductImage: images,
        userId,
        ProductPackaging: productPacks,
        ...productInfo
      } = productData;

      const existingProduct = await prisma.product.findUnique({
        where: { product_id: productId },
        include: { ProductImage: true, ProductPackaging: true }
      });

      if (!existingProduct) {
        throw new AppError('Product not found', STATUS_CODES.NOT_FOUND);
      }

      // Optional: check for duplicate name in same user's products
      const duplicateProduct = await prisma.product.findFirst({
        where: {
          name: productInfo.name,
          userId,
          NOT: { product_id: productId }
        }
      });

      if (duplicateProduct) {
        throw new AppError(ERROR_MESSAGES.PRODUCT.PRODUCT_ALREADY_EXISTS, STATUS_CODES.CONFLICT);
      }

      // Delete existing related images and packaging
      const existingImages = await prisma.productImage.findMany({ where: { productId } });
      const updatedImageUrls = images?.map((i) => i.url) ?? [];
      const deletedImages = existingImages.filter((img) => !updatedImageUrls.includes(img.url));
      TmpImageService.deletedImage(deletedImages.map((di) => di.url));
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productPackaging.deleteMany({ where: { productId } });

      // Update product and re-add relations
      const updatedProduct = await prisma.product.update({
        where: { product_id: productId },
        data: {
          ...productInfo,
          userId,
          ProductImage: {
            create:
              images?.map((img) => ({
                url: img.url,
                altText: img.altText || '',
                isPrimary: img.isPrimary ?? false
              })) || []
          },
          ProductPackaging: {
            create:
              productPacks?.map((pack) => ({
                packSize: Number(pack.packSize),
                packagingType: pack.packagingType
              })) || []
          }
        },
        include: {
          ProductImage: true,
          user: true,
          category: true
        }
      });

      TmpImageService.confirmImage(images?.map((i) => i.url) ?? []);

      return updatedProduct;
    } catch (error) {
      console.log('updateProduct error:', error);
      throw prismaErrorHandler(error);
    }
  }

  async deleteProduct(product_id: number) {
    try {
      const deleted = await prisma.product.delete({
        where: { product_id },
        include: { ProductImage: true }
      });

      if (deleted.ProductImage.length) {
        const images = deleted.ProductImage.map((p) => p.url);
        TmpImageService.deletedImage(images);
      }

      return deleted;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default ProductService;
