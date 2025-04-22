"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("../constants/routes");
const farm_controller_1 = __importDefault(require("../controller/farm.controller"));
const farmRoutes = (0, express_1.Router)();
farmRoutes.get(routes_1.ROUTES.FARM.GETALL_FARM, farm_controller_1.default.getAllFarms);
farmRoutes.post(routes_1.ROUTES.FARM.ADD_FARM, farm_controller_1.default.addFarm);
farmRoutes.put(routes_1.ROUTES.FARM.UPDATE_FARM, farm_controller_1.default.updateFarm);
farmRoutes.delete(routes_1.ROUTES.FARM.DELETE_FARM, farm_controller_1.default.deleteFarm);
exports.default = farmRoutes;
