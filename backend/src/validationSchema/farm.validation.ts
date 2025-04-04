import Joi from 'joi';

export const FarmSchema = Joi.object({
  farm_id: Joi.number().when('$isEdit', { is: true, then: Joi.required() }).messages({
    'any.required': 'Farm ID is required for update'
  }),
  farm_name: Joi.string().min(2).max(255).required().messages({
    'string.base': 'Farm name must be a string',
    'string.max': 'Farm name must not exceed 255 characters',
    'any.required': 'Farm name is required'
  }),
  customer_id: Joi.number().integer().positive().required().messages({
    'any.required': 'Customer is required '
  }),
  village_id: Joi.number().integer().required().messages({
    'number.base': 'Invalid Village',
    'any.required': 'Village is required'
  }),
  longitude: Joi.number().precision(7).allow(null).optional().messages({
    'number.base': 'Longitude must be a decimal number'
  }),
  latitude: Joi.number().precision(7).allow(null).optional().messages({
    'number.base': 'Latitude must be a decimal number'
  })
});
