import Faculty from "../model/faculty.model";

const populate = [{ path: "created_by", select: "_id name email" }];

export const saveFaculty = (faculty) => {
  return Faculty.create(faculty);
};

export const retrieveFacultyId = (id) => {
  return Faculty.findById(id).populate(populate).lean();
};

export const retrieveFaculties = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Faculty.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Faculty.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateFacultyById = (id, faculty) => {
  return Faculty.findByIdAndUpdate(id, faculty, { new: true }).populate(populate).lean();
};

export const deleteFacultyById = (id) => {
  return Faculty.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};

export const findFacultyByName = (name) => {
  const regex = new RegExp(name, "i");
  return Faculty.findOne({ name: { $regex: regex } }).lean();
};
