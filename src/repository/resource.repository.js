import Resource from "../model/resource.model";

const populate = [{ path: "created_by", select: "_id name email" }];

export const saveResource = (resource) => {
  return Resource.create(resource);
};

export const retrieveResourceById = (id) => {
  return Resource.findById(id).populate(populate).lean();
};

export const retrieveResources = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Resource.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Resource.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateResourceById = (id, resource) => {
  return Resource.findByIdAndUpdate(id, resource, { new: true }).populate(populate).lean();
};

export const deleteResourceById = (id) => {
  return Resource.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};

export const saveClassroomResources = async (resources, createdBy) => {
  const savedResources = [];
  for (const resource of resources) {
    resource.created_by = createdBy;
    const savedResource = await Resource.create(resource);
    savedResources.push(savedResource);
  }
  return savedResources;
};
