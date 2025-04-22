"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = void 0;
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const validateInput = (schema, data, res, context) => {
    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true, context });
    if (!error) {
        return true;
    }
    const errors = error.details.reduce((acc, cur) => {
        acc[cur.path[0]] = cur.message;
        return acc;
    }, {});
    (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errors);
    return false;
};
exports.validateInput = validateInput;
