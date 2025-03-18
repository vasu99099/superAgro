import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';
const JWT_EXPIRATION = '3h';

const jwtService = {
  generateToken: (user: { id: number; email: string; name: string }) => {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
  },
  verifyToken: (token: string) => {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const { iat, exp, ...cleanedDecoded } = decoded;
      return cleanedDecoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};

export default jwtService;
