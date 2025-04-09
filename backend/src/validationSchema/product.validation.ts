import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().max(255).required(),
  hsc_code: Joi.string().max(50).optional().allow(null, ''),
  content_technical: Joi.string().optional().allow(null, ''),
  categoryId: Joi.number().integer().required(),

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
