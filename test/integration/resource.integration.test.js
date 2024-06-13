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

describe("Resource Integration Tests", () => {
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

  describe("addResource", () => {
    it("should create a new resource", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newResource = {
        name: "Computer",
        quantity: 10,
        description: "A personal computer for lab use"
      };

      const response = await request(app).post("/api/v1/resource").set("Authorization", `Bearer ${token}`).send(newResource);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Resource added successfully");
      expect(response.body.data).toHaveProperty("name", "Computer");
    });
  });

  describe("getResources", () => {
    it("should retrieve all resources", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/resource").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Resource retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getResource", () => {
    it("should retrieve a specific resource", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newResource = {
        name: "Computer",
        quantity: 10,
        description: "A personal computer for lab use"
      };

      const resource = await request(app).post("/api/v1/resource").set("Authorization", `Bearer ${token}`).send(newResource);
      const resourceId = resource.body.data._id;

      const response = await request(app).get(`/api/v1/resource/${resourceId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Resource retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", resourceId);
    });
  });

  describe("updateResource", () => {
    it("should update a specific resource", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newResource = {
        name: "Computer",
        quantity: 10,
        description: "A personal computer for lab use"
      };

      const resource = await request(app).post("/api/v1/resource").set("Authorization", `Bearer ${token}`).send(newResource);
      const resourceId = resource.body.data._id;

      const updateData = {
        name: "Updated Resource",
        quantity: 5,
        description: "Updated description"
      };

      const response = await request(app).patch(`/api/v1/resource/${resourceId}`).set("Authorization", `Bearer ${token}`).send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Resource updated successfully");
      expect(response.body.data).toHaveProperty("name", "Updated Resource");
    });
  });

  describe("deleteResource", () => {
    it("should delete a specific resource", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newResource = {
        name: "Computer",
        quantity: 10,
        description: "A personal computer for lab use"
      };

      const resource = await request(app).post("/api/v1/resource").set("Authorization", `Bearer ${token}`).send(newResource);
      const resourceId = resource.body.data._id;

      const response = await request(app).delete(`/api/v1/resource/${resourceId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Resource deleted successfully");
    });
  });
});
