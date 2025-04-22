"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const prismaInit_1 = __importDefault(require("../lib/prismaInit"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const bcryptService_1 = __importDefault(require("../utils/bcryptService"));
const prismaErrorHandler_1 = __importDefault(require("../utils/prismaErrorHandler"));
const TmpImageService_1 = __importDefault(require("./TmpImageService"));
class UserService {
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prismaInit_1.default.user.findUnique({
                    where: { email },
                    include: { role: true }
                });
                if (!user) {
                    throw new AppError_1.default(errorMessages_1.default.AUTH.NO_ACCOUND_FOUND, statusCode_1.default.NOT_FOUND);
                }
                return user;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prismaInit_1.default.user.findUnique({
                    omit: { password: true },
                    where: { user_id },
                    include: { role: true }
                });
                if (!user) {
                    throw new AppError_1.default(errorMessages_1.default.AUTH.NO_ACCOUND_FOUND, statusCode_1.default.NOT_FOUND);
                }
                return user;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password, role_id, contact_number, email, firstname, lastname } = user;
                const existingUser = yield prismaInit_1.default.user.findFirst({
                    where: {
                        OR: [{ email: email }, { username: username }]
                    }
                });
                if (existingUser) {
                    throw new AppError_1.default(errorMessages_1.default.AUTH.ALREADY_REGISTERED, statusCode_1.default.CONFLICT);
                }
                const hashedPassword = yield bcryptService_1.default.hashPassword(password);
                if (!hashedPassword) {
                    throw new AppError_1.default(errorMessages_1.default.SOMETHING_WRONG, statusCode_1.default.NOT_FOUND);
                }
                const newUser = yield prismaInit_1.default.user.create({
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
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateUser(user_id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield prismaInit_1.default.user.findUnique({ where: { user_id } });
                if (!existingUser) {
                    throw new AppError_1.default(errorMessages_1.default.AUTH.NO_ACCOUND_FOUND, statusCode_1.default.NOT_FOUND);
                }
                if (updates.password) {
                    updates.password = yield bcryptService_1.default.hashPassword(updates.password);
                }
                const updatedUser = yield prismaInit_1.default.user.update({
                    where: { user_id },
                    data: updates
                });
                if (existingUser.profile_image && updates.profile_image) {
                    yield TmpImageService_1.default.uploadImage(user_id, existingUser.profile_image);
                }
                return updatedUser;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = UserService;
