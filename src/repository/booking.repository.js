import Booking from "../model/booking.model";

export const saveBooking = (booking) => {
  return Booking.create(booking);
};

export const retrieveBookingById = (id) => {
  return Booking.findById(id).lean();
};

export const retrieveBookings = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Booking.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Booking.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateBookingById = (id, booking) => {
  return Booking.findByIdAndUpdate(id, booking, { new: true }).lean();
};

export const deleteBookingById = (id) => {
  return Booking.findByIdAndUpdate(id, { is_active: false, booking_status: "DELETED" }, { new: true }).lean();
};
