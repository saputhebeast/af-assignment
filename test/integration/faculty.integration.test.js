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
describe("Faculty Integration Tests", () => {
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

  describe("addFaculty", () => {
    it("should create a new faculty", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science" });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Faculty added successfully");
      expect(response.body.data).toHaveProperty("name", "Faculty of Science");
    });
  });

  describe("getFaculties", () => {
    it("should retrieve all faculties", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/faculty").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Faculties retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getFaculty", () => {
    it("should retrieve a specific faculty", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science 1" });
      const facultyId = faculty.body.data._id;

      const response = await request(app).get(`/api/v1/faculty/${facultyId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Faculty retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", facultyId);
    });
  });

  describe("updateFaculty", () => {
    it("should update a specific faculty", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science 2" });
      const facultyId = faculty.body.data._id;

      const response = await request(app).patch(`/api/v1/faculty/${facultyId}`).set("Authorization", `Bearer ${token}`).send({ name: "Updated Faculty Name" });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Faculty updated successfully");
      expect(response.body.data).toHaveProperty("name", "Updated Faculty Name");
    });
  });

  describe("deleteFaculty", () => {
    it("should delete a specific faculty", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science 3" });
      const facultyId = faculty.body.data._id;

      const response = await request(app).delete(`/api/v1/faculty/${facultyId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Faculty deleted successfully");
    });
  });
});
