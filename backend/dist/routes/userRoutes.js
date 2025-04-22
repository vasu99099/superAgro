"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const routes_1 = require("../constants/routes");
const userRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const uploadMiddleware = upload.single('profilePic');
userRoutes.post(routes_1.ROUTES.USER.UPLOAD_PROFILE_PIC, uploadMiddleware, user_controller_1.default.uploadProfilePic);
userRoutes.get(routes_1.ROUTES.USER.WHO_M_I, user_controller_1.default.getUserDetail);
userRoutes.put(routes_1.ROUTES.USER.UPDATE_PROFILE, user_controller_1.default.updateProfile);
exports.default = userRoutes;
