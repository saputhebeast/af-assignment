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

describe("Classroom Integration Tests", () => {
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

  describe("addClassroom", () => {
    it("should create a new classroom", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newClassroom = {
        building: "Main Building",
        floor: 2,
        room_number: "201",
        capacity: 40,
        resources: [
          {
            name: "Projector",
            quantity: 1,
            description: "Full HD Projector"
          }
        ]
      };

      const response = await request(app).post("/api/v1/classroom").set("Authorization", `Bearer ${token}`).send(newClassroom);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Classroom added successfully");
      expect(response.body.data).toHaveProperty("building", "Main Building");
    });
  });

  describe("getClassrooms", () => {
    it("should retrieve all classrooms", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/classroom").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Classrooms retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getClassroom", () => {
    it("should retrieve a specific classroom", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newClassroom = {
        building: "Main Building",
        floor: 2,
        room_number: "201",
        capacity: 40,
        resources: [
          {
            name: "Projector",
            quantity: 1,
            description: "Full HD Projector"
          }
        ]
      };

      const classroom = await request(app).post("/api/v1/classroom").set("Authorization", `Bearer ${token}`).send(newClassroom);
      const classroomId = classroom.body.data._id;

      const response = await request(app).get(`/api/v1/classroom/${classroomId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Classroom retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", classroomId);
    });
  });

  describe("updateClassroom", () => {
    it("should update a specific classroom", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newClassroom = {
        building: "Main Building",
        floor: 2,
        room_number: "201",
        capacity: 40,
        resources: [
          {
            name: "Projector",
            quantity: 1,
            description: "Full HD Projector"
          }
        ]
      };

      const classroom = await request(app).post("/api/v1/classroom").set("Authorization", `Bearer ${token}`).send(newClassroom);
      const classroomId = classroom.body.data._id;

      const updateData = {
        building: "Updated Building",
        floor: 3,
        room_number: "303",
        capacity: 50
      };

      const response = await request(app).patch(`/api/v1/classroom/${classroomId}`).set("Authorization", `Bearer ${token}`).send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Classroom updated successfully");
      expect(response.body.data).toHaveProperty("building", "Updated Building");
    });
  });

  describe("deleteClassroom", () => {
    it("should delete a specific classroom", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newClassroom = {
        building: "Main Building",
        floor: 2,
        room_number: "201",
        capacity: 40,
        resources: [
          {
            name: "Projector",
            quantity: 1,
            description: "Full HD Projector"
          }
        ]
      };

      const classroom = await request(app).post("/api/v1/classroom").set("Authorization", `Bearer ${token}`).send(newClassroom);
      const classroomId = classroom.body.data._id;

      const response = await request(app).delete(`/api/v1/classroom/${classroomId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Classroom deleted successfully");
    });
  });
});
