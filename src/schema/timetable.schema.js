import { Joi } from "celebrate";

export const updateTimetableSchema = Joi.object({
  course: Joi.string().optional(),
  start_datetime: Joi.string().optional(),
  end_datetime: Joi.string().optional(),
  faculty: Joi.string().optional(),
  classroom: Joi.string().optional(),
  is_active: Joi.boolean().optional()
});
