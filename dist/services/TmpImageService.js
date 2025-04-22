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
const client_1 = require("@prisma/client");
const prismaInit_1 = __importDefault(require("../lib/prismaInit"));
class TmpImageService {
    uploadImage(user_id, imageKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(imageKey)) {
                const data = imageKey.map((key) => ({
                    user_id,
                    image_key: key,
                    status: client_1.ImageStatus.PENDING
                }));
                yield prismaInit_1.default.tempImage.createMany({
                    data,
                    skipDuplicates: true
                });
                return data;
            }
            return yield prismaInit_1.default.tempImage.create({
                data: {
                    user_id,
                    image_key: imageKey,
                    status: client_1.ImageStatus.PENDING
                }
            });
        });
    }
    // ✅ Confirm Image (When Profile is Updated)
    confirmImage(imageKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaInit_1.default.tempImage.updateMany({
                where: {
                    image_key: Array.isArray(imageKey)
                        ? { in: imageKey } // for multiple keys
                        : imageKey // for single key
                },
                data: {
                    status: client_1.ImageStatus.CONFIRMED
                }
            });
        });
    }
    deletedImage(imageKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(imageKey)) {
                const data = imageKey.map((key) => ({
                    image_key: key,
                    status: client_1.ImageStatus.DELETED
                }));
                yield prismaInit_1.default.tempImage.createMany({
                    data,
                    skipDuplicates: true
                });
                return data;
            }
            return yield prismaInit_1.default.tempImage.create({
                data: {
                    image_key: imageKey,
                    status: client_1.ImageStatus.DELETED
                }
            });
        });
    }
    // ✅ Get PENDING Images (For Cron Cleanup)
    getPendingImages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaInit_1.default.tempImage.findMany({
                where: { status: client_1.ImageStatus.PENDING }
            });
        });
    }
}
exports.default = new TmpImageService();
