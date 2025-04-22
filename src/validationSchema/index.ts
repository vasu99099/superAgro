import Joi from 'joi';
import sendResponse from '../utils/sendResponse';
import { Response } from 'express';
import STATUS_CODES from '../constants/statusCode';

export const validateInput = (
  schema: Joi.ObjectSchema,
  data: object,
  res: Response,
  context?: Record<string, any> | undefined
) => {
  const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true, context });

  if (!error) {
    return true;
  }
  const errors = error.details.reduce((acc, cur) => {
    acc[cur.path[0]] = cur.message;
    return acc;
  }, {} as Record<string, string>);

  sendResponse(res, false, STATUS_CODES.BAD_REQUEST, errors);

  return false;
};
