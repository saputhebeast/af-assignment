import BookingSlot from "../model/booking-slot.model";

export const saveBookingSlot = (bookingSlot) => {
  return BookingSlot.create(bookingSlot);
};

export const findExistingBookingSlots = (slot) => {
  return BookingSlot.find({
    $and: [
      { is_active: true },
      { classroom: slot.classroom },
      {
        $or: [
          {
            $and: [{ start_datetime: { $lt: slot.end_datetime } }, { end_datetime: { $gt: slot.start_datetime } }]
          },
          {
            $and: [{ start_datetime: { $eq: slot.end_datetime } }, { end_datetime: { $eq: slot.start_datetime } }]
          }
        ]
      }
    ]
  });
};

export const updateBookingSlotsActiveStatusToFalse = (id) => {
  return BookingSlot.updateMany({ booking: id }, { is_active: false }, { new: true }).lean();
};

export const deleteBookingSlotsByBookingId = (id) => {
  return BookingSlot.deleteMany({ booking: id }).lean();
};

export const getBookingSlotsByBookingId = (id) => {
  return BookingSlot.find({ booking: id, is_active: true });
};
