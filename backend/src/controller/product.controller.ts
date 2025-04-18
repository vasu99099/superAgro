// controllers/product.controller.ts
import { NextFunction, Request, Response } from 'express';
import STATUS_CODES from '../constants/statusCode';
import { validateInput } from '../validationSchema';
import { productValidationSchema } from '../validationSchema/product.validation';
import ProductService, { ProductInputType } from '../services/ProductService';
import sendResponse from '../utils/sendResponse';

export const productController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const isValid = validateInput(productValidationSchema, req.body, res);
      if (!isValid) {
        return;
      }
      const productSevice = new ProductService();
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

    getById: async (req: Request, res: Response): Promise<any>  => {
      try {
        const productSevice = new ProductService();
        console.log(req.params.id);
        const product = await productSevice.getProductById(Number(req.query.id));
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

  getAllCustomer: async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
      try {
        const productSevice = new ProductService();
        const products = await productSevice.getAllProducts(req.query);
        return sendResponse(
          res,
          true,
          STATUS_CODES.SUCCESS,
          'All Product fetched Successfully',
          products
        );
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
      }
    },

    updateCustomer: async (req: Request, res: Response): Promise<any> => {
      try {
        const productSevice = new ProductService();
        const updated = await productSevice.updateProduct(Number(req.params.id), req.body);
        return sendResponse(
          res,
          true,
          STATUS_CODES.SUCCESS,
          'Product Updated Successfully',
          updated
        );
      } catch (error) {
        res.status(500).json({ message: 'Failed to update product' });
      }
    },

    deleteCustomer: async (req: Request, res: Response): Promise<any> => {
      try {
        const productSevice = new ProductService();
        const deleted = await productSevice.deleteProduct(Number(req.params.id));
        return sendResponse(
          res,
          true,
          STATUS_CODES.SUCCESS,
          'Product Deleted Successfully',
          deleted
        );
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete product' });
      }
    }
};
