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
class CustomerService {
    constructor(userId) {
        this.userId = userId;
    }
    getAllCustomer(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, take, orderBy, where } = (0, pagination_1.paginateAndSort)(query, this.userId);
                const [allCustomers, totalRecords] = yield prismaInit_1.default.$transaction([
                    prismaInit_1.default.customer.findMany({
                        where,
                        orderBy,
                        skip,
                        take,
                        include: { village: true, farms: { include: { village: { select: { name: true } } } } }
                    }),
                    prismaInit_1.default.customer.count({ where })
                ]);
                const formattedCustomers = allCustomers.map((customer) => (Object.assign(Object.assign({}, customer), { farms: customer.farms.map((farm) => {
                        var _a;
                        return (Object.assign(Object.assign({}, farm), { village_name: (_a = farm.village) === null || _a === void 0 ? void 0 : _a.name }));
                    }) })));
                return {
                    totalRecords,
                    data: formattedCustomers
                };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getCustomerById(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield prismaInit_1.default.customer.findUnique({
                    where: { customer_id, user_id: this.userId },
                    include: { village: true, farms: { include: { village: { select: { name: true } } } } }
                });
                const formattedCustomers = Object.assign(Object.assign({}, customer), { farms: customer === null || customer === void 0 ? void 0 : customer.farms.map((farm) => {
                        var _a;
                        return (Object.assign(Object.assign({}, farm), { village_name: (_a = farm.village) === null || _a === void 0 ? void 0 : _a.name }));
                    }) });
                return formattedCustomers;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getCustomerCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const now = new Date();
                const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                const totalCustomers = yield prismaInit_1.default.customer.count({ where: { user_id: this.userId } });
                const monthNewCustomers = yield prismaInit_1.default.customer.count({
                    where: {
                        user_id: this.userId,
                        created_at: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                });
                return { totalCustomers, monthNewCustomers };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    addCustomer(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone } = customer;
                const existingCustomer = yield prismaInit_1.default.customer.findUnique({
                    where: { phone, user_id: this.userId }
                });
                if (existingCustomer) {
                    throw new AppError_1.default(errorMessages_1.default.CUSTOMER.CUSTOMER_ALREADY_EXISTS, statusCode_1.default.CONFLICT);
                }
                const newCustomer = yield prismaInit_1.default.customer.create({
                    data: Object.assign(Object.assign({}, customer), { user_id: this.userId })
                });
                return newCustomer;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    deleteCustomer(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedCustomer = yield prismaInit_1.default.customer.delete({
                    where: { customer_id, user_id: this.userId }
                });
                return deletedCustomer;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateCustomer(customer_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield prismaInit_1.default.customer.findFirst({
                    where: {
                        phone: data.phone,
                        user_id: this.userId,
                        NOT: { customer_id }
                    }
                });
                if (existing) {
                    throw new AppError_1.default(errorMessages_1.default.CUSTOMER.CUSTOMER_ALREADY_EXISTS, statusCode_1.default.CONFLICT);
                }
                const updatedCustomer = yield prismaInit_1.default.customer.update({
                    where: { customer_id, user_id: this.userId },
                    data: data
                });
                return updatedCustomer;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = CustomerService;
