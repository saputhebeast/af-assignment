import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import context from "express-http-context";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addClassroomSchema, updateClassroomSchema } from "../../schema/classroom.schema";
import { addClassroom, deleteClassroom, getClassroom, getClassrooms, updateClassroom } from "../../service/classroom.service";

const classroom = express.Router();

classroom.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addClassroomSchema }),
  tracedAsyncHandler(async function addCourseController(req, res) {
    const classRoom = await traced(addClassroom)(req.body, context.get("user"));
    return response({ res, message: "Classroom added successfully", data: classRoom });
  })
);

classroom.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const classRoom = await traced(getClassrooms)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Classrooms retrieved successfully", data: classRoom });
  })
);

classroom.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const classRoom = await traced(getClassroom)(req.params.id);
    return response({ res, message: "Classroom retrieved successfully", data: classRoom });
  })
);

classroom.patch(
  "/:id",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: updateClassroomSchema }),
  tracedAsyncHandler(async (req, res) => {
    const classRoom = await traced(updateClassroom)(req.params.id, req.body);
    return response({ res, message: "Classroom updated successfully", data: classRoom });
  })
);

classroom.delete(
  "/:id",
  hasAnyRole(["ADMIN"]),
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const classRoom = await traced(deleteClassroom)(req.params.id);
    return response({ res, message: "Classroom deleted successfully", data: classRoom });
  })
);

export default classroom;
