"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dosageSchemaValidationSchema = exports.suggestedPesticide = void 0;
const joi_1 = __importDefault(require("joi"));
// Joi schema for SuggestedPesticide
exports.suggestedPesticide = joi_1.default.object({
    suggested_id: joi_1.default.number().integer().positive(),
    product_id: joi_1.default.number().integer().positive().required(),
    note: joi_1.default.string().allow(null, '')
});
exports.dosageSchemaValidationSchema = joi_1.default.object({
    dosage_id: joi_1.default.number().integer().positive(),
    farm_id: joi_1.default.number().integer().positive().required(),
    customer_id: joi_1.default.number().integer().positive().required(),
    isClosed: joi_1.default.boolean().default(false),
    suggestions: joi_1.default.array().items(exports.suggestedPesticide).min(1).required()
});
