import mongoose from "mongoose";
import { moduleLogger } from "@sliit-foss/module-logger";
import Faculty from "../../src/model/faculty.model";
import Course from "../../src/model/course.model";
import Classroom from "../../src/model/classroom.model";
import Booking from "../../src/model/booking.model";
import BookingSlot from "../../src/model/booking-slot.model";
import Enrollment from "../../src/model/enrollment.model";
import Resource from "../../src/model/resource.model";
import Timetable from "../../src/model/timetable.model";
import Notification from "../../src/model/notification.model";
import User from "../../src/model/user.model";

const logger = moduleLogger("mongo-connector");

export const disconnectMongo = async () => {
  await Booking.deleteMany({});
  await BookingSlot.deleteMany({});
  await Classroom.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Faculty.deleteMany({});
  await Notification.deleteMany({});
  await Resource.deleteMany({});
  await Timetable.deleteMany({});
  await User.deleteMany({});

  await mongoose.disconnect();
  logger.info(`MongoDB connection closed`);
};
