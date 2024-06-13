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

describe("Enrollment Integration Tests", () => {
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

  describe("addEnrollment", () => {
    it("should create a new enrollment", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe",
        email: "johndoestudnet1@example.com",
        password: "password123",
        role: "STUDENT"
      };
      const student = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const studentId = student.body.data._id;

      const newCourse = {
        code: "CSC101",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const newEnrollment = {
        student: studentId,
        course: courseId
      };

      const response = await request(app).post("/api/v1/enrollment").set("Authorization", `Bearer ${token}`).send(newEnrollment);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Enrollment added successfully");
      expect(response.body.data).toHaveProperty("student", newEnrollment.student);
      expect(response.body.data).toHaveProperty("course", newEnrollment.course);
    });
  });

  describe("getEnrollments", () => {
    it("should retrieve all enrollments", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/enrollment").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Enrollments retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getEnrollment", () => {
    it("should retrieve a specific enrollment", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe",
        email: "johndoestd32@example.com",
        password: "password123",
        role: "STUDENT"
      };
      const student = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const studentId = student.body.data._id;

      const newCourse = {
        code: "CSC201",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const newEnrollment = {
        student: studentId,
        course: courseId
      };

      const enrollment = await request(app).post("/api/v1/enrollment").set("Authorization", `Bearer ${token}`).send(newEnrollment);
      const enrollmentId = enrollment.body.data._id;

      const response = await request(app).get(`/api/v1/enrollment/${enrollmentId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Enrollment retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", enrollmentId);
    });
  });

  describe("updateEnrollment", () => {
    it("should update a specific enrollment", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe",
        email: "johndoe323std4@example.com",
        password: "password123",
        role: "STUDENT"
      };
      const student = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const studentId = student.body.data._id;

      const newCourse = {
        code: "CSC401",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const newEnrollment = {
        student: studentId,
        course: courseId
      };

      const enrollment = await request(app).post("/api/v1/enrollment").set("Authorization", `Bearer ${token}`).send(newEnrollment);
      const enrollmentId = enrollment.body.data._id;

      const updateData = {
        student: studentId,
        course: courseId
      };

      const response = await request(app).patch(`/api/v1/enrollment/${enrollmentId}`).set("Authorization", `Bearer ${token}`).send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Enrollment updated successfully");
      expect(response.body.data).toHaveProperty("student", updateData.student);
      expect(response.body.data).toHaveProperty("course", updateData.course);
    });
  });

  describe("deleteEnrollment", () => {
    it("should delete a specific enrollment", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newUser = {
        name: "John Doe",
        email: "johndoe3sdaf23429@example.com",
        password: "password123",
        role: "STUDENT"
      };
      const student = await request(app).post("/api/v1/user").set("Authorization", `Bearer ${token}`).send(newUser);
      const studentId = student.body.data._id;

      const newCourse = {
        code: "CSC091",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const newEnrollment = {
        student: studentId,
        course: courseId
      };

      const enrollment = await request(app).post("/api/v1/enrollment").set("Authorization", `Bearer ${token}`).send(newEnrollment);
      const enrollmentId = enrollment.body.data._id;

      const response = await request(app).delete(`/api/v1/enrollment/${enrollmentId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Enrollment deleted successfully");
    });
  });
});
