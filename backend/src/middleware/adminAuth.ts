import { NextFunction, Request, Response } from 'express';
import jwtService from '../utils/jwtService';

const adminAuthUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decodedToken = jwtService.verifyToken(token);
    // Verify Token
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

export default adminAuthUser;
