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
exports.PackingUnit = void 0;
const prismaInit_1 = __importDefault(require("../lib/prismaInit"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const statusCode_1 = __importDefault(require("../constants/statusCode"));
const prismaErrorHandler_1 = __importDefault(require("../utils/prismaErrorHandler"));
const pagination_1 = require("../utils/pagination");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
const TmpImageService_1 = __importDefault(require("./TmpImageService"));
var PackingUnit;
(function (PackingUnit) {
    PackingUnit["MG"] = "mg";
    PackingUnit["G"] = "g";
    PackingUnit["KG"] = "kg";
    PackingUnit["ML"] = "ml";
    PackingUnit["L"] = "l";
})(PackingUnit || (exports.PackingUnit = PackingUnit = {}));
class ProductService {
    getAllProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { skip, take, orderBy, where } = (0, pagination_1.paginateAndSort)(query);
                const [allProducts, totalRecords] = yield prismaInit_1.default.$transaction([
                    prismaInit_1.default.product.findMany({
                        where,
                        orderBy,
                        skip,
                        take,
                        include: {
                            category: true,
                            ProductImage: true,
                            ProductPackaging: { select: { packSize: true, packagingType: true } }
                        }
                    }),
                    prismaInit_1.default.product.count({ where })
                ]);
                return {
                    totalRecords,
                    data: allProducts
                };
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    getProductById(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield prismaInit_1.default.product.findUnique({
                    where: { product_id },
                    include: {
                        category: true,
                        ProductImage: true,
                        ProductPackaging: { select: { packSize: true, packagingType: true } }
                    }
                });
                if (!product) {
                    throw new AppError_1.default('Product not found', statusCode_1.default.NOT_FOUND);
                }
                return product;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    addProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { userId, ProductImage: images, ProductPackaging: productPacks } = productData, productInfo = __rest(productData, ["userId", "ProductImage", "ProductPackaging"]);
                const existingProduct = yield prismaInit_1.default.product.findFirst({
                    where: { name: productInfo.name, userId }
                });
                if (existingProduct) {
                    throw new AppError_1.default(errorMessages_1.default.PRODUCT.PRODUCT_ALREADY_EXISTS, statusCode_1.default.CONFLICT);
                }
                const newProduct = yield prismaInit_1.default.product.create({
                    data: Object.assign(Object.assign({}, productInfo), { userId, ProductPackaging: {
                            create: (productPacks === null || productPacks === void 0 ? void 0 : productPacks.map((pack) => ({
                                packSize: Number(pack.packSize),
                                packagingType: pack.packagingType
                            }))) || []
                        }, ProductImage: {
                            create: (images === null || images === void 0 ? void 0 : images.map((img) => {
                                var _a;
                                return ({
                                    url: img.url,
                                    altText: img.altText || '',
                                    isPrimary: (_a = img.isPrimary) !== null && _a !== void 0 ? _a : false
                                });
                            })) || []
                        } }),
                    include: {
                        ProductImage: true,
                        user: true,
                        category: true
                    }
                });
                TmpImageService_1.default.confirmImage((_a = images === null || images === void 0 ? void 0 : images.map((i) => i.url)) !== null && _a !== void 0 ? _a : []);
                return newProduct;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    updateProduct(productId, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { ProductImage: images, userId, ProductPackaging: productPacks } = productData, productInfo = __rest(productData, ["ProductImage", "userId", "ProductPackaging"]);
                const existingProduct = yield prismaInit_1.default.product.findUnique({
                    where: { product_id: productId },
                    include: { ProductImage: true, ProductPackaging: true }
                });
                if (!existingProduct) {
                    throw new AppError_1.default('Product not found', statusCode_1.default.NOT_FOUND);
                }
                // Optional: check for duplicate name in same user's products
                const duplicateProduct = yield prismaInit_1.default.product.findFirst({
                    where: {
                        name: productInfo.name,
                        userId,
                        NOT: { product_id: productId }
                    }
                });
                if (duplicateProduct) {
                    throw new AppError_1.default(errorMessages_1.default.PRODUCT.PRODUCT_ALREADY_EXISTS, statusCode_1.default.CONFLICT);
                }
                // Delete existing related images and packaging
                const existingImages = yield prismaInit_1.default.productImage.findMany({ where: { productId } });
                const updatedImageUrls = (_a = images === null || images === void 0 ? void 0 : images.map((i) => i.url)) !== null && _a !== void 0 ? _a : [];
                const deletedImages = existingImages.filter((img) => !updatedImageUrls.includes(img.url));
                TmpImageService_1.default.deletedImage(deletedImages.map((di) => di.url));
                yield prismaInit_1.default.productImage.deleteMany({ where: { productId } });
                yield prismaInit_1.default.productPackaging.deleteMany({ where: { productId } });
                // Update product and re-add relations
                const updatedProduct = yield prismaInit_1.default.product.update({
                    where: { product_id: productId },
                    data: Object.assign(Object.assign({}, productInfo), { userId, ProductImage: {
                            create: (images === null || images === void 0 ? void 0 : images.map((img) => {
                                var _a;
                                return ({
                                    url: img.url,
                                    altText: img.altText || '',
                                    isPrimary: (_a = img.isPrimary) !== null && _a !== void 0 ? _a : false
                                });
                            })) || []
                        }, ProductPackaging: {
                            create: (productPacks === null || productPacks === void 0 ? void 0 : productPacks.map((pack) => ({
                                packSize: Number(pack.packSize),
                                packagingType: pack.packagingType
                            }))) || []
                        } }),
                    include: {
                        ProductImage: true,
                        user: true,
                        category: true
                    }
                });
                TmpImageService_1.default.confirmImage((_b = images === null || images === void 0 ? void 0 : images.map((i) => i.url)) !== null && _b !== void 0 ? _b : []);
                return updatedProduct;
            }
            catch (error) {
                console.log('updateProduct error:', error);
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
    deleteProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield prismaInit_1.default.product.delete({
                    where: { product_id },
                    include: { ProductImage: true }
                });
                if (deleted.ProductImage.length) {
                    const images = deleted.ProductImage.map((p) => p.url);
                    TmpImageService_1.default.deletedImage(images);
                }
                return deleted;
            }
            catch (error) {
                throw (0, prismaErrorHandler_1.default)(error);
            }
        });
    }
}
exports.default = ProductService;
