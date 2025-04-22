"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, success, statusCode = 200, message, data = null, error = null) => {
    return res.status(statusCode).json({ success, message, data, error });
};
exports.default = sendResponse;
