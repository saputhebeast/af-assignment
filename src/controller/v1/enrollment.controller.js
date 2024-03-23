import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addEnrollmentSchema, updateEnrollmentSchema } from "../../schema/enrollment.schema";
import { addEnrollment, deleteEnrollment, getEnrollment, getEnrollments, updateEnrollment } from "../../service/enrollment.service";

const enrollment = express.Router();

enrollment.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addEnrollmentSchema }),
  tracedAsyncHandler(async function addCourseController(req, res) {
    const enrollment = await traced(addEnrollment)(req.body);
    return response({ res, message: "Enrollment added successfully", data: enrollment });
  })
);

enrollment.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const enrollment = await traced(getEnrollments)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Enrollment retrieved successfully", data: enrollment });
  })
);

enrollment.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const enrollment = await traced(getEnrollment)(req.params.id);
    return response({ res, message: "Enrollment retrieved successfully", data: enrollment });
  })
);

enrollment.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateEnrollmentSchema }),
  tracedAsyncHandler(async (req, res) => {
    const enrollment = await traced(updateEnrollment)(req.params.id, req.body);
    return response({ res, message: "Enrollment updated successfully", data: enrollment });
  })
);

enrollment.delete(
  "/:id",
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const enrollment = await traced(deleteEnrollment)(req.params.id);
    return response({ res, message: "Enrollment deleted successfully", data: enrollment });
  })
);

export default enrollment;
