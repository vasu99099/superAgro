"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Determine the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, `../../${envFile}`) });
const origins = (_c = (_b = ((_a = process.env.ALLOW_ORIGIN) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.split(',')) !== null && _c !== void 0 ? _c : [];
exports.default = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || '',
    ALLOW_ORIGIN: origins,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || ''
};
