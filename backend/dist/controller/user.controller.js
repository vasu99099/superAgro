"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.uploadProfilePic = void 0;
const UserService_1 = __importDefault(require("../services/UserService"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const user_validation_1 = __importStar(require("../validationSchema/user.validation"));
const validationSchema_1 = require("../validationSchema");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const bcryptService_1 = __importDefault(require("../utils/bcryptService"));
const S3Service_1 = require("../utils/S3Service");
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isValid = (0, validationSchema_1.validateInput)(user_validation_1.loginSchema, req.body, res);
        if (!isValid) {
            return;
        }
        const userService = new UserService_1.default();
        const _a = yield userService.getUserByEmail(email), { password: userPassword } = _a, safeUser = __rest(_a, ["password"]);
        const isMatch = yield bcryptService_1.default.comparePassword(password, userPassword);
        const token = jwtService_1.default.generateToken({ id: safeUser.user_id, email: safeUser.email });
        if (isMatch) {
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.AUTH.SUCCESS_LOGIN, {
                user: safeUser,
                token
            });
        }
        else {
            return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.AUTH.INVALID_EMAIL_PASSWORD);
        }
    }
    catch (e) {
        next(e);
    }
});
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(user_validation_1.registerUserSchema, req.body, res);
        if (!isValid) {
            return;
        }
        const userService = new UserService_1.default();
        const _a = yield userService.registerUser(req.body), { password } = _a, userData = __rest(_a, ["password"]);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.CREATED, errorMessages_1.default.AUTH.REGISTER_SUCCESS, userData);
    }
    catch (e) {
        next(e);
    }
});
const getUserDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new AppError_1.default(errorMessages_1.default.AUTH.USER_NOT_FOUND, statusCode_1.default.UNAUTHORIZED);
        }
        const userService = new UserService_1.default();
        const user = yield userService.getUserById(userId);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.AUTH.SUCCESS_LOGIN, user);
    }
    catch (e) {
        next(e);
    }
});
const uploadProfilePic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.USER.NO_FILE_FOUND);
        }
        const isValid = (0, validationSchema_1.validateInput)(user_validation_1.default, { profile_image: req.file }, res);
        if (!isValid) {
            return;
        }
        if (!req.user || !req.user.id) {
            return (0, sendResponse_1.default)(res, false, statusCode_1.default.UNAUTHORIZED, errorMessages_1.default.UNAUTHENTIC_USER);
        }
        const { fileName } = yield (0, S3Service_1.uploadFileToS3)(req.file, 'profil_images');
        const userService = new UserService_1.default();
        yield userService.updateUser(req.user.id, {
            profile_image: fileName
        });
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.CREATED, errorMessages_1.default.USER.PROFILE_PIC_UPLOAD_SUCCESS);
    }
    catch (error) {
        next(error);
    }
});
exports.uploadProfilePic = uploadProfilePic;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const isValid = (0, validationSchema_1.validateInput)(user_validation_1.updateUserSchema, req.body, res);
        if (!isValid) {
            return;
        }
        const userService = new UserService_1.default();
        yield userService.updateUser(userId, req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.USER.PROFILE_UPDATED_SUCCESS);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
const userController = { login, register, uploadProfilePic: exports.uploadProfilePic, getUserDetail, updateProfile: exports.updateProfile };
exports.default = userController;
