"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.productValidationSchema = joi_1.default.object({
    name: joi_1.default.string().max(255).required().messages({
        'string.base': 'Name must be a string',
        'string.max': 'Name must not exceed 255 characters',
        'any.required': 'Name is required'
    }),
    hsc_code: joi_1.default.string().trim().max(50).optional().allow(null, '').messages({
        'string.base': 'HSC Code must be a string',
        'string.max': 'HSC Code must not exceed 255 characters'
    }),
    content_technical: joi_1.default.string().trim().optional().allow(null, '').messages({
        'string.base': 'Techincal Content must be a string'
    }),
    categoryId: joi_1.default.number().strict().integer().required().messages({
        'number.base': 'Invalid Category ID',
        'any.required': 'Category is required'
    }),
    images: joi_1.default.array()
        .items(joi_1.default.object({
        url: joi_1.default.string().min(2).required(),
        altText: joi_1.default.string().max(255).optional().allow('', null),
        isPrimary: joi_1.default.boolean().optional()
    }))
        .optional()
});
