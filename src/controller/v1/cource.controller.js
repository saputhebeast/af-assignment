import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import context from "express-http-context";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addCourseSchema, updateCourseSchema } from "../../schema/course.schema";
import { addCourse, deleteCourse, getCourse, getCourses, updateCourse } from "../../service/course.service";

const course = express.Router();

course.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addCourseSchema }),
  tracedAsyncHandler(async function addCourseController(req, res) {
    const course = await traced(addCourse)(req.body, context.get("user"));
    return response({ res, message: "Course added successfully", data: course });
  })
);

course.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const course = await traced(getCourses)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Courses retrieved successfully", data: course });
  })
);

course.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const course = await traced(getCourse)(req.params.id);
    return response({ res, message: "Course retrieved successfully", data: course });
  })
);

course.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateCourseSchema }),
  tracedAsyncHandler(async (req, res) => {
    const course = await traced(updateCourse)(req.params.id, req.body);
    return response({ res, message: "Course updated successfully", data: course });
  })
);

course.delete(
  "/:id",
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const course = await traced(deleteCourse)(req.params.id);
    return response({ res, message: "Course deleted successfully", data: course });
  })
);

export default course;
