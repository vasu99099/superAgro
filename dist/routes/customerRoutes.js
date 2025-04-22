"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = require("../constants/routes");
const customer_controller_1 = __importDefault(require("../controller/customer.controller"));
const customerRoutes = (0, express_1.Router)();
customerRoutes.get(routes_1.ROUTES.CUSTOMER.GETALLCUSTOMER, customer_controller_1.default.getAllCustomer);
customerRoutes.post(routes_1.ROUTES.CUSTOMER.ADD_CUSTOMER, customer_controller_1.default.AddCustomer);
customerRoutes.put(routes_1.ROUTES.CUSTOMER.UPDATECUSTOMER, customer_controller_1.default.updateCustomer);
customerRoutes.delete(routes_1.ROUTES.CUSTOMER.DELETECUSTOMER, customer_controller_1.default.deleteCustomer);
exports.default = customerRoutes;
