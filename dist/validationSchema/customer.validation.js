"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CustomerSchema = joi_1.default.object({
    customer_id: joi_1.default.number()
        .strict()
        .when('$isEdit', { is: true, then: joi_1.default.required(), otherwise: joi_1.default.forbidden() })
        .messages({
        'any.required': 'Customer ID is required for editing'
    }),
    name: joi_1.default.string().max(255).required().messages({
        'string.base': 'Name must be a string',
        'string.max': 'Name must not exceed 255 characters',
        'any.required': 'Name is required'
    }),
    address: joi_1.default.string().allow('').max(1000).optional().messages({
        'string.max': 'Address must not exceed 1000 characters'
    }),
    village_id: joi_1.default.number().integer().strict().required().messages({
        'number.base': 'Invalid Village ID',
        'any.required': 'Village is required'
    }),
    longitude: joi_1.default.number().precision(7).allow(null).optional().messages({
        'number.base': 'Longitude must be a decimal number'
    }),
    latitude: joi_1.default.number().precision(7).allow(null).optional().messages({
        'number.base': 'Latitude must be a decimal number'
    }),
    phone: joi_1.default.string()
        .pattern(/^\d{10,20}$/)
        .required()
        .messages({
        'string.pattern.base': 'Phone number must be between 10 and 20 digits',
        'any.required': 'Phone number is required'
    }),
    whatsapp_number: joi_1.default.string()
        .pattern(/^\d{10,20}$/)
        .allow(null, '')
        .optional()
        .messages({
        'string.pattern.base': 'WhatsApp number must be between 10 and 20 digits'
    }),
    email: joi_1.default.string().email().allow(null, '').optional().messages({
        'string.email': 'Invalid email format'
    })
});
