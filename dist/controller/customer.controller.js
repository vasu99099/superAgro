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
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const validationSchema_1 = require("../validationSchema");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const customer_validation_1 = require("../validationSchema/customer.validation");
const CustomerService_1 = __importDefault(require("../services/CustomerService"));
const getAllCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerService = new CustomerService_1.default(req.user.id);
        // Construct search object safely
        const searchQuery = req.query.search ? { name: String(req.query.search) } : undefined;
        // Handle fetching a single customer by ID
        if (req.query.customer_id) {
            const id = parseInt(req.query.customer_id, 10);
            if (isNaN(id)) {
                return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.INVALID('Customer ID'));
            }
            const customer = yield customerService.getCustomerById(id);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Customer'), customer);
        }
        const { totalRecords, data } = yield customerService.getAllCustomer(Object.assign(Object.assign({}, req.query), { search: searchQuery }));
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Customer'), {
            totalRecords,
            customers: data
        });
    }
    catch (error) {
        next(error);
    }
});
const AddCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(customer_validation_1.CustomerSchema, req.body, res);
        if (!isValid) {
            return;
        }
        const customerSevice = new CustomerService_1.default(req.user.id);
        const newCustomer = yield customerSevice.addCustomer(req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.CREATED_SUCCESS('Customer'), newCustomer);
    }
    catch (e) {
        next(e);
    }
});
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.customer_id) {
            (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.ID_REQUIRED('Customer'));
        }
        const customerSevice = new CustomerService_1.default(req.user.id);
        const deletedCategory = yield customerSevice.deleteCustomer(Number(req.body.customer_id));
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.DELETE_SUCCESS('Customer'), deletedCategory);
    }
    catch (e) {
        next(e);
    }
});
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(customer_validation_1.CustomerSchema, req.body, res, { isEdit: true });
        if (!isValid) {
            return;
        }
        const customerSevice = new CustomerService_1.default(req.user.id);
        const updatedCustomer = yield customerSevice.updateCustomer(req.body.customer_id, req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.UPDATE_SUCCESS('Customer'), updatedCustomer);
    }
    catch (e) {
        next(e);
    }
});
const customerController = {
    getAllCustomer,
    AddCustomer,
    deleteCustomer,
    updateCustomer
};
exports.default = customerController;
