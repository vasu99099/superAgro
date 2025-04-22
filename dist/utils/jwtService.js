"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';
const JWT_EXPIRATION = '3h';
const jwtService = {
    generateToken: (user) => {
        const payload = {
            id: user.id,
            email: user.email
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        return token;
    },
    verifyToken: (token) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const { iat, exp } = decoded, cleanedDecoded = __rest(decoded, ["iat", "exp"]);
            return cleanedDecoded;
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
};
exports.default = jwtService;
