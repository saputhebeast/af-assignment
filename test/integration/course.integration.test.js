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

describe("Course Integration Tests", () => {
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

  describe("addCourse", () => {
    it("should create a new course", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSE101",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };

      const response = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Course added successfully");
      expect(response.body.data).toHaveProperty("name", "Introduction to Computer Science");
    });
  });

  describe("getCourses", () => {
    it("should retrieve all courses", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/course").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Courses retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getCourse", () => {
    it("should retrieve a specific course", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSE102",
        name: "Introduction to Computer Science 2",
        description: "A foundational course in computer science",
        credits: 3
      };

      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const response = await request(app).get(`/api/v1/course/${courseId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Course retrieved successfully");
    });
  });

  describe("updateCourse", () => {
    it("should update a specific course", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSE103",
        name: "Introduction to Computer Science 3",
        description: "A foundational course in computer science",
        credits: 3
      };

      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const updateData = {
        code: "IT2060",
        name: "Introduction to Programming",
        description: "You will learn basic things about the programming",
        credits: 4
      };

      const response = await request(app).patch(`/api/v1/course/${courseId}`).set("Authorization", `Bearer ${token}`).send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Course updated successfully");
    });
  });

  describe("deleteCourse", () => {
    it("should delete a specific course", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSE104",
        name: "Introduction to Computer Science 4",
        description: "A foundational course in computer science",
        credits: 3
      };

      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const response = await request(app).delete(`/api/v1/course/${courseId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Course deleted successfully");
    });
  });
});
