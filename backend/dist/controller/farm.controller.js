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
const FarmService_1 = __importDefault(require("../services/FarmService"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const validationSchema_1 = require("../validationSchema");
const farm_validation_1 = require("../validationSchema/farm.validation");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const getAllFarms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const farmService = new FarmService_1.default();
        const searchQuery = req.query.search ? { farm_name: String(req.query.search) } : undefined;
        if (req.query.farm_id) {
            const id = parseInt(req.query.farm_id, 10);
            if (isNaN(id)) {
                return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.INVALID('Farm Id'), null);
            }
            const farm = yield farmService.getFarmById(id);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Farm'), farm);
        }
        const { totalRecords, data } = yield farmService.getAllFarms(Object.assign(Object.assign({}, req.query), { search: searchQuery }));
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Farm'), {
            totalRecords,
            farms: data
        });
    }
    catch (error) {
        next(error);
    }
});
const addFarm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(farm_validation_1.FarmSchema, req.body, res);
        if (!isValid) {
            return;
        }
        const farmService = new FarmService_1.default();
        const newFarm = yield farmService.addFarm(req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.CREATED_SUCCESS('Farm'), newFarm);
    }
    catch (e) {
        next(e);
    }
});
const deleteFarm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.farm_id) {
            return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.ID_REQUIRED('Farm'));
        }
        const farmService = new FarmService_1.default();
        const deletedFarm = yield farmService.deleteFarm(req.body.farm_id);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.DELETE_SUCCESS('Farm'), deletedFarm);
    }
    catch (e) {
        next(e);
    }
});
const updateFarm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isValid = (0, validationSchema_1.validateInput)(farm_validation_1.FarmSchema, req.body, res, { isEdit: true });
        if (!isValid) {
            return;
        }
        const farmService = new FarmService_1.default();
        const updatedFarm = yield farmService.updateFarm(req.body.farm_id, req.body);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.UPDATE_SUCCESS('Farm'), updatedFarm);
    }
    catch (e) {
        next(e);
    }
});
const farmController = {
    getAllFarms,
    addFarm,
    deleteFarm,
    updateFarm
};
exports.default = farmController;
