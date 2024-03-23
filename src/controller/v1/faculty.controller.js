import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import context from "express-http-context";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addFaculty, deleteFaculty, getFaculties, getFaculty, updateFaculty } from "../../service/faculty.service";
import { addFacultySchema, updateFacultySchema } from "../../schema/faculty.schema";

const faculty = express.Router();

faculty.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addFacultySchema }),
  tracedAsyncHandler(async function (req, res) {
    const faculty = await traced(addFaculty)(req.body, context.get("user"));
    return response({ res, message: "Faculty added successfully", data: faculty });
  })
);

faculty.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const faculty = await traced(getFaculties)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Faculties retrieved successfully", data: faculty });
  })
);

faculty.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const faculty = await traced(getFaculty)(req.params.id);
    return response({ res, message: "Faculty retrieved successfully", data: faculty });
  })
);

faculty.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateFacultySchema }),
  tracedAsyncHandler(async (req, res) => {
    const faculty = await traced(updateFaculty)(req.params.id, req.body);
    return response({ res, message: "Faculty updated successfully", data: faculty });
  })
);

faculty.delete(
  "/:id",
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const faculty = await traced(deleteFaculty)(req.params.id);
    return response({ res, message: "Faculty deleted successfully", data: faculty });
  })
);

export default faculty;
