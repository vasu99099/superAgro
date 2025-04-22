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
exports.dosageController = void 0;
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const validationSchema_1 = require("../validationSchema");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const S3Service_1 = require("../utils/S3Service");
const TmpImageService_1 = __importDefault(require("../services/TmpImageService"));
const suggestedPesticide_validation_1 = require("../validationSchema/suggestedPesticide.validation");
const SuggestedPesticideService_1 = __importDefault(require("../services/SuggestedPesticideService"));
exports.dosageController = {
    create: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isValid = (0, validationSchema_1.validateInput)(suggestedPesticide_validation_1.dosageSchemaValidationSchema, req.body, res);
            if (!isValid) {
                return;
            }
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const dosage = yield suggestedPesticideSevice.addDosage(req.body);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Dosage created Successfully', dosage);
        }
        catch (e) {
            next(e);
        }
    }),
    getDosage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { farm_id } = req.params;
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const dosage = yield suggestedPesticideSevice.getDosageByFarmId(Number(farm_id));
            if (!dosage)
                return res.status(404).json({ message: 'Suggestion not found' });
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Suggestion get Successfully', dosage);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching suggestion' });
        }
    }),
    getDosageBYId: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dosage_id } = req.params;
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const dosage = yield suggestedPesticideSevice.getDosageByDosageId(Number(dosage_id));
            if (!dosage)
                return res.status(404).json({ message: 'Suggestion not found' });
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Suggestion get Successfully', dosage);
        }
        catch (error) {
            next(error);
        }
    }),
    markDosageAsPurchased: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dosage_id } = req.params;
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const dosage = yield suggestedPesticideSevice.markDosageAsPurchased(Number(dosage_id));
            if (!dosage)
                return res.status(404).json({ message: 'Dosage not found' });
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Saved As Purchased', dosage);
        }
        catch (error) {
            res.status(500).json({ message: 'Error to mark as purchased' });
        }
    }),
    updateDosage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const dosageId = Number(req.body.dosage_id);
            if (isNaN(dosageId)) {
                return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, 'Invalid Suggestion ID', null);
            }
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const updated = yield suggestedPesticideSevice.updateDosage(dosageId, req.body);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Suggestion Updated Successfully', updated);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to update Suggestion' });
        }
    }),
    deleteDosage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('"in"', req.body.dosage_id);
            const suggestedPesticideSevice = new SuggestedPesticideService_1.default();
            const deleted = yield suggestedPesticideSevice.deleteDosage(Number(req.body.dosage_id));
            console.log('deleted', deleted);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Product Deleted Successfully', deleted);
        }
        catch (error) {
            console.log('error', error);
            res.status(500).json({ message: 'Failed to delete product' });
        }
    }),
    productPresigned: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const imagesData = req.body.images;
            const product = 'Product';
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const presignedUrls = yield Promise.all(imagesData.map((productImage) => __awaiter(void 0, void 0, void 0, function* () {
                const { uploadUrl, fileKey } = yield (0, S3Service_1.getUploadSignedUrl)(productImage.fileType, productImage.size, product);
                return { uploadUrl, fileKey, fileName: productImage.fileName };
            })));
            const fileKeys = presignedUrls.map((item) => item.fileKey);
            const image = TmpImageService_1.default.uploadImage(userId, fileKeys);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, 'Product Images Added Successfully', presignedUrls);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching products images' });
        }
    })
};
