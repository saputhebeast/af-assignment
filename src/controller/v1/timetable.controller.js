import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import context from "express-http-context";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addTimetable, deleteTimetable, getTimetable, getTimetables, updateTimetable } from "../../service/timetable.service";
import { addTimetableSchema, updateTimetableSchema } from "../../schema/timetable.schema";

const timetable = express.Router();

timetable.post(
  "/",
  hasAnyRole(["ADMIN", "FACULTY"]),
  celebrate({ [Segments.BODY]: addTimetableSchema }),
  tracedAsyncHandler(async function addTimetableController(req, res) {
    const timetable = await traced(addTimetable)(req.body, context.get("user"));
    return response({ res, message: "Timetable added successfully", data: timetable });
  })
);

timetable.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(getTimetables)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Timetable retrieved successfully", data: timetable });
  })
);

timetable.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(getTimetable)(req.params.id);
    return response({ res, message: "Timetable retrieved successfully", data: timetable });
  })
);

timetable.patch(
  "/:id",
  hasAnyRole(["ADMIN", "FACULTY"]),
  celebrate({ [Segments.BODY]: updateTimetableSchema }),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(updateTimetable)(req.params.id, req.body);
    return response({ res, message: "Timetable updated successfully", data: timetable });
  })
);

timetable.delete(
  "/:id",
  hasAnyRole(["ADMIN", "FACULTY"]),
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(deleteTimetable)(req.params.id);
    return response({ res, message: "Timetable deleted successfully", data: timetable });
  })
);

export default timetable;
