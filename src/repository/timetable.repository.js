import Timetable from "../model/timetable.model";

const populate = [
  { path: "created_by", select: "_id name email" },
  { path: "faculty", select: "_id name" },
  { path: "course", select: "_id code name description credits" },
  { path: "classroom", select: "_id building floor room_number" },
  { path: "booking", select: "_id title description event_type booking_type start_datetime end_datetime recurring recurring_type recurring_from recurring_to booking_status" }
];

export const saveTimetable = (timetable) => {
  return Timetable.create(timetable);
};

export const retrieveTimetableById = (id) => {
  return Timetable.findById(id).populate(populate).lean();
};

export const retrieveTimetables = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Timetable.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Timetable.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateTimetableById = (id, timetable) => {
  return Timetable.findByIdAndUpdate(id, timetable, { new: true }).populate(populate).lean();
};

export const deleteTimetableById = (id) => {
  return Timetable.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};

export const deleteTimeTableSlotsByBookingId = (id) => {
  return Timetable.deleteMany({ booking: id });
};
