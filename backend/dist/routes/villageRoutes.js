"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("../constants/routes");
const customer_controller_1 = __importDefault(require("../controller/customer.controller"));
const village_controller_1 = __importDefault(require("../controller/village.controller"));
const villageRoutes = (0, express_1.Router)();
villageRoutes.get(routes_1.ROUTES.VILLAGE.GET_VILLAGE, village_controller_1.default.getVillage);
villageRoutes.post(routes_1.ROUTES.CUSTOMER.ADD_CUSTOMER, customer_controller_1.default.AddCustomer);
villageRoutes.put(routes_1.ROUTES.CUSTOMER.UPDATECUSTOMER, customer_controller_1.default.updateCustomer);
villageRoutes.delete(routes_1.ROUTES.CUSTOMER.DELETECUSTOMER, customer_controller_1.default.deleteCustomer);
exports.default = villageRoutes;
