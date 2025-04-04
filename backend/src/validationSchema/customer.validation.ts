import Joi from 'joi';

export const CustomerSchema = Joi.object({
  customer_id: Joi.number().when('$isEdit', { is: true, then: Joi.required() }).messages({
    'any.required': 'Customer ID is required for editing'
  }),
  name: Joi.string().max(255).required().messages({
    'string.base': 'Name must be a string',
    'string.max': 'Name must not exceed 255 characters',
    'any.required': 'Name is required'
  }),
  address: Joi.string().allow('').max(1000).optional().messages({
    'string.max': 'Address must not exceed 1000 characters'
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
  }),
  phone: Joi.string()
    .pattern(/^\d{10,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be between 10 and 20 digits',
      'any.required': 'Phone number is required'
    }),
  whatsapp_number: Joi.string()
    .pattern(/^\d{10,20}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'WhatsApp number must be between 10 and 20 digits'
    }),
  email: Joi.string().email().allow(null, '').optional().messages({
    'string.email': 'Invalid email format'
  })
});
