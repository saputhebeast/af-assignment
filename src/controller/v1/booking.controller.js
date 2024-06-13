import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import context from "express-http-context";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addBookingSchema, reviewBookingSchema, updateBookingSchema } from "../../schema/booking.schema";
import { addBooking, deleteBooking, getBooking, getBookings, updateBooking, updateBookingStatus } from "../../service/booking.service";

const booking = express.Router();

booking.post(
  "/",
  hasAnyRole(["ADMIN", "FACULTY"]),
  celebrate({ [Segments.BODY]: addBookingSchema }),
  tracedAsyncHandler(async function addBookingController(req, res) {
    const timetable = await traced(addBooking)(req.body, context.get("user"));
    return response({ res, message: "Booking added successfully", data: timetable });
  })
);

booking.get(
  "/",
  filterQuery,
  hasAnyRole(["ADMIN", "FACULTY"]),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(getBookings)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Bookings retrieved successfully", data: timetable });
  })
);

booking.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(getBooking)(req.params.id);
    return response({ res, message: "Booking retrieved successfully", data: timetable });
  })
);

booking.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateBookingSchema }),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(updateBooking)(req.params.id, req.body);
    return response({ res, message: "Booking updated successfully", data: timetable });
  })
);

booking.patch(
  "/review/:id",
  celebrate({ [Segments.BODY]: reviewBookingSchema }),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(updateBookingStatus)(req.params.id, req.body);
    return response({ res, message: "Booking updated successfully", data: timetable });
  })
);

booking.delete(
  "/:id",
  hasAnyRole(["ADMIN", "FACULTY"]),
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const timetable = await traced(deleteBooking)(req.params.id);
    return response({ res, message: "Booking deleted successfully", data: timetable });
  })
);

export default booking;
