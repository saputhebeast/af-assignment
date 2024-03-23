import Notification from "../model/notification.model";

export const saveNotification = (notification) => {
  return Notification.create(notification);
};

export const retrieveNotificationById = (id) => {
  return Notification.findById(id).lean();
};

export const retrieveNotifications = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Notification.paginate({ is_active: true, ...filters }, { sort: sorts, page, limit, lean: true });
  }
  return Notification.find({ is_active: true, ...filters })
    .sort(sorts)
    .lean();
};

export const updateNotificationById = (id, notification) => {
  return Notification.findByIdAndUpdate(id, notification, { new: true }).lean();
};

export const clearNotificationById = (id) => {
  return Notification.findByIdAndUpdate(id, { is_active: false }, { new: true }).lean();
};

export const clearAllNotificationsByUserId = (id) => {
  return Notification.updateMany({ receipt: id }, { is_viewed: true }, { new: true }).lean();
};
