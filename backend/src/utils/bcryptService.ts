// bcryptService.ts
import bcrypt from 'bcryptjs';

const BcryptService = {
  async hashPassword(password: string): Promise<string | null> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      return null;
    }
  },

  async comparePassword(password: string, hashedPassword: string): Promise<boolean | null> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      return null;
    }
  }
};

export default BcryptService;
