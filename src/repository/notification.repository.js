import Notification from "../model/notification.model";

const populate = [
  { path: "created_by", select: "_id name email" },
  { path: "receipt", select: "_id name email" }
];

export const saveNotification = (notification) => {
  return Notification.create(notification);
};

export const retrieveNotificationById = (id) => {
  return Notification.findById(id).populate(populate).lean();
};

export const retrieveNotifications = (filters = {}, sorts = {}, page, limit) => {
  if (page && limit) {
    return Notification.paginate({ is_active: true, ...filters }, { populate: populate, sort: sorts, page, limit, lean: true });
  }
  return Notification.find({ is_active: true, ...filters })
    .sort(sorts)
    .populate(populate)
    .lean();
};

export const updateNotificationById = (id, notification) => {
  return Notification.findByIdAndUpdate(id, notification, { new: true }).populate(populate).lean();
};

export const clearNotificationById = (id) => {
  return Notification.findByIdAndUpdate(id, { is_active: false }, { new: true }).populate(populate).lean();
};

export const clearAllNotificationsByUserId = (id) => {
  return Notification.updateMany({ receipt: id }, { is_viewed: true }, { new: true }).populate(populate).lean();
};
