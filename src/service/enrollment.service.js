import { traced } from "@sliit-foss/functions";
import { deleteEnrollmentById, retrieveEnrollmentId, retrieveEnrollments, saveEnrollment, updateEnrollmentById } from "../repository/enrollment.repository";
import { errors } from "../utils";

export const addEnrollment = (enrollment, user) => {
  enrollment.created_by = user.id;
  return traced(saveEnrollment)(enrollment);
};

export const getEnrollments = (filters, sorts, page, limit) => {
  return traced(retrieveEnrollments)(filters, sorts, page, limit);
};

export const getEnrollment = async (id) => {
  const enrollment = await traced(retrieveEnrollmentId)(id);
  if (enrollment === null) {
    throw errors.enrollment_not_found;
  }
  return enrollment;
};

export const updateEnrollment = async (id, payload) => {
  const enrollment = await traced(retrieveEnrollmentId)(id);
  if (enrollment === null) {
    throw errors.enrollment_not_found;
  }
  return traced(updateEnrollmentById)(id, payload);
};

export const deleteEnrollment = async (id) => {
  const enrollment = await traced(retrieveEnrollmentId)(id);
  if (enrollment === null) {
    throw errors.enrollment_not_found;
  }
  return traced(deleteEnrollmentById)(id);
};
