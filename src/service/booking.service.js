import context from "express-http-context";
import { traced } from "@sliit-foss/functions";
import { deleteBookingById, retrieveBookingById, retrieveBookings, saveBooking, updateBookingById } from "../repository/booking.repository";
import { errors } from "../utils";
import { getBookingSlotsByBookingId, updateBookingSlotsActiveStatusToFalse } from "../repository/booking-slot.repository";
import { deleteTimeTableSlotsByBookingId, saveTimetable } from "../repository/timetable.repository";
import { addBookingSlots, checkOverlapping, deactivateBookingSlotsByBookingId } from "./booking-slot.service";

export const addBooking = async (booking) => {
  const user = context.get("user");
  booking.created_by = user._id;
  if (booking.booking_type === "FULL_DAY") {
    booking.end_datetime = booking.start_datetime;
  }
  if (booking.recurring) {
    booking.recurring_from = booking.start_datetime;
  }

  if (booking.booking_type !== "FULL_DAY" && !isWithinTimeLimit(booking)) {
    throw errors.non_full_day_time_limit_exceeded;
  }

  if (await checkOverlapping(booking)) {
    throw errors.booking_overlap;
  }

  const savedBooking = await traced(saveBooking)(booking);
  await traced(addBookingSlots)(savedBooking);
  return savedBooking;
};

const isWithinTimeLimit = (booking) => {
  const startDatetime = new Date(booking.start_datetime);
  const endDatetime = new Date(booking.end_datetime);
  const timeDifferenceInHours = Math.abs(endDatetime - startDatetime) / (1000 * 60 * 60);

  return timeDifferenceInHours <= 4;
};

export const getBooking = (id) => {
  return traced(retrieveBookingById)(id);
};

export const getBookings = (filters, sorts, page, limit) => {
  return traced(retrieveBookings)(filters, sorts, page, limit);
};

export const updateBookingStatus = async (id, payload) => {
  if (payload.booking_status === "CONFIRMED") {
    // get booking
    const booking = await traced(retrieveBookingById)(id);
    if (booking === null) {
      throw errors.booking_not_found;
    }

    // get booking slots
    const bookingSlots = await traced(getBookingSlotsByBookingId)(id);

    // create timetable
    for (const slot of bookingSlots) {
      const timetableRecord = {
        title: booking["title"],
        event_type: booking["booking_type"],
        description: booking["description"],
        course: booking["course"],
        start_datetime: slot.start_datetime,
        end_datetime: slot.end_datetime,
        faculty: booking["faculty"],
        classroom: booking["classroom"],
        booking: id,
        created_by: booking["created_by"]
      };
      await traced(saveTimetable)(timetableRecord);
    }

    // update booking
    await traced(updateBookingById)(id, { booking_status: "CONFIRMED" });
  } else if (payload.booking_status === "REJECTED") {
    // update booking and booking slot to rejected and is_active: false
    await traced(updateBookingById)(id, payload);
    await traced(deactivateBookingSlotsByBookingId)(id);
  }
};

export const deleteBooking = async (id) => {
  const booking = await traced(retrieveBookingById)(id);
  if (booking === null) {
    throw errors.booking_not_found;
  }
  const booking_status = booking["booking_status"];

  // check booking status
  // if confirmed, update status as deleted and inactive, and update booking slots to inactive and delete timetable records
  // if pending, update status as deleted and inactive, and update booking slots to inactive
  if (booking_status === "CONFIRMED") {
    await traced(deleteTimeTableSlotsByBookingId)(id);
  }
  await traced(deleteBookingById)(id);
  await traced(updateBookingSlotsActiveStatusToFalse)(id);
};
