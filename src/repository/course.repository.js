import Course from "../model/course.model";

const populate = [{ path: "created_by", select: "_id name email" }];

export const saveCourse = (course) => {
  return Course.create(course);
};

export const retrieveCourseById = (id) => {
  return Course.findById(id).populate(populate).lean();
};

export const retrieveCourses = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Course.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Course.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateCourseById = (id, course) => {
  return Course.findByIdAndUpdate(id, course, { new: true }).populate(populate).lean();
};

export const deleteCourseById = (id) => {
  return Course.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};

export const findCourseByCode = (code) => {
  const regex = new RegExp(code, "i");
  return Course.findOne({ code: { $regex: regex } }).lean();
};
