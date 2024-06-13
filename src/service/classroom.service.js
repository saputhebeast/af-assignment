import { traced } from "@sliit-foss/functions";
import { saveClassroomResources } from "../repository/resource.repository";
import { deleteClassroomById, retrieveClassroomById, retrieveClassrooms, saveClassroom, updateClassroomById } from "../repository/classroom.repository";
import { errors } from "../utils";
import { addNotification } from "./notification.service";

export const addClassroom = async (classroom, user) => {
  classroom.created_by = user._id;
  classroom.resources = await saveClassroomResources(classroom.resources, user._id);

  await traced(addNotification)({ receipt: user._id, title: "Classroom Created!", message: "You has been created the classroom successfully!", type: "CLASSROOM" }, user);

  return traced(saveClassroom)(classroom);
};

export const getClassroom = (id) => {
  const classroom = traced(retrieveClassroomById)(id);
  if (classroom === null) {
    throw errors.classroom_not_found;
  }
  return classroom;
};

export const getClassrooms = (filters, sorts, page, limit) => {
  return traced(retrieveClassrooms)(filters, sorts, page, limit);
};

export const updateClassroom = (id, payload) => {
  const classroom = traced(retrieveClassroomById)(id);
  if (classroom === null) {
    throw errors.classroom_not_found;
  }
  return traced(updateClassroomById)(id, payload);
};

export const deleteClassroom = (id) => {
  const classroom = traced(retrieveClassroomById)(id);
  if (classroom === null) {
    throw errors.classroom_not_found;
  }
  return traced(deleteClassroomById)(id);
};
