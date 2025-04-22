import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string | object;
  data?: T | null;
  error?: string | null;
}

const sendResponse = <T>(
  res: Response,
  success: boolean,
  statusCode: number = 200,
  message: string | object,
  data: T | null = null,
  error: string | null = null
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({ success, message, data, error });
};

export default sendResponse;
