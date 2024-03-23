import { Joi } from "celebrate";

export const addClassroomSchema = Joi.object({
  building: Joi.string().required(),
  floor: Joi.number().required(),
  room_number: Joi.string().required(),
  capacity: Joi.number().required(),
  resources: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().required(),
        description: Joi.string().required()
      })
    )
    .optional()
});

export const updateClassroomSchema = Joi.object({
  building: Joi.string().optional(),
  floor: Joi.number().optional(),
  room_number: Joi.string().optional(),
  capacity: Joi.number().optional(),
  // resources: Joi.array().items(Joi.string()).optional(),
  is_active: Joi.boolean().optional()
});
