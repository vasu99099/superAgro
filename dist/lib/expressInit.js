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
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("../middleware/errorHandler"));
const routes_1 = __importDefault(require("../routes"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const expressInit = (server) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PORT = config_1.default.PORT || 5000;
        const corsOptions = {
            origin: config_1.default.ALLOW_ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
            optionsSuccessStatus: 200
        };
        server.use((0, cors_1.default)(corsOptions));
        server.use(express_1.default.json());
        server.use(routes_1.default);
        server.use(errorHandler_1.default);
        server.listen(PORT, () => console.log('server is running on Port: ' + PORT));
    }
    catch (e) {
        const error = e;
        console.log('(error)=>' + error.message);
    }
});
exports.default = expressInit;
