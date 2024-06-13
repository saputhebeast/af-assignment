import createError from "http-errors";

export const errors = {
  missing_token: createError(401, "Bearer token is missing"),
  invalid_token: createError(401, "Token is invalid"),
  cancelled_token: createError(401, "Token has been revoked"),
  invalid_password: createError(401, "Invalid password"),
  invalid_email: createError(401, "Invalid email"),
  invalid_mobile_no: createError(401, "Invalid mobile number"),
  token_expired: createError(401, "Token has expired"),
  invalid_permission: createError(403, "You don't have permission"),
  user_already_exists: createError(409, "User already exists"),
  faculty_already_exists: createError(409, "Faculty already exists"),
  course_already_exists: createError(409, "Course code already exists"),
  user_not_found: createError(404, "User not found"),
  booking_not_found: createError(404, "Booking not found"),
  booking_cannot_update: createError(403, "Approved or Deleted booking cannot be updated"),
  faculty_not_found: createError(404, "Faculty not found"),
  course_not_found: createError(404, "Course not found"),
  notification_not_found: createError(404, "Notification not found"),
  resource_not_found: createError(404, "Resource not found"),
  classroom_not_found: createError(404, "Classroom not found"),
  enrollment_not_found: createError(404, "Enrollment not found"),
  timetable_not_found: createError(404, "Timetable not found"),
  booking_overlap: createError(409, "The new booking overlaps with existing bookings"),
  non_full_day_time_limit_exceeded: createError(400, "Non-full-day booking time difference exceeds the maximum limit of 4 hours")
};
