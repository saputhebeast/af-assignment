import { Joi } from "celebrate";

export const addEnrollmentSchema = Joi.object({
  student: Joi.string().required(),
  course: Joi.string().required()
});

export const updateEnrollmentSchema = Joi.object({
  student: Joi.string().optional(),
  course: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
