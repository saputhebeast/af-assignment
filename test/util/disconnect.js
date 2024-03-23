import mongoose from "mongoose";
import { moduleLogger } from "@sliit-foss/module-logger";
import User from "../../src/model/user.model.js";
import Faculty from "../../src/model/faculty.model";
import Course from "../../src/model/course.model";

const logger = moduleLogger("mongo-connector");

export const disconnectMongo = async () => {
  await User.deleteMany({});
  await Faculty.deleteMany({});
  await Course.deleteMany({});

  await mongoose.disconnect();
  logger.info(`MongoDB connection closed`);
};
