import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addNotificationSchema, updateNotificationSchema } from "../../schema/notification.schema";
import { addNotification, clearAllNotifications, clearNotification, getNotification, getNotifications, updateNotification } from "../../service/notification.service";

const notification = express.Router();

notification.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addNotificationSchema }),
  tracedAsyncHandler(async function addNotificationController(req, res) {
    const notification = await traced(addNotification)(req.body);
    return response({ res, message: "Notification added successfully", data: notification });
  })
);

notification.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const notifications = await traced(getNotifications)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Notifications retrieved successfully", data: notifications });
  })
);

notification.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const notification = await traced(getNotification)(req.params.id);
    return response({ res, message: "Notification retrieved successfully", data: notification });
  })
);

notification.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateNotificationSchema }),
  tracedAsyncHandler(async (req, res) => {
    const notification = await traced(updateNotification)(req.params.id, req.body);
    return response({ res, message: "Notification updated successfully", data: notification });
  })
);

notification.delete(
  "/",
  tracedAsyncHandler(async (req, res) => {
    const notification = await traced(clearAllNotifications)();
    return response({ res, message: "Notifications deleted successfully", data: notification });
  })
);

notification.delete(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const notification = await traced(clearNotification)(req.params.id);
    return response({ res, message: "Notification deleted successfully", data: notification });
  })
);

export default notification;
