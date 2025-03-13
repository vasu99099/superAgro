import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';

class UserService {
  async getUserByUsername(username: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      });
      if (!user) {
        throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new AppError('Database error', STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}
export default UserService;
