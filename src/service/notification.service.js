import { traced } from "@sliit-foss/functions";
import {
  clearAllNotificationsByUserId,
  clearNotificationById,
  retrieveNotificationById,
  retrieveNotifications,
  saveNotification,
  updateNotificationById
} from "../repository/notification.repository";
import { errors } from "../utils";

export const addNotification = (notification, user) => {
  notification.created_by = user._id;
  return traced(saveNotification)(notification);
};

export const getNotification = (id) => {
  const notification = traced(retrieveNotificationById)(id);
  if (notification === null) {
    throw errors.notification_not_found;
  }
  return notification;
};

export const getNotifications = (filters, sorts, page, limit) => {
  return traced(retrieveNotifications)(filters, sorts, page, limit);
};

export const updateNotification = (id, payload) => {
  const notification = traced(retrieveNotificationById)(id);
  if (notification === null) {
    throw errors.notification_not_found;
  }
  return traced(updateNotificationById)(id, payload);
};

export const clearNotification = (id) => {
  const notification = traced(retrieveNotificationById)(id);
  if (notification === null) {
    throw errors.notification_not_found;
  }
  return traced(clearNotificationById)(id);
};

export const clearAllNotifications = (user) => {
  return traced(clearAllNotificationsByUserId)(user._id);
};
