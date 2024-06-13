import { traced } from "@sliit-foss/functions";
import { findExistingBookingSlots, saveBookingSlot, updateBookingSlotsActiveStatusToFalse } from "../repository/booking-slot.repository";

export const addBookingSlots = async (booking) => {
  const { start_datetime, end_datetime, recurring, recurring_type, recurring_to } = booking;

  if (!recurring) {
    const bookingSlot = {
      start_datetime: start_datetime,
      end_datetime: end_datetime,
      booking: booking._id,
      created_by: booking.created_by,
      classroom: booking.classroom
    };
    await traced(saveBookingSlot)(bookingSlot);
  } else {
    const startDate = new Date(start_datetime);
    const endDate = new Date(recurring_to);

    while (startDate <= endDate) {
      const adjustedEndDate = new Date(startDate);
      adjustedEndDate.setHours(startDate.getHours() + (end_datetime.getHours() - start_datetime.getHours()));
      adjustedEndDate.setMinutes(startDate.getMinutes() + (end_datetime.getMinutes() - start_datetime.getMinutes()));

      const bookingSlot = {
        start_datetime: startDate,
        end_datetime: adjustedEndDate,
        booking: booking._id,
        created_by: booking.created_by,
        classroom: booking.classroom
      };
      await traced(saveBookingSlot)(bookingSlot);

      switch (recurring_type) {
        case "WEEKLY":
          startDate.setDate(startDate.getDate() + 7);
          break;
        case "BI_WEEKLY":
          startDate.setDate(startDate.getDate() + 14);
          break;
        case "MONTHLY":
          startDate.setMonth(startDate.getMonth() + 1);
          break;
        default:
          break;
      }
    }
  }
};

export const checkOverlapping = async (booking) => {
  const { start_datetime, end_datetime, recurring, recurring_type, recurring_to, classroom } = booking;

  const timeSlots = [];

  if (!recurring) {
    const bookingSlot = {
      start_datetime: start_datetime,
      end_datetime: end_datetime,
      classroom: classroom
    };
    timeSlots.push(bookingSlot);
  } else {
    const startDate = new Date(start_datetime);
    const endDate = new Date(recurring_to);

    while (startDate <= endDate) {
      const adjustedEndDate = new Date(startDate);
      adjustedEndDate.setHours(startDate.getHours() + (end_datetime.getHours() - start_datetime.getHours()));
      adjustedEndDate.setMinutes(startDate.getMinutes() + (end_datetime.getMinutes() - start_datetime.getMinutes()));

      timeSlots.push({
        start_datetime: new Date(startDate),
        end_datetime: new Date(adjustedEndDate),
        classroom: classroom
      });

      switch (recurring_type) {
        case "WEEKLY":
          startDate.setDate(startDate.getDate() + 7);
          break;
        case "BI_WEEKLY":
          startDate.setDate(startDate.getDate() + 14);
          break;
        case "MONTHLY":
          startDate.setMonth(startDate.getMonth() + 1);
          break;
        default:
          break;
      }
    }
  }

  for (const slot of timeSlots) {
    const overlappingSlots = await findExistingBookingSlots(slot);
    if (overlappingSlots.length > 0) {
      return true;
    }
  }
  return false;
};

export const deactivateBookingSlotsByBookingId = (id) => {
  return traced(updateBookingSlotsActiveStatusToFalse)(id);
};
