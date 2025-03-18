import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string()
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

export const registerUserSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 30 characters',
    'any.required': 'Username is required'
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string()
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
  role_id: Joi.number().integer().required().messages({
    'any.required': 'Role ID is required'
  }),
  contact_number: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Contact number must be between 10-15 digits',
      'any.required': 'Contact number is required'
    }),
  firstname: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.max': 'First name must be at most 50 characters',
    'any.required': 'First name is required'
  }),
  lastname: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.max': 'Last name must be at most 50 characters',
    'any.required': 'Last name is required'
  })
});
