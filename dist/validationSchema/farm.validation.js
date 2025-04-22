"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.FarmSchema = joi_1.default.object({
    farm_id: joi_1.default.number()
        .strict()
        .when('$isEdit', { is: true, then: joi_1.default.required(), otherwise: joi_1.default.forbidden() })
        .messages({
        'any.required': 'Farm ID is required for update'
    }),
    farm_name: joi_1.default.string().min(2).max(255).required().messages({
        'string.base': 'Farm name must be a string',
        'string.max': 'Farm name must not exceed 255 characters',
        'any.required': 'Farm name is required'
    }),
    customer_id: joi_1.default.number().integer().positive().required().messages({
        'any.required': 'Customer is required '
    }),
    village_id: joi_1.default.number().integer().required().messages({
        'number.base': 'Invalid Village',
        'any.required': 'Village is required'
    }),
    longitude: joi_1.default.number().precision(7).allow(null).optional().messages({
        'number.base': 'Longitude must be a decimal number'
    }),
    latitude: joi_1.default.number().precision(7).allow(null).optional().messages({
        'number.base': 'Latitude must be a decimal number'
    })
});
