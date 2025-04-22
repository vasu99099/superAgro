import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().max(255).required().messages({
    'string.base': 'Name must be a string',
    'string.max': 'Name must not exceed 255 characters',
    'any.required': 'Name is required'
  }),
  hsc_code: Joi.string().trim().max(50).optional().allow(null, '').messages({
    'string.base': 'HSC Code must be a string',
    'string.max': 'HSC Code must not exceed 255 characters'
  }),
  content_technical: Joi.string().trim().optional().allow(null, '').messages({
    'string.base': 'Techincal Content must be a string'
  }),
  categoryId: Joi.number().strict().integer().required().messages({
    'number.base': 'Invalid Category ID',
    'any.required': 'Category is required'
  }),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().min(2).required(),
        altText: Joi.string().max(255).optional().allow('', null),
        isPrimary: Joi.boolean().optional()
      })
    )
    .optional()
});
