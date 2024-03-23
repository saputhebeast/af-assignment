import { traced } from "@sliit-foss/functions";
import context from "express-http-context";
import { deleteEnrollmentById, retrieveEnrollmentId, retrieveEnrollments, saveEnrollment, updateEnrollmentById } from "../repository/enrollment.repository";

export const addEnrollment = (enrollment) => {
  const user = context.get("user");
  enrollment.created_by = user.id;
  return traced(saveEnrollment)(enrollment);
};

export const getEnrollments = (filters, sorts, page, limit) => {
  return traced(retrieveEnrollments)(filters, sorts, page, limit);
};

export const getEnrollment = (id) => {
  return traced(retrieveEnrollmentId)(id);
};

export const updateEnrollment = (id, payload) => {
  return traced(updateEnrollmentById)(id, payload);
};

export const deleteEnrollment = (id) => {
  return traced(deleteEnrollmentById)(id);
};
