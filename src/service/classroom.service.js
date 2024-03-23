import context from "express-http-context";
import { traced } from "@sliit-foss/functions";
import { saveClassroomResources } from "../repository/resource.repository";
import { deleteClassroomById, retrieveClassroomById, retrieveClassrooms, saveClassroom, updateClassroomById } from "../repository/classroom.repository";

export const addClassroom = async (classroom) => {
  const user = context.get("user");
  classroom.created_by = user._id;
  classroom.resources = await saveClassroomResources(classroom.resources, user._id);
  return traced(saveClassroom)(classroom);
};

export const getClassroom = (id) => {
  return traced(retrieveClassroomById)(id);
};

export const getClassrooms = (filters, sorts, page, limit) => {
  return traced(retrieveClassrooms)(filters, sorts, page, limit);
};

export const updateClassroom = (id, payload) => {
  return traced(updateClassroomById)(id, payload);
};

// TODO: remove resource from classroom

export const deleteClassroom = (id) => {
  return traced(deleteClassroomById)(id);
};
