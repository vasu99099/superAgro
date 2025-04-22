"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("./AppError"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const prismaErrorHandler = (error) => {
    console.log('error', error);
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return new AppError_1.default(`Duplicate entry. The value already exists.`, statusCode_1.default.CONFLICT);
            case 'P2003':
                return new AppError_1.default('Invalid foreign key reference.', statusCode_1.default.BAD_REQUEST);
            case 'P2025':
                return new AppError_1.default('Record not found.', statusCode_1.default.NOT_FOUND);
            default:
                return new AppError_1.default('Database error occurred.', statusCode_1.default.INTERNAL_SERVER_ERROR);
        }
    }
    if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        return new AppError_1.default(`Validation Error: ${error.message}`, statusCode_1.default.BAD_REQUEST);
    }
    if (error instanceof AppError_1.default) {
        return error;
    }
    return new AppError_1.default('Something went wrong.', statusCode_1.default.INTERNAL_SERVER_ERROR);
};
exports.default = prismaErrorHandler;
