"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controller/category.controller"));
const routes_1 = require("../constants/routes");
const categoryRoutes = (0, express_1.Router)();
categoryRoutes.get(routes_1.ROUTES.CATEGORY.GETALLCATEGORY, category_controller_1.default.getAllCategory);
categoryRoutes.post(routes_1.ROUTES.CATEGORY.ADDCATEGORY, category_controller_1.default.AddCategory);
categoryRoutes.delete(routes_1.ROUTES.CATEGORY.DELETECATEGORY, category_controller_1.default.deleteCategory);
categoryRoutes.put(routes_1.ROUTES.CATEGORY.UPDATECATEGORY, category_controller_1.default.updateCategory);
exports.default = categoryRoutes;
