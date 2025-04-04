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
  }

  //   getById: async (req: Request, res: Response) => {
  //     try {
  //       const product = await ProductService.getProductById(Number(req.params.id));
  //       if (!product) return res.status(404).json({ message: 'Product not found' });
  //       res.json(product);
  //     } catch (error) {
  //       res.status(500).json({ message: 'Error fetching product' });
  //     }
  //   },

  //   getAll: async (_req: Request, res: Response) => {
  //     try {
  //       const products = await ProductService.getAllProducts();
  //       res.json(products);
  //     } catch (error) {
  //       res.status(500).json({ message: 'Error fetching products' });
  //     }
  //   },

  //   update: async (req: Request, res: Response) => {
  //     try {
  //       const updated = await ProductService.updateProduct(Number(req.params.id), req.body);
  //       res.json(updated);
  //     } catch (error) {
  //       res.status(500).json({ message: 'Failed to update product' });
  //     }
  //   },

  //   delete: async (req: Request, res: Response) => {
  //     try {
  //       await ProductService.deleteProduct(Number(req.params.id));
  //       res.status(204).send();
  //     } catch (error) {
  //       res.status(500).json({ message: 'Failed to delete product' });
  //     }
  //   }
};
