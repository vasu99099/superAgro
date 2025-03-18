import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import BcryptService from '../utils/bcryptService';
import prismaErrorHandler from '../utils/prismaErrorHandler';

export interface User {
  username: string;
  password: string;
  role_id: number;
  contact_number: string;
  email: string;
  firstname: string;
  lastname: string;
}

class UserService {
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        throw new AppError(ERROR_MESSAGES.AUTH.NO_ACCOUND_FOUND, STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
  async registerUser(user: User) {
    try {
      const { username, password, role_id, contact_number, email, firstname, lastname } = user;

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new AppError(ERROR_MESSAGES.AUTH.ALREADY_REGISTERED, STATUS_CODES.CONFLICT);
      }

      // Hash the password
      const hashedPassword = await BcryptService.hashPassword(password);

      if (!hashedPassword) {
        throw new AppError(ERROR_MESSAGES.SOMETHING_WRONG, STATUS_CODES.NOT_FOUND);
      }

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role_id: Number(role_id),
          contact_number,
          email,
          firstname,
          lastname
        }
      });

      return newUser;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default UserService;
