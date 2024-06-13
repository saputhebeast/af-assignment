import Booking from "../model/booking.model";

const populate = [
  { path: "classroom", select: "_id building floor room_number" },
  { path: "course", select: "_id code name" },
  { path: "faculty", select: "_id name" },
  { path: "created_by", select: "_id name email" }
];

export const saveBooking = (booking) => {
  return Booking.create(booking);
};

export const retrieveBookingById = (id) => {
  return Booking.findById(id).populate(populate).lean();
};

export const retrieveBookings = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Booking.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Booking.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateBookingById = (id, booking) => {
  return Booking.findByIdAndUpdate(id, booking, { new: true }).populate(populate).lean();
};

export const deleteBookingById = (id) => {
  return Booking.findByIdAndUpdate(id, { is_active: false, booking_status: "DELETED" }, { new: true }).populate(populate).lean();
};
