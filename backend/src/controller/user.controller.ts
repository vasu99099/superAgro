import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';
import AppError from '../utils/AppError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = new UserService();
    throw new AppError('vasu', 404);
    const user = await userService.getUserByUsername('vasu');
    sendResponse(res, true, STATUS_CODES.SUCCESS, 'User retrieved successfully', user);
    res.status(STATUS_CODES.SUCCESS).json(user);
  } catch (e) {
    next(e);
  }
};
