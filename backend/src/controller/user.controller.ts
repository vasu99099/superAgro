import { NextFunction, Request, Response } from 'express';
import UserService, { User } from '../services/UserService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import BcryptService from '../utils/bcryptService';
import { loginSchema, registerUserSchema } from '../validationSchema/user.validation';
import { validateInput } from '../validationSchema';
import ERROR_MESSAGES from '../constants/errorMessages';

const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;
    const isValid = validateInput(loginSchema, req.body, res);
    if (!isValid) {
      return;
    }

    const userService = new UserService();
    const user = await userService.getUserByEmail(email);

    const isMatch = await BcryptService.comparePassword(password, user.password);

    if (isMatch) {
      return sendResponse(res, true, STATUS_CODES.SUCCESS, ERROR_MESSAGES.AUTH.SUCCESS_LOGIN);
    } else {
      return sendResponse(
        res,
        false,
        STATUS_CODES.UNAUTHORIZED,
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

const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    return sendResponse(res, true, STATUS_CODES.CREATED, 'User registered successfully');
  } catch (e) {
    next(e);
  }
};

const userController = { login, register, getUser };

export default userController;
