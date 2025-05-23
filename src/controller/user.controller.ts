import { NextFunction, Request, Response } from 'express';
import UserService, { User } from '../services/UserService';
import STATUS_CODES from '../constants/statusCode';
import fileValidationSchema, {
  loginSchema,
  registerUserSchema,
  updateUserSchema
} from '../validationSchema/user.validation';
import { validateInput } from '../validationSchema';
import ERROR_MESSAGES from '../constants/errorMessages';
import sendResponse from '../utils/sendResponse';
import BcryptService from '../utils/bcryptService';
import { uploadFileToS3 } from '../utils/S3Service';
import jwtService from '../utils/jwtService';
import AppError from '../utils/AppError';

const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;
    const isValid = validateInput(loginSchema, req.body, res);
    if (!isValid) {
      return;
    }

    const userService = new UserService();
    const { password: userPassword, ...safeUser } = await userService.getUserByEmail(email);

    const isMatch = await BcryptService.comparePassword(password, userPassword);

    const token = jwtService.generateToken({ id: safeUser.user_id, email: safeUser.email });

    if (isMatch) {
      return sendResponse(res, true, STATUS_CODES.SUCCESS, ERROR_MESSAGES.AUTH.SUCCESS_LOGIN, {
        user: safeUser,
        token
      });
    } else {
      return sendResponse(
        res,
        false,
        STATUS_CODES.BAD_REQUEST,
        ERROR_MESSAGES.AUTH.INVALID_EMAIL_PASSWORD
      );
    }
  } catch (e) {
    next(e);
  }
};

const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const isValid = validateInput(registerUserSchema, req.body, res);

    if (!isValid) {
      return;
    }

    const userService = new UserService();
    const { password, ...userData } = await userService.registerUser(req.body as User);

    return sendResponse(
      res,
      true,
      STATUS_CODES.CREATED,
      ERROR_MESSAGES.AUTH.REGISTER_SUCCESS,
      userData
    );
  } catch (e) {
    next(e);
  }
};

const getUserDetail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(ERROR_MESSAGES.AUTH.USER_NOT_FOUND, STATUS_CODES.UNAUTHORIZED);
    }

    const userService = new UserService();
    const user = await userService.getUserById(userId);

    return sendResponse(res, true, STATUS_CODES.SUCCESS, ERROR_MESSAGES.AUTH.SUCCESS_LOGIN, user);
  } catch (e) {
    next(e);
  }
};

export const uploadProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.file) {
      return sendResponse(res, false, STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.USER.NO_FILE_FOUND);
    }
    const isValid = validateInput(fileValidationSchema, { profile_image: req.file }, res);

    if (!isValid) {
      return;
    }

    if (!req.user || !req.user.id) {
      return sendResponse(res, false, STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHENTIC_USER);
    }

    const { fileName } = await uploadFileToS3(req.file, 'profil_images');

    const userService = new UserService();
    await userService.updateUser(req.user.id, {
      profile_image: fileName
    });

    return sendResponse(
      res,
      true,
      STATUS_CODES.CREATED,
      ERROR_MESSAGES.USER.PROFILE_PIC_UPLOAD_SUCCESS
    );
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = req.user.id;

    const isValid = validateInput(updateUserSchema, req.body, res);

    if (!isValid) {
      return;
    }

    const userService = new UserService();
    await userService.updateUser(userId, req.body);

    return sendResponse(
      res,
      true,
      STATUS_CODES.SUCCESS,
      ERROR_MESSAGES.USER.PROFILE_UPDATED_SUCCESS
    );
  } catch (error) {
    next(error);
  }
};
const userController = { login, register, uploadProfilePic, getUserDetail, updateProfile };

export default userController;
