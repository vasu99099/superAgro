import Joi from 'joi';

// Joi schema for SuggestedPesticide
export const suggestedPesticide = Joi.object({
  suggested_id: Joi.number().integer().positive(),
  product_id: Joi.number().integer().positive().required(),
  note: Joi.string().allow(null, '')
});

export const dosageSchemaValidationSchema = Joi.object({
  dosage_id: Joi.number().integer().positive(),
  farm_id: Joi.number().integer().positive().required(),
  customer_id: Joi.number().integer().positive().required(),
  isClosed: Joi.boolean().default(false),
  suggestions: Joi.array().items(suggestedPesticide).min(1).required()
});
