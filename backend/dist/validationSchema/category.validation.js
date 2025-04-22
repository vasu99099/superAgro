"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CategorySchema = joi_1.default.object({
    category_id: joi_1.default.number()
        .strict()
        .when('$isEdit', { is: true, then: joi_1.default.number().required() }) // Required only when editing
        .messages({
        'any.required': 'Category ID is required for editing'
    }),
    name: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 50 characters',
        'any.required': 'Name is required'
    }),
    description: joi_1.default.string().trim().allow('').max(500).optional().messages({
        'string.max': 'Description must be at most 500 characters'
    })
});
