import { Prisma } from '@prisma/client';
import AppError from './AppError';
import STATUS_CODES from '../constants/statusCode';

const prismaErrorHandler = (error: any) => {
  console.log('error', error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new AppError(`Duplicate entry. The value already exists.`, STATUS_CODES.CONFLICT);
      case 'P2003':
        return new AppError('Invalid foreign key reference.', STATUS_CODES.BAD_REQUEST);
      case 'P2025':
        return new AppError('Record not found.', STATUS_CODES.NOT_FOUND);
      default:
        return new AppError('Database error occurred.', STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(`Validation Error: ${error.message}`, STATUS_CODES.BAD_REQUEST);
  }

  if (error instanceof AppError) {
    return error;
  }

  return new AppError('Something went wrong.', STATUS_CODES.INTERNAL_SERVER_ERROR);
};

export default prismaErrorHandler;
