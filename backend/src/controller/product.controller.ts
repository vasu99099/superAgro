// controllers/product.controller.ts
import { NextFunction, Request, Response } from 'express';
import STATUS_CODES from '../constants/statusCode';
import { validateInput } from '../validationSchema';
import { productValidationSchema } from '../validationSchema/product.validation';
import ProductService, { ProductInputType } from '../services/ProductService';
import sendResponse from '../utils/sendResponse';
import { getUploadSignedUrl } from '../utils/S3Service';
import TmpImageService from '../services/TmpImageService';
import { AuthRequest } from '../middleware/adminAuth';
interface productImage {
  fileType: string;
  size: number;
  fileName: string;
}
export const productController = {
  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
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
        'Product created Successfully',
        newCustomer
      );
    } catch (e) {
      next(e);
    }
  },

  getById: async (req: Request, res: Response): Promise<any> => {
    try {
      const productSevice = new ProductService();
      const product = await productSevice.getProductById(Number(req.query.product_id));
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        'Product get byId Successfully',
        product
      );
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  },

  getAllProduct: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const productSevice = new ProductService();
      if (req.query.product_id) {
        const id = parseInt(req.query.product_id as string, 10);

        if (isNaN(id)) {
          return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Product ID', null);
        }

        const product = await productSevice.getProductById(id);
        return sendResponse(
          res,
          true,
          STATUS_CODES.SUCCESS,
          'Product fetched successfully',
          product
        );
      }
      const { totalRecords, data } = await productSevice.getAllProducts(req.query);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'All Product fetched Successfully', {
        totalRecords,
        products: data
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  },

  updateProduct: async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      req.body.userId = req.user?.id;
      const productId = req.body.product_id;
      if (isNaN(productId)) {
        return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Product ID', null);
      }
      const productSevice = new ProductService();
      const updated = await productSevice.updateProduct(productId, req.body);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Product Updated Successfully', updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update product' });
    }
  },

  deleteProduct: async (req: Request, res: Response): Promise<any> => {
    try {
      const productSevice = new ProductService();
      const deleted = await productSevice.deleteProduct(Number(req.body.product_id));
      console.log('deleted', deleted);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Product Deleted Successfully', deleted);
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product' });
    }
  },

  productPresigned: async (req: AuthRequest, res: Response): Promise<any> => {
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
      const image = TmpImageService.uploadImage(userId, fileKeys);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        'Product Images Added Successfully',
        presignedUrls
      );
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products images' });
    }
  }
};
