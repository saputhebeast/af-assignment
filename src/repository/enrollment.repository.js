import Enrollment from "../model/enrollment.model";

export const saveEnrollment = (faculty) => {
  return Enrollment.create(faculty);
};

export const retrieveEnrollmentId = (id) => {
  return Enrollment.findById(id).lean();
};

export const retrieveEnrollments = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Enrollment.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Enrollment.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateEnrollmentById = (id, faculty) => {
  return Enrollment.findByIdAndUpdate(id, faculty, { new: true }).lean();
};

export const deleteEnrollmentById = (id) => {
  return Enrollment.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
};
