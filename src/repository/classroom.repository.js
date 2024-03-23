import Classroom from "../model/classroom.model";

export const saveClassroom = (classroom) => {
  return Classroom.create(classroom);
};

export const retrieveClassroomById = (id) => {
  return Classroom.findById(id).lean();
};

export const retrieveClassrooms = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Classroom.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Classroom.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateClassroomById = (id, classroom) => {
  return Classroom.findByIdAndUpdate(id, classroom, { new: true }).lean();
};

export const deleteClassroomById = (id) => {
  return Classroom.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
};
