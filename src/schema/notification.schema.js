import { Joi } from "celebrate";

export const addNotificationSchema = Joi.object({
  receipt: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().required()
});

export const updateNotificationSchema = Joi.object({
  receipt: Joi.string().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().required()
});
