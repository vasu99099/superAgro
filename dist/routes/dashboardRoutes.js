"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controller/dashboard.controller"));
const routes_1 = require("../constants/routes");
const dashboardRoutes = (0, express_1.Router)();
dashboardRoutes.get(routes_1.ROUTES.BASE, dashboard_controller_1.default.getDashboardData);
exports.default = dashboardRoutes;
