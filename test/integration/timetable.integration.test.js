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

describe("Timetable Integration Tests", () => {
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

  describe("addTimetable", () => {
    it("should create a new timetable", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");
      const newCourse = {
        code: "CSA101",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science ASE" });
      const facultyId = faculty.body.data._id;

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

      const newTimetable = {
        title: "Introduction to Modern Art",
        event_type: "LECTURE",
        description: "A comprehensive overview of modern art trends and movements.",
        course: courseId,
        start_datetime: "2024-04-01T09:00:00Z",
        end_datetime: "2024-04-01T11:00:00Z",
        faculty: facultyId,
        classroom: classroomId
      };
      const response = await request(app).post("/api/v1/timetable").set("Authorization", `Bearer ${token}`).send(newTimetable);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Timetable added successfully");
    });

    it("should not create a new timetable without required fields", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");
      const invalidTimetable = {};

      const response = await request(app).post("/api/v1/timetable").set("Authorization", `Bearer ${token}`).send(invalidTimetable);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("getTimetables", () => {
    it("should retrieve all timetables", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/timetable").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Timetable retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getTimetable", () => {
    it("should retrieve a specific timetable", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSES101",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science ASDE" });
      const facultyId = faculty.body.data._id;

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

      const newTimetable = {
        title: "Introduction to Modern Art",
        event_type: "LECTURE",
        description: "A comprehensive overview of modern art trends and movements.",
        course: courseId,
        start_datetime: "2024-05-01T09:00:00Z",
        end_datetime: "2024-05-01T11:00:00Z",
        faculty: facultyId,
        classroom: classroomId
      };
      const timetable = await request(app).post("/api/v1/timetable").set("Authorization", `Bearer ${token}`).send(newTimetable);
      const timetableId = timetable.body.data._id;

      const response = await request(app).get(`/api/v1/timetable/${timetableId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Timetable retrieved successfully");
    });

    it("should return error for non-existent timetable", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get(`/api/v1/timetable/65fd3c660bb9e9c2cbd5c77d`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("updateTimetable", () => {
    it("should update a specific timetable", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSES1013",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science ASDE3" });
      const facultyId = faculty.body.data._id;

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

      const newTimetable = {
        title: "Introduction to Modern Art",
        event_type: "LECTURE",
        description: "A comprehensive overview of modern art trends and movements.",
        course: courseId,
        start_datetime: "2024-05-01T09:00:00Z",
        end_datetime: "2024-05-01T11:00:00Z",
        faculty: facultyId,
        classroom: classroomId
      };
      const timetable = await request(app).post("/api/v1/timetable").set("Authorization", `Bearer ${token}`).send(newTimetable);
      const timetableId = timetable.body.data._id;

      const updatedTimetable = {
        is_active: true
      };

      const response = await request(app).patch(`/api/v1/timetable/${timetableId}`).set("Authorization", `Bearer ${token}`).send(updatedTimetable);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Timetable updated successfully");
    });
  });

  describe("deleteTimetable", () => {
    it("should delete a specific timetable", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const newCourse = {
        code: "CSES1015",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science ASDE5" });
      const facultyId = faculty.body.data._id;

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

      const newTimetable = {
        title: "Introduction to Modern Art",
        event_type: "LECTURE",
        description: "A comprehensive overview of modern art trends and movements.",
        course: courseId,
        start_datetime: "2024-05-01T09:00:00Z",
        end_datetime: "2024-05-01T11:00:00Z",
        faculty: facultyId,
        classroom: classroomId
      };
      const timetable = await request(app).post("/api/v1/timetable").set("Authorization", `Bearer ${token}`).send(newTimetable);
      const timetableId = timetable.body.data._id;

      const response = await request(app).delete(`/api/v1/timetable/${timetableId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Timetable deleted successfully");
    });
  });
});
