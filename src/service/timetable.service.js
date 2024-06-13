import { traced } from "@sliit-foss/functions";
import { deleteTimetableById, retrieveTimetableById, retrieveTimetables, saveTimetable, updateTimetableById } from "../repository/timetable.repository";
import { errors } from "../utils";
import { getClassroom } from "./classroom.service";
import { getFaculty } from "./faculty.service";
import { getCourse } from "./course.service";

export const addTimetable = async (timetable, user) => {
  timetable.created_by = user._id;
  const classroom = await traced(getClassroom)(timetable.classroom);
  const faculty = await traced(getFaculty)(timetable.faculty);
  const course = await traced(getCourse)(timetable.course);

  if (classroom === null) {
    throw errors.classroom_not_found;
  }
  if (faculty === null) {
    throw errors.faculty_not_found;
  }
  if (course === null) {
    throw errors.course_not_found;
  }

  return traced(saveTimetable)(timetable);
};

export const getTimetable = async (id) => {
  const timetable = await traced(retrieveTimetableById)(id);
  if (timetable === null) {
    throw errors.timetable_not_found;
  }
  return timetable;
};

export const getTimetables = (filters, sorts, page, limit) => {
  return traced(retrieveTimetables)(filters, sorts, page, limit);
};

export const updateTimetable = async (id, payload) => {
  const timetable = await traced(retrieveTimetableById)(id);
  if (timetable === null) {
    throw errors.timetable_not_found;
  }
  return traced(updateTimetableById)(id, payload);
};

export const deleteTimetable = async (id) => {
  const timetable = await traced(retrieveTimetableById)(id);
  if (timetable === null) {
    throw errors.timetable_not_found;
  }
  return traced(deleteTimetableById)(id);
};
