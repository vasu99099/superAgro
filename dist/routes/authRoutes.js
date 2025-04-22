"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("../constants/routes");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const authRoutes = (0, express_1.Router)();
authRoutes.post(routes_1.ROUTES.AUTH.LOGIN, user_controller_1.default.login);
authRoutes.post(routes_1.ROUTES.AUTH.REGISTER, user_controller_1.default.register);
exports.default = authRoutes;
