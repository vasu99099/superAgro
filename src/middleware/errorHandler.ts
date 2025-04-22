import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import sendResponse from '../utils/sendResponse';

const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message, isOperational } = err as AppError;
  // Set default values for unexpected errors
  if (!statusCode) statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  if (!message) message = ERROR_MESSAGES.INTERNAL_ERROR;

  // if (!isOperational) {
  //   console.error('🔴 CRITICAL ERROR! RESTART REQUIRED!');
  //   process.exit(1); // Exit process in case of critical (programming) errors
  // }

  sendResponse(
    res,
    false,
    statusCode,
    message,
    process.env.NODE_ENV === 'dev' ? err.stack : undefined
  );
  return;
};

export default errorHandler;
