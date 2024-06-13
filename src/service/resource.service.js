import { traced } from "@sliit-foss/functions";
import { deleteResourceById, retrieveResourceById, retrieveResources, saveResource, updateResourceById } from "../repository/resource.repository";
import { errors } from "../utils";

export const addResource = (resource, user) => {
  resource.created_by = user._id;
  return traced(saveResource)(resource);
};

export const getResource = async (id) => {
  const resource = await traced(retrieveResourceById)(id);
  if (resource === null) {
    throw errors.resource_not_found;
  }
  return resource;
};

export const getResources = (filters, sorts, page, limit) => {
  return traced(retrieveResources)(filters, sorts, page, limit);
};

export const updateResource = async (id, payload) => {
  const resource = await traced(retrieveResourceById)(id);
  if (resource === null) {
    throw errors.resource_not_found;
  }
  return traced(updateResourceById)(id, payload);
};

export const deleteResource = async (id) => {
  const resource = await traced(retrieveResourceById)(id);
  if (resource === null) {
    throw errors.resource_not_found;
  }
  return traced(deleteResourceById)(id);
};
