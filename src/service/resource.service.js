import { traced } from "@sliit-foss/functions";
import context from "express-http-context";
import { deleteResourceById, retrieveResourceById, retrieveResources, saveResource, updateResourceById } from "../repository/resource.repository";

export const addResource = (resource) => {
  const user = context.get("user");
  resource.created_by = user._id;
  return traced(saveResource)(resource);
};

export const getResource = (id) => {
  return traced(retrieveResourceById)(id);
};

export const getResources = (filters, sorts, page, limit) => {
  return traced(retrieveResources)(filters, sorts, page, limit);
};

export const updateResource = (id, payload) => {
  return traced(updateResourceById)(id, payload);
};

export const deleteResource = (id) => {
  return traced(deleteResourceById)(id);
};
