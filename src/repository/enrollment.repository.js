import Enrollment from "../model/enrollment.model";

const populate = [
  { path: "created_by", select: "_id name email" },
  { path: "student", select: "_id name email" },
  { path: "course", select: "_id code name description credits" }
];

export const saveEnrollment = (faculty) => {
  return Enrollment.create(faculty);
};

export const retrieveEnrollmentId = (id) => {
  return Enrollment.findById(id).populate(populate).lean();
};

export const retrieveEnrollments = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Enrollment.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Enrollment.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateEnrollmentById = (id, faculty) => {
  return Enrollment.findByIdAndUpdate(id, faculty, { new: true }).populate(populate).lean();
};

export const deleteEnrollmentById = (id) => {
  return Enrollment.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};
