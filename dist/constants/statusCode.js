"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes.js
const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    PERMENENT_REDIRECTION: 301,
    TEM_REDIRECTION: 302,
    CONFLICT: 409
};
exports.default = STATUS_CODES;
