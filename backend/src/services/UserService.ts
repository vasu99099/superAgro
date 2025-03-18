import STATUS_CODES from '../constants/statusCode';
import prisma from '../lib/prismaInit';
import AppError from '../utils/AppError';
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import BcryptService from '../utils/bcryptService';

export interface User {
  username: string,
  password:string,
  role_id: number,
  contact_number:string,
  email:string,
  firstname:string,
  lastname:string,

}

class UserService {
  async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      if (!user) {
        throw new AppError('User not found', STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new AppError('Database error', STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
  async registerUser(user: User) {
    try {
      const { username, password, role_id, contact_number, email, firstname, lastname } = user;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        throw new AppError("User already exists", STATUS_CODES.CONFLICT);
      }

      // Hash the password
      const hashedPassword = await BcryptService.hashPassword(password);
      
      if (!hashedPassword) {
        throw new AppError("Some thing went wrong", STATUS_CODES.NOT_FOUND);
      }

      // Create user
      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role_id,
          contact_number,
          email,
          firstname,
          lastname,
        },
      });

      return newUser; // Return the created user if needed

    } catch (error) {
      console.error("Error registering user:", error);
      throw new AppError("Database error", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }
}


export default UserService;
