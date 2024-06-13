import Classroom from "../model/classroom.model";

const populate = [
  {
    path: "resources",
    select: "name description quantity _id"
  }
];

export const saveClassroom = (classroom) => {
  return Classroom.create(classroom);
};

export const retrieveClassroomById = (id) => {
  return Classroom.findById(id).populate(populate).lean();
};

export const retrieveClassrooms = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Classroom.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Classroom.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateClassroomById = (id, classroom) => {
  return Classroom.findByIdAndUpdate(id, classroom, { new: true }).populate(populate).lean();
};

export const deleteClassroomById = (id) => {
  return Classroom.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};
