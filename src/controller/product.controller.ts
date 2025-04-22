// controllers/product.controller.ts
import { NextFunction, Request, Response } from 'express';
import STATUS_CODES from '../constants/statusCode';
import { validateInput } from '../validationSchema';
import { productValidationSchema } from '../validationSchema/product.validation';
import ProductService, { ProductInputType } from '../services/ProductService';
import sendResponse from '../utils/sendResponse';
import { getUploadSignedUrl } from '../utils/S3Service';
import TmpImageService from '../services/TmpImageService';
import ERROR_MESSAGES from '../constants/errorMessages';
interface productImage {
  fileType: string;
  size: number;
  fileName: string;
}
export const productController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const isValid = validateInput(productValidationSchema, req.body, res);
      if (!isValid) {
        return;
      }
      const productSevice = new ProductService();
      req.body.userId = req.user?.id;
      const newCustomer = await productSevice.addProduct(req.body as ProductInputType);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.CREATED_SUCCESS('Product'),
        newCustomer
      );
    } catch (e) {
      next(e);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productSevice = new ProductService();
      const product = await productSevice.getProductById(Number(req.query.product_id));
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.FETCHED_SUCCESS('Product'),
        product
      );
    } catch (e) {
      next(e);
    }
  },

  getAllProduct: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productSevice = new ProductService();
      if (req.query.product_id) {
        const id = parseInt(req.query.product_id as string, 10);

        if (isNaN(id)) {
          return sendResponse(
            res,
            false,
            STATUS_CODES.BAD_REQUEST,
            ERROR_MESSAGES.INVALID('Product Id'),
            null
          );
        }

        const product = await productSevice.getProductById(id);
        return sendResponse(
          res,
          true,
          STATUS_CODES.SUCCESS,
          ERROR_MESSAGES.FETCHED_SUCCESS('Product Id'),
          product
        );
      }
      const searchQuery = req.query.search ? { name: String(req.query.search) } : undefined;
      const { totalRecords, data } = await productSevice.getAllProducts({
        ...req.query,
        search: searchQuery
      });
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.FETCHED_SUCCESS('Product Id'),
        {
          totalRecords,
          products: data
        }
      );
    } catch (e) {
      next(e);
    }
  },

  updateProduct: async (req: Request, res: Response): Promise<any> => {
    try {
      req.body.userId = req.user?.id;
      const productId = req.body.product_id;
      if (isNaN(productId)) {
        return sendResponse(
          res,
          false,
          STATUS_CODES.BAD_REQUEST,
          ERROR_MESSAGES.ID_REQUIRED('Product Id'),
          null
        );
      }
      const productSevice = new ProductService();
      const updated = await productSevice.updateProduct(productId, req.body);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.UPDATE_SUCCESS('Product'),
        updated
      );
    } catch (error) {
      res.status(500).json({ message: 'Failed to update product' });
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productSevice = new ProductService();
      const deleted = await productSevice.deleteProduct(Number(req.body.product_id));
      console.log('deleted', deleted);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.DELETE_SUCCESS('Product'),
        deleted
      );
    } catch (e) {
      next(e);
    }
  },

  productPresigned: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const imagesData = req.body.images;
      const product = 'Product';
      const userId = req.user?.id;
      const presignedUrls = await Promise.all(
        imagesData.map(async (productImage: productImage) => {
          const { uploadUrl, fileKey } = await getUploadSignedUrl(
            productImage.fileType,
            productImage.size,
            product
          );

          return { uploadUrl, fileKey, fileName: productImage.fileName };
        })
      );
      const fileKeys = presignedUrls.map((item) => item.fileKey);
      TmpImageService.uploadImage(userId, fileKeys);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        ERROR_MESSAGES.CREATED_SUCCESS('Product Images'),
        presignedUrls
      );
    } catch (e) {
      next(e);
    }
  }
};
