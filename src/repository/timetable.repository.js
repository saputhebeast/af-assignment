import Timetable from "../model/timetable.model";

export const saveTimetable = (timetable) => {
  return Timetable.create(timetable);
};

export const retrieveTimetableById = (id) => {
  return Timetable.findById(id).lean();
};

export const retrieveTimetables = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Timetable.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Timetable.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateTimetableById = (id, timetable) => {
  return Timetable.findByIdAndUpdate(id, timetable, { new: true }).lean();
};

export const deleteTimetableById = (id) => {
  return Timetable.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
};

export const deleteTimeTableSlotsByBookingId = (id) => {
  return Timetable.deleteMany({ booking: id });
};
