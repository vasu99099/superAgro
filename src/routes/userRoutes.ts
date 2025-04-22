import { Router } from 'express';
import multer from 'multer';

import userController from '../controller/user.controller';
import { ROUTES } from '../constants/routes';

const userRoutes: Router = Router();

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single('profilePic');

userRoutes.post(ROUTES.USER.UPLOAD_PROFILE_PIC, uploadMiddleware, userController.uploadProfilePic);
userRoutes.get(ROUTES.USER.WHO_M_I, userController.getUserDetail);
userRoutes.put(ROUTES.USER.UPDATE_PROFILE, userController.updateProfile);

export default userRoutes;
