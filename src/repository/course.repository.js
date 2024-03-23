import Course from "../model/course.model";

export const saveCourse = (course) => {
  return Course.create(course);
};

export const retrieveCourseById = (id) => {
  return Course.findById(id).lean();
};

export const retrieveCourses = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Course.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Course.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateCourseById = (id, course) => {
  return Course.findByIdAndUpdate(id, course, { new: true }).lean();
};

export const deleteCourseById = (id) => {
  return Course.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
};

export const findCourseByCode = (code) => {
  const regex = new RegExp(code, "i");
  return Course.findOne({ code: { $regex: regex } }).lean();
};
