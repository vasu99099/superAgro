import { NextFunction, Request, Response } from 'express';
import UserService, { User } from '../services/UserService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import AppError from '../utils/AppError';
import BcryptService from '../utils/bcryptService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password} = req.body;
    console.log(email, password);
    const userService = new UserService();
    const user = await userService.getUserByEmail(email);
    const isMatch = await BcryptService.comparePassword(password, user.password);
    if(isMatch) {
      sendResponse(res, true, STATUS_CODES.SUCCESS, 'User Authentcated successfully');
    } else {
      sendResponse(res, false, STATUS_CODES.UNAUTHORIZED, 'Invalid username or password');
    }
    res.status(STATUS_CODES.SUCCESS).json(user);
  } catch (e) {
    next(e);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {   
    const userService = new UserService();
    await userService.registerUser(req.body as User);
    sendResponse(res, true, STATUS_CODES.CREATED, 'User registered successfully');
  } catch (e) {
    next(e);
  }
};
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {   
    
    sendResponse(res, true, STATUS_CODES.CREATED, 'User registered successfully');
  } catch (e) {
    next(e);
  }
};