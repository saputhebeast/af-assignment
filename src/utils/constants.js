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
  faculty_not_found: createError(404, "Faculty not found"),
  course_not_found: createError(404, "Course not found"),
  booking_overlap: createError(409, "The new booking overlaps with existing bookings"),
  non_full_day_time_limit_exceeded: createError(400, "Non-full-day booking time difference exceeds the maximum limit of 4 hours")
};
