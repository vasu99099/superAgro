import { NextFunction, Request, Response } from 'express';
import jwtService from '../utils/jwtService';

export interface AuthRequest extends Request {
  user?: any;
}
const adminAuthUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Extract token from cookies or Authorization header
    // const token = req.headers.authorization;

    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized: No token provided' });
    // }
    // const decodedToken = jwtService.verifyToken(token);
    // Verify Token
    // const decoded = jwt.verify(token, SECRET_KEY);
    // req.user = decoded; // Attach user data to the request
    req.user = { id: 4 };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

export default adminAuthUser;
