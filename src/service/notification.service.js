import { traced } from "@sliit-foss/functions";
import context from "express-http-context";
import {
  clearAllNotificationsByUserId,
  clearNotificationById,
  retrieveNotificationById,
  retrieveNotifications,
  saveNotification,
  updateNotificationById
} from "../repository/notification.repository";

export const addNotification = (notification) => {
  const user = context.get("user");
  notification.created_by = user._id;
  return traced(saveNotification)(notification);
};

export const getNotification = (id) => {
  return traced(retrieveNotificationById)(id);
};

export const getNotifications = (filters, sorts, page, limit) => {
  return traced(retrieveNotifications)(filters, sorts, page, limit);
};

export const updateNotification = (id, notification) => {
  return traced(updateNotificationById)(id, notification);
};

export const clearNotification = (id) => {
  return traced(clearNotificationById)(id);
};

export const clearAllNotifications = () => {
  const user = context.get("user");
  return traced(clearAllNotificationsByUserId)(user._id);
};
