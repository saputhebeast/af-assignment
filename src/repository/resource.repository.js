import Resource from "../model/resource.model";

export const saveResource = (resource) => {
  return Resource.create(resource);
};

export const retrieveResourceById = (id) => {
  return Resource.findById(id).lean();
};

export const retrieveResources = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Resource.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Resource.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateResourceById = (id, resource) => {
  return Resource.findByIdAndUpdate(id, resource, { new: true }).lean();
};

export const deleteResourceById = (id) => {
  return Resource.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
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
