import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import userController from '../controller/user.controller';
import multer from 'multer';
const userRoutes: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single('profilePic');

userRoutes.post(ROUTES.USER.UPLOAD_PROFILE_PIC, uploadMiddleware, userController.uploadProfilePic);
userRoutes.get(ROUTES.USER.WHO_M_I, userController.getUserDetail);
userRoutes.put(ROUTES.USER.UPDATE_PROFILE, userController.uploadProfile);

export default userRoutes;
