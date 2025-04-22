"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const errorHandler = (err, req, res, next) => {
    let { statusCode, message, isOperational } = err;
    // Set default values for unexpected errors
    if (!statusCode)
        statusCode = statusCode_1.default.INTERNAL_SERVER_ERROR;
    if (!message)
        message = errorMessages_1.default.INTERNAL_ERROR;
    // if (!isOperational) {
    //   console.error('🔴 CRITICAL ERROR! RESTART REQUIRED!');
    //   process.exit(1); // Exit process in case of critical (programming) errors
    // }
    (0, sendResponse_1.default)(res, false, statusCode, message, process.env.NODE_ENV === 'dev' ? err.stack : undefined);
    return;
};
exports.default = errorHandler;
