// controllers/product.controller.ts
import { NextFunction, Request, Response } from 'express';
import STATUS_CODES from '../constants/statusCode';
import { validateInput } from '../validationSchema';
import ProductService, { ProductInputType } from '../services/ProductService';
import sendResponse from '../utils/sendResponse';
import { getUploadSignedUrl } from '../utils/S3Service';
import TmpImageService from '../services/TmpImageService';
import { dosageSchemaValidationSchema } from '../validationSchema/suggestedPesticide.validation';
import SuggestedPesticideService, { DosageInputType } from '../services/SuggestedPesticideService';

interface productImage {
  fileType: string;
  size: number;
  fileName: string;
}

export const dosageController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const isValid = validateInput(dosageSchemaValidationSchema, req.body, res);
      if (!isValid) {
        return;
      }
      const suggestedPesticideSevice = new SuggestedPesticideService();
      const dosage = await suggestedPesticideSevice.addDosage(req.body as DosageInputType);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Dosage created Successfully', dosage);
    } catch (e) {
      next(e);
    }
  },

  getDosage: async (req: Request, res: Response): Promise<any> => {
    try {
      const { farm_id } = req.params;

      const suggestedPesticideSevice = new SuggestedPesticideService();

      const dosage = await suggestedPesticideSevice.getDosageByFarmId(Number(farm_id));
      if (!dosage) return res.status(404).json({ message: 'Suggestion not found' });
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Suggestion get Successfully', dosage);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching suggestion' });
    }
  },
  getDosageBYId: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { dosage_id } = req.params;

      const suggestedPesticideSevice = new SuggestedPesticideService();

      const dosage = await suggestedPesticideSevice.getDosageByDosageId(Number(dosage_id));
      if (!dosage) return res.status(404).json({ message: 'Suggestion not found' });
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Suggestion get Successfully', dosage);
    } catch (error) {
      next(error);
    }
  },

  markDosageAsPurchased: async (req: Request, res: Response): Promise<any> => {
    try {
      const { dosage_id } = req.params;

      const suggestedPesticideSevice = new SuggestedPesticideService();

      const dosage = await suggestedPesticideSevice.markDosageAsPurchased(Number(dosage_id));
      if (!dosage) return res.status(404).json({ message: 'Dosage not found' });
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Saved As Purchased', dosage);
    } catch (error) {
      res.status(500).json({ message: 'Error to mark as purchased' });
    }
  },

  updateDosage: async (req: Request, res: Response): Promise<any> => {
    try {
      req.body.userId = req.user?.id;
      const dosageId = Number(req.body.dosage_id);

      if (isNaN(dosageId)) {
        return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, 'Invalid Suggestion ID', null);
      }
      const suggestedPesticideSevice = new SuggestedPesticideService();
      const updated = await suggestedPesticideSevice.updateDosage(dosageId, req.body);
      return sendResponse(
        res,
        true,
        STATUS_CODES.SUCCESS,
        'Suggestion Updated Successfully',
        updated
      );
    } catch (error) {
      res.status(500).json({ message: 'Failed to update Suggestion' });
    }
  },

  deleteDosage: async (req: Request, res: Response): Promise<any> => {
    try {
      console.log('"in"', req.body.dosage_id);
      const suggestedPesticideSevice = new SuggestedPesticideService();
      const deleted = await suggestedPesticideSevice.deleteDosage(Number(req.body.dosage_id));
      console.log('deleted', deleted);
      return sendResponse(res, true, STATUS_CODES.SUCCESS, 'Product Deleted Successfully', deleted);
    } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: 'Failed to delete product' });
    }
  },

  productPresigned: async (req: Request, res: Response): Promise<any> => {
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
