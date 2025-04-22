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
const CategoryService_1 = __importDefault(require("../services/CategoryService"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const validationSchema_1 = require("../validationSchema");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const category_validation_1 = require("../validationSchema/category.validation");
const getAllCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categotySevice = new CategoryService_1.default(req.user.id);
        if (req.query.search) {
            req.query.search = { name: req.query.search };
        }
        const { totalRecords, data } = yield categotySevice.getAllCategory(req.query);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Category'), {
            totalRecords,
            categories: data
        });
    }
    catch (e) {
        next(e);
    }
});
const AddCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(category_validation_1.CategorySchema, req.body, res);
        if (!isValid) {
            return;
        }
        const categotySevice = new CategoryService_1.default(req.user.id);
        const newCategory = yield categotySevice.addCategory(req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.CREATED_SUCCESS('Category'), newCategory);
    }
    catch (e) {
        next(e);
    }
});
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.category_id) {
            (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.ID_REQUIRED('Category'));
        }
        const categotySevice = new CategoryService_1.default(req.user.id);
        const deletedCategory = yield categotySevice.deleteCategory(req.body.category_id);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.DELETE_SUCCESS('Category'), deletedCategory);
    }
    catch (e) {
        next(e);
    }
});
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(category_validation_1.CategorySchema, req.body, res, { isEdit: true });
        if (!isValid) {
            return;
        }
        const categotySevice = new CategoryService_1.default(req.user.id);
        const updatedCategory = yield categotySevice.updateCategory(Number(req.body.category_id), req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.UPDATE_SUCCESS('Category'), updatedCategory);
    }
    catch (e) {
        next(e);
    }
});
const categoryController = {
    getAllCategory,
    AddCategory,
    deleteCategory,
    updateCategory
};
exports.default = categoryController;
