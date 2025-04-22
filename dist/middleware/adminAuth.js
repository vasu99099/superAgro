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
const jwtService_1 = __importDefault(require("../utils/jwtService"));
const adminAuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract token from cookies or Authorization header
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const decodedToken = jwtService_1.default.verifyToken(token);
        // Verify Token
        req.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
});
exports.default = adminAuthUser;
