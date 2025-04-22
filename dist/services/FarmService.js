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
const prismaInit_1 = __importDefault(require("../lib/prismaInit"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const prismaErrorHandler_1 = __importDefault(require("../utils/prismaErrorHandler"));
const pagination_1 = require("../utils/pagination");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
class FarmService {
    getAllFarms(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, take, orderBy, where } = (0, pagination_1.paginateAndSort)(query);
                const [allFarms, totalRecords] = yield prismaInit_1.default.$transaction([
                    prismaInit_1.default.farms.findMany({
                        where,
                        orderBy,
                        skip,
                        take,
                        include: { customer: true, village: true }
                    }),
                    prismaInit_1.default.farms.count({ where })
                ]);
                return {
                    totalRecords,
                    data: allFarms
                };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getFarmById(farm_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const farm = yield prismaInit_1.default.farms.findUnique({
                    where: { farm_id },
                    include: { customer: true, village: true }
                });
                if (!farm) {
                    throw new AppError_1.default(errorMessages_1.default.RECORD_NOT_FOUND, statusCode_1.default.NOT_FOUND);
                }
                return farm;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    addFarm(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFarm = yield prismaInit_1.default.farms.create({
                    data
                });
                return newFarm;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    deleteFarm(farm_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedFarm = yield prismaInit_1.default.farms.delete({
                    where: { farm_id }
                });
                return deletedFarm;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateFarm(farm_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedFarm = yield prismaInit_1.default.farms.update({
                    where: { farm_id },
                    data
                });
                return updatedFarm;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = FarmService;
