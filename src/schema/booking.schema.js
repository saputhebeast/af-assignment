import { Joi } from "celebrate";

export const addBookingSchema = Joi.object({
  title: Joi.string().required(),
  event_type: Joi.string().valid("LECTURE", "EVENT", "CONFERENCE", "WORKSHOP").required(),
  description: Joi.string().optional(),
  classroom: Joi.string().required(),
  course: Joi.string().required(),
  faculty: Joi.string().required(),
  booking_type: Joi.string().valid("FULL_DAY", "NOT_FULL_DAY").required(),
  start_datetime: Joi.date().required(),
  end_datetime: Joi.date().when("booking_type", {
    is: "FULL_DAY",
    then: Joi.date()
      .timestamp("javascript")
      .default(() => new Date().setHours(24, 0, 0, 0)),
    otherwise: Joi.date().required()
  }),
  recurring: Joi.boolean().required(),
  recurring_type: Joi.when("recurring", {
    is: true,
    then: Joi.string().valid("WEEKLY", "BI_WEEKLY", "MONTHLY").required(),
    otherwise: Joi.forbidden()
  }),
  recurring_to: Joi.when("recurring", {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
});

export const reviewBookingSchema = Joi.object({
  booking_status: Joi.string().valid("CONFIRMED", "REJECTED").required()
});

// {
//     "title": "AF Lecture",
//     "event_type": "LECTURE",
//     "description": "Application Frameworks lecture for the 3rd year 2nd semester students.",
//     "classroom": "65f85ea9597514e143693146",
//     "course": "65ef566618a1dfeb2407a753",
//     "faculty": "65f43d955d37a56aeefbbfc9",
//     "booking_type": "NOT_FULL_DAY",
//     "start_datetime": "2024-03-26T08:00:00.000Z",
//     "end_datetime": "2024-03-26T10:00:00.000Z",
//     "recurring": false
// }

// {
//   "title": "LECTURE",
//   "event_type": "LECTURE",
//   "description": "AF LABS",
//   "classroom": "65f85ea9597514e143693146",
//   "course": "65ef566618a1dfeb2407a753",
//   "faculty": "65f43d955d37a56aeefbbfc9",
//   "booking_type": "NOT_FULL_DAY",
//   "start_datetime": "2024-03-26T08:00:00.000Z",
//   "end_datetime": "2024-03-26T10:00:00.000Z",
//   "recurring": true,
//   "recurring_type": "WEEKLY",
//   "recurring_from": "2024-03-26T00:00:00.000Z",
//   "recurring_to": "2024-04-26T08:00:00.000Z"
// }

// {
//   "title": "AF Competition",
//   "event_type": "LECTURE",
//   "description": "AF Competition for 1st year students",
//   "classroom": "65f85ea9597514e143693146",
//   "course": "65ef566618a1dfeb2407a753",
//   "faculty": "65f43d955d37a56aeefbbfc9",
//   "booking_type": "FULL_DAY",
//   "start_datetime": "2024-03-26T08:00:00.000Z",
//   "end_datetime": "2024-03-26T10:00:00.000Z",
//   "recurring": "false"
// }

// {
//   "title": "AF Conference",
//   "event_type": "EVENT",
//   "description": "AF Conference for AF Enthusiasts",
//   "classroom": "65f85ea9597514e143693146",
//   "course": "65ef566618a1dfeb2407a753",
//   "faculty": "65f43d955d37a56aeefbbfc9",
//   "booking_type": "FULL_DAY",
//   "recurring": true,
//   "recurring_type": "WEEKLY",
//   "recurring_from": "2024-02-03",
//   "recurring_to": "2024-02-20"
// }
