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
exports.productController = void 0;
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const validationSchema_1 = require("../validationSchema");
const product_validation_1 = require("../validationSchema/product.validation");
const ProductService_1 = __importDefault(require("../services/ProductService"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const S3Service_1 = require("../utils/S3Service");
const TmpImageService_1 = __importDefault(require("../services/TmpImageService"));
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
exports.productController = {
    create: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const isValid = (0, validationSchema_1.validateInput)(product_validation_1.productValidationSchema, req.body, res);
            if (!isValid) {
                return;
            }
            const productSevice = new ProductService_1.default();
            req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const newCustomer = yield productSevice.addProduct(req.body);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.CREATED_SUCCESS('Product'), newCustomer);
        }
        catch (e) {
            next(e);
        }
    }),
    getById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productSevice = new ProductService_1.default();
            const product = yield productSevice.getProductById(Number(req.query.product_id));
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Product'), product);
        }
        catch (e) {
            next(e);
        }
    }),
    getAllProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productSevice = new ProductService_1.default();
            if (req.query.product_id) {
                const id = parseInt(req.query.product_id, 10);
                if (isNaN(id)) {
                    return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.INVALID('Product Id'), null);
                }
                const product = yield productSevice.getProductById(id);
                return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Product Id'), product);
            }
            const searchQuery = req.query.search ? { name: String(req.query.search) } : undefined;
            const { totalRecords, data } = yield productSevice.getAllProducts(Object.assign(Object.assign({}, req.query), { search: searchQuery }));
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.FETCHED_SUCCESS('Product Id'), {
                totalRecords,
                products: data
            });
        }
        catch (e) {
            next(e);
        }
    }),
    updateProduct: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const productId = req.body.product_id;
            if (isNaN(productId)) {
                return (0, sendResponse_1.default)(res, false, statusCode_1.default.BAD_REQUEST, errorMessages_1.default.ID_REQUIRED('Product Id'), null);
            }
            const productSevice = new ProductService_1.default();
            const updated = yield productSevice.updateProduct(productId, req.body);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.UPDATE_SUCCESS('Product'), updated);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to update product' });
        }
    }),
    deleteProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productSevice = new ProductService_1.default();
            const deleted = yield productSevice.deleteProduct(Number(req.body.product_id));
            console.log('deleted', deleted);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.DELETE_SUCCESS('Product'), deleted);
        }
        catch (e) {
            next(e);
        }
    }),
    productPresigned: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            TmpImageService_1.default.uploadImage(userId, fileKeys);
            return (0, sendResponse_1.default)(res, true, statusCode_1.default.SUCCESS, errorMessages_1.default.CREATED_SUCCESS('Product Images'), presignedUrls);
        }
        catch (e) {
            next(e);
        }
    })
};
