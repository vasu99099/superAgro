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
exports.cacheSetData = exports.getCachedData = exports.cacheData = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
    host: 'localhost',
    port: 6379
});
// Check if Redis is connected
redis.on('connect', () => {
    console.log('Connected to Redis');
});
redis.on('error', (err) => {
    console.error('Redis Error:', err);
});
const cacheData = (key_1, data_1, ...args_1) => __awaiter(void 0, [key_1, data_1, ...args_1], void 0, function* (key, data, expiry = 3600) {
    yield redis.set(key, JSON.stringify(data), 'EX', expiry);
});
exports.cacheData = cacheData;
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield redis.get(key);
    return data ? JSON.parse(data) : null;
});
exports.getCachedData = getCachedData;
const cacheSetData = (key_1, data_1, ...args_1) => __awaiter(void 0, [key_1, data_1, ...args_1], void 0, function* (key, data, expiry = 3600) {
    yield redis.set(key, JSON.stringify(data), 'EX', expiry);
});
exports.cacheSetData = cacheSetData;
exports.default = redis;
