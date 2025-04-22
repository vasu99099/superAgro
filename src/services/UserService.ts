import ERROR_MESSAGES from '../constants/errorMessages';
import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import BcryptService from '../utils/bcryptService';
import prismaErrorHandler from '../utils/prismaErrorHandler';
import TmpImageService from './TmpImageService';

export interface User {
  username: string;
  password: string;
  role_id: number;
  contact_number: string;
  email: string;
  firstname: string;
  lastname: string;
  profile_image?: string;
}

class UserService {
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });
      if (!user) {
        throw new AppError(ERROR_MESSAGES.AUTH.NO_ACCOUND_FOUND, STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }

  async getUserById(user_id: number) {
    try {
      const user = await prisma.user.findUnique({
        omit: { password: true },
        where: { user_id },
        include: { role: true }
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

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }]
        }
      });
      if (existingUser) {
        throw new AppError(ERROR_MESSAGES.AUTH.ALREADY_REGISTERED, STATUS_CODES.CONFLICT);
      }

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

  async updateUser(user_id: number, updates: Partial<User>) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { user_id } });

      if (!existingUser) {
        throw new AppError(ERROR_MESSAGES.AUTH.NO_ACCOUND_FOUND, STATUS_CODES.NOT_FOUND);
      }

      if (updates.password) {
        updates.password = await BcryptService.hashPassword(updates.password);
      }

      const updatedUser = await prisma.user.update({
        where: { user_id },
        data: updates
      });

      if (existingUser.profile_image && updates.profile_image) {
        await TmpImageService.uploadImage(user_id, existingUser.profile_image);
      }
      return updatedUser;
    } catch (error) {
      throw prismaErrorHandler(error);
    }
  }
}

export default UserService;
