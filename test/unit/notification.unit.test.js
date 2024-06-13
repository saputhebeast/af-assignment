import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createUser } from "../util/repository";
import { addNotification, getNotification, getNotifications, updateNotification, clearNotification, clearAllNotifications } from "../../src/service/notification.service";

describe("Notification Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addNotification", () => {
    it("success", async () => {
      const user = await createUser("Notification User", "notifyuser@gmail.com", "USER");
      const notification = {
        receipt: user._id,
        title: "Test Notification",
        message: "This is a test notification",
        type: "INFO"
      };

      const addedNotification = await addNotification(notification, user);
      expect(addedNotification).toBeDefined();
      expect(addedNotification.title).toBe("Test Notification");
    });
  });

  describe("getNotification", () => {
    it("success", async () => {
      const user = await createUser("Notification User", "notifyuser2@gmail.com", "USER");
      const notification = await addNotification(
        {
          receipt: user._id,
          title: "Specific Notification",
          message: "This is for fetching",
          type: "ALERT"
        },
        user
      );

      const fetchedNotification = await getNotification(notification._id);
      expect(fetchedNotification).toBeDefined();
      expect(fetchedNotification.message).toBe("This is for fetching");
    });

    it("fail_notification_not_found", async () => {
      const nonExistentNotificationId = "65ec0c2d7c6799001595badd";
      try {
        await getNotification(nonExistentNotificationId);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Notification not found");
      }
    });
  });

  describe("getNotifications", () => {
    it("success", async () => {
      const filters = {};
      const sorts = {};
      const page = 1;
      const limit = 10;

      const notifications = await getNotifications(filters, sorts, page, limit);
      expect(notifications).toBeDefined();
      expect(Array.isArray(notifications.docs)).toBe(true);
    });
  });

  describe("updateNotification", () => {
    it("success", async () => {
      const user = await createUser("Notification User", "notifyuser3@gmail.com", "USER");
      const notification = await addNotification(
        {
          receipt: user._id,
          title: "Update Notification",
          message: "Before update",
          type: "INFO"
        },
        user
      );

      const updatedNotification = await updateNotification(notification._id, {
        title: "Updated Notification",
        message: "After update"
      });
      expect(updatedNotification).toBeDefined();
      expect(updatedNotification.message).toBe("After update");
    });

    it("fail_notification_not_found", async () => {
      const nonExistentNotificationId = "65ec0c2d7c6799001595badd";
      try {
        await updateNotification(nonExistentNotificationId, {
          title: "Updated Notification",
          message: "Attempt to update non-existent notification"
        });
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Notification not found");
      }
    });
  });

  describe("clearNotification", () => {
    it("success", async () => {
      const user = await createUser("Notification User", "notifyuser4@gmail.com", "USER");
      const notification = await addNotification(
        {
          receipt: user._id,
          title: "Clear Notification",
          message: "This notification will be cleared",
          type: "INFO"
        },
        user
      );

      const clearedNotification = await clearNotification(notification._id);
      expect(clearedNotification).toBeDefined();
      expect(clearedNotification.is_active).toBe(false);
    });

    it("fail_notification_not_found", async () => {
      const nonExistentNotificationId = "65ec0c2d7c6799001595badd";
      try {
        await clearNotification(nonExistentNotificationId);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe("Notification not found");
      }
    });
  });

  describe("clearAllNotifications", () => {
    it("success", async () => {
      const user = await createUser("Notification User", "notifyuser5@gmail.com", "USER");
      await addNotification(
        {
          receipt: user._id,
          title: "Bulk Clear Notification 1",
          message: "Bulk clear test",
          type: "INFO"
        },
        user
      );
      await addNotification(
        {
          receipt: user._id,
          title: "Bulk Clear Notification 2",
          message: "Bulk clear test",
          type: "ALERT"
        },
        user
      );

      const result = await clearAllNotifications(user);
      expect(result).toBeDefined();
    });
  });
});
