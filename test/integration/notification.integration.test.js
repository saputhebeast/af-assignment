import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import express from "express";
import request from "supertest";
import context from "express-http-context";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import routes from "../../src/routes";
import { authorizer, errorHandler, resourceNotFoundHandler } from "../../src/middleware";
import { loginUserAndGetToken } from "../util/token";

let app;
describe("Notification Integration Tests", () => {
  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(context.middleware);
    await connectMongo();
    app.use("/api", authorizer, routes);
    app.use(resourceNotFoundHandler);
    app.use(errorHandler);
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addNotification", () => {
    it("should create a new notification", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe 2",
        email: "johndoe2@example.com",
        password: "password123",
        role: "ADMIN"
      };
      const newUserResponse = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const receipt = newUserResponse.body.data._id;

      const newNotification = {
        receipt: receipt,
        title: "New Feature",
        message: "Check out this cool new feature.",
        type: "info"
      };

      const response = await request(app).post("/api/v1/notification").set("Authorization", `Bearer ${token}`).send(newNotification);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Notification added successfully");
      expect(response.body.data).toHaveProperty("title", "New Feature");
    });
  });

  describe("getNotifications", () => {
    it("should retrieve all notifications", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/notification").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Notifications retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getNotification", () => {
    it("should retrieve a specific notification", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe 3",
        email: "johndoe3@example.com",
        password: "password123",
        role: "ADMIN"
      };
      const newUserResponse = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const receipt = newUserResponse.body.data._id;

      const newNotification = {
        receipt: receipt,
        title: "New Feature",
        message: "Check out this cool new feature.",
        type: "info"
      };

      const notification = await request(app).post("/api/v1/notification").set("Authorization", `Bearer ${token}`).send(newNotification);
      const notificationId = notification.body.data._id;

      const response = await request(app).get(`/api/v1/notification/${notificationId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Notification retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", notificationId);
    });
  });

  describe("deleteNotifications", () => {
    it("should clear all notifications", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).delete("/api/v1/notification").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Notifications deleted successfully");
    });
  });
});
