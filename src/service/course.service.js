import { traced } from "@sliit-foss/functions";
import { deleteCourseById, findCourseByCode, retrieveCourseById, retrieveCourses, saveCourse, updateCourseById } from "../repository/course.repository";
import { errors } from "../utils";
import { getAdmin } from "../repository/user.repository";
import { addNotification } from "./notification.service";

export const addCourse = async (course, user) => {
  course.created_by = user._id;
  const existingCourse = await traced(findCourseByCode)(course.code);
  if (existingCourse !== null) {
    throw errors.course_already_exists;
  }

  const superAdmin = await traced(getAdmin)();
  await traced(addNotification)({ receipt: user._id, title: "Course Created!", message: "Your course has been created successfully!", type: "COURSE" }, user);
  await traced(addNotification)(
    { receipt: superAdmin._id, title: "Course Created!", message: "New course has been created successfully by a faculty member!", type: "COURSE" },
    superAdmin
  );

  return traced(saveCourse)(course);
};

export const getCourse = async (id) => {
  const course = await traced(retrieveCourseById)(id);
  if (course === null) {
    throw errors.course_not_found;
  }
  return course;
};

export const getCourses = (filters, sorts, page, limit) => {
  return traced(retrieveCourses)(filters, sorts, page, limit);
};

export const updateCourse = async (id, payload) => {
  const course = await traced(retrieveCourseById)(id);
  if (course === null) {
    throw errors.course_not_found;
  }
  return traced(updateCourseById)(id, payload);
};

export const deleteCourse = async (id) => {
  const course = await traced(retrieveCourseById)(id);
  if (course === null) {
    throw errors.course_not_found;
  }
  return traced(deleteCourseById)(id);
};
