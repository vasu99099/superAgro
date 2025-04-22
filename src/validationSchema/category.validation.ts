import Joi from 'joi';

export const CategorySchema = Joi.object({
  category_id: Joi.number()
    .strict()
    .when('$isEdit', { is: true, then: Joi.number().required() }) // Required only when editing
    .messages({
      'any.required': 'Category ID is required for editing'
    }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required'
  }),
  description: Joi.string().trim().allow('').max(500).optional().messages({
    'string.max': 'Description must be at most 500 characters'
  })
});
