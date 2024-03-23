import { traced } from "@sliit-foss/functions";
import context from "express-http-context";
import { deleteTimetableById, retrieveTimetableById, retrieveTimetables, saveTimetable, updateTimetableById } from "../repository/timetable.repository";

export const addTimetable = (resource) => {
  const user = context.get("user");
  resource.created_by = user._id;
  return traced(saveTimetable)(resource);
};

export const getTimetable = (id) => {
  return traced(retrieveTimetableById)(id);
};

export const getTimetables = (filters, sorts, page, limit) => {
  return traced(retrieveTimetables)(filters, sorts, page, limit);
};

export const updateTimetable = (id, payload) => {
  return traced(updateTimetableById)(id, payload);
};

export const deleteTimetable = (id) => {
  return traced(deleteTimetableById)(id);
};
