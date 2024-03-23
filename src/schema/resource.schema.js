import { Joi } from "celebrate";

export const addResourceSchema = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().required(),
  description: Joi.string().required()
});

export const updateResourceSchema = Joi.object({
  name: Joi.string().optional(),
  quantity: Joi.number().optional(),
  description: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
