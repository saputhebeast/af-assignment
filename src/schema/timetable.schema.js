import { Joi } from "celebrate";

export const addTimetableSchema = Joi.object({
  title: Joi.string().required(),
  event_type: Joi.string().required(),
  description: Joi.string().optional(),
  course: Joi.string().required(),
  start_datetime: Joi.date().required(),
  end_datetime: Joi.date().required(),
  faculty: Joi.string().required(),
  classroom: Joi.string().required(),
  booking: Joi.string(),
  created_by: Joi.string(),
  is_active: Joi.boolean()
});

export const updateTimetableSchema = Joi.object({
  course: Joi.string().optional(),
  start_datetime: Joi.string().optional(),
  end_datetime: Joi.string().optional(),
  faculty: Joi.string().optional(),
  classroom: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
