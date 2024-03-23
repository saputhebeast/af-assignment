import { traced } from "@sliit-foss/functions";
import { deleteFacultyById, findFacultyByName, retrieveFaculties, retrieveFacultyId, saveFaculty, updateFacultyById } from "../repository/faculty.repository";
import { errors } from "../utils";

export const addFaculty = async (faculty, user) => {
  faculty.created_by = user._id;
  const existingFaculty = await traced(findFacultyByName)(faculty.name);
  if (existingFaculty !== null) {
    throw errors.faculty_already_exists;
  }
  return traced(saveFaculty)(faculty);
};

export const getFaculties = (filters, sorts, page, limit) => {
  return traced(retrieveFaculties)(filters, sorts, page, limit);
};

export const getFaculty = async (id) => {
  const faculty = await traced(retrieveFacultyId)(id);
  if (faculty === null) {
    throw errors.faculty_not_found;
  }
  return faculty;
};

export const updateFaculty = async (id, payload) => {
  const faculty = await traced(retrieveFacultyId)(id);
  if (faculty === null) {
    throw errors.faculty_not_found;
  }
  return traced(updateFacultyById)(id, payload);
};

export const deleteFaculty = async (id) => {
  const faculty = await traced(retrieveFacultyId)(id);
  if (faculty === null) {
    throw errors.faculty_not_found;
  }
  return traced(deleteFacultyById)(id);
};
