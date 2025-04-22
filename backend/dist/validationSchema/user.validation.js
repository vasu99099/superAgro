"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.registerUserSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .trim()
        .min(8)
        .max(20)
        .pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must be at most 20 characters',
        'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number',
        'any.required': 'Password is required'
    })
});
exports.registerUserSchema = joi_1.default.object({
    username: joi_1.default.string().trim().min(3).max(30).required().messages({
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username must be at most 30 characters',
        'any.required': 'Username is required'
    }),
    email: joi_1.default.string().trim().lowercase().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .trim()
        .min(8)
        .max(20)
        .pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must be at most 20 characters',
        'string.pattern.base': 'Password must contain at least 1 uppercase letter and 1 number',
        'any.required': 'Password is required'
    }),
    role_id: joi_1.default.number().integer().required().messages({
        'any.required': 'Role ID is required'
    }),
    contact_number: joi_1.default.string()
        .trim()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
        'string.pattern.base': 'Contact number must be between 10-15 digits',
        'any.required': 'Contact number is required'
    }),
    firstname: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must be at most 50 characters',
        'any.required': 'First name is required'
    }),
    lastname: joi_1.default.string().trim().min(2).max(50).required().messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must be at most 50 characters',
        'any.required': 'Last name is required'
    })
});
exports.updateUserSchema = exports.registerUserSchema.fork(Object.keys(exports.registerUserSchema.describe().keys), (schema) => schema.optional());
const fileValidationSchema = joi_1.default.object({
    profile_image: joi_1.default.object({
        originalname: joi_1.default.string().required().messages({
            'any.required': 'File name is required.'
        }),
        mimetype: joi_1.default.string().valid('image/jpeg', 'image/png').required().messages({
            'any.only': 'Only JPG, PNG images are allowed.',
            'any.required': 'File is required.'
        }),
        size: joi_1.default.number()
            .max(2 * 1024 * 1024)
            .required()
            .messages({
            'number.max': 'File size must be less than 2MB.',
            'any.required': 'File size is required.'
        }) // Max size: 2MB
    })
        .required()
        .messages({
        'any.required': 'Profile image is required.'
    })
});
exports.default = fileValidationSchema;
