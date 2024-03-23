import { Joi } from "celebrate";

export const addFacultySchema = Joi.object({
  name: Joi.string().required()
});

export const updateFacultySchema = Joi.object({
  name: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
