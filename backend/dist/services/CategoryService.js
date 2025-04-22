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
const pagination_1 = require("../utils/pagination");
const prismaErrorHandler_1 = __importDefault(require("../utils/prismaErrorHandler"));
class CategoryService {
    constructor(userId) {
        this.userId = userId;
    }
    getAllCategory(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, take, orderBy, where } = (0, pagination_1.paginateAndSort)(query, this.userId);
                let allCategories, totalRecords;
                if (!query.page) {
                    // No pagination – return all records
                    [allCategories, totalRecords] = yield prismaInit_1.default.$transaction([
                        prismaInit_1.default.category.findMany({ where, orderBy }),
                        prismaInit_1.default.category.count({ where })
                    ]);
                }
                else {
                    // Pagination applied
                    [allCategories, totalRecords] = yield prismaInit_1.default.$transaction([
                        prismaInit_1.default.category.findMany({ where, orderBy, skip, take }),
                        prismaInit_1.default.category.count({ where })
                    ]);
                }
                return {
                    totalRecords,
                    data: allCategories
                };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    addCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = category;
                const existingCategory = yield prismaInit_1.default.category.findUnique({
                    where: { name, user_id: this.userId }
                });
                if (existingCategory) {
                    throw new AppError_1.default(errorMessages_1.default.POST.POST_ALREADY_EXISTS, statusCode_1.default.CONFLICT);
                }
                const newCategory = yield prismaInit_1.default.category.create({
                    data: {
                        name,
                        description,
                        user_id: this.userId
                    }
                });
                return newCategory;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    deleteCategory(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedCategory = yield prismaInit_1.default.category.delete({
                    where: { category_id, user_id: this.userId }
                });
                return deletedCategory;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateCategory(category_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCategory = yield prismaInit_1.default.category.update({
                    where: { category_id, user_id: this.userId },
                    data: data
                });
                return updatedCategory;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = CategoryService;
