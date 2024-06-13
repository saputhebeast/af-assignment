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

describe("User Integration Tests", () => {
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

  describe("createUser", () => {
    it("success", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe",
        email: "johndoe1@example.com",
        password: "password123",
        role: "ADMIN"
      };
      const response = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);

      expect(response.body).toHaveProperty("message", "User added successfully");
    });
  });

  describe("getUser", () => {
    it("should retrieve a user successfully", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");
      const newUser = {
        name: "John Doe 2",
        email: "johndoe2@example.com",
        password: "password123",
        role: "ADMIN"
      };
      const newUserResponse = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const userId = newUserResponse.body.data._id;

      const response = await request(app).get(`/api/v1/user/${userId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", userId);
    });
  });

  describe("getUsers", () => {
    it("should retrieve all users successfully", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/user").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Users retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const newUser = {
        name: "John Doe 3",
        email: "johndoe3@example.com",
        password: "password123",
        role: "ADMIN"
      };

      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUserResponse = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const userId = newUserResponse.body.data._id;

      const updateData = {
        name: "Updated User"
      };

      const response = await request(app).patch(`/api/v1/user/${userId}`).set("Authorization", `Bearer ${token}`).send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const newUser = {
        name: "John Doe 4",
        email: "johndoe4@example.com",
        password: "password123",
        role: "ADMIN"
      };

      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUserResponse = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const userId = newUserResponse.body.data._id;

      const response = await request(app).delete(`/api/v1/user/${userId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");
    });
  });
});
