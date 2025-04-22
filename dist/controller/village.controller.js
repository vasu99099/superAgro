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
const VillageService_1 = __importDefault(require("../services/VillageService"));
const getVillage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const villageSevice = new VillageService_1.default();
        const data = yield villageSevice.getVillages(req.query);
        return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'All Data fetched Successfully', data);
    }
    catch (e) {
        next(e);
    }
});
const villageController = {
    getVillage
};
exports.default = villageController;
