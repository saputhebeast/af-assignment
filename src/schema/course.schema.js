import { Joi } from "celebrate";

export const addCourseSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  credits: Joi.number().required()
});

export const updateCourseSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  credits: Joi.number().required()
});
