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

describe("Booking Integration Tests", () => {
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

  describe("addBooking", () => {
    it("should create a new booking", async () => {
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

      const newCourse = {
        code: "CSE101",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science" });
      const facultyId = faculty.body.data._id;

      const newBooking = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroomId,
        course: courseId,
        faculty: facultyId,
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };

      const response = await request(app).post("/api/v1/booking").set("Authorization", `Bearer ${token}`).send(newBooking);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Booking added successfully");
      expect(response.body.data).toHaveProperty("title", "AF Lecture");
    });
  });

  describe("getBookings", () => {
    it("should retrieve all bookings", async () => {
      const token = await loginUserAndGetToken(app, "sapumalwijekoon4@gmail.com", "test@123");

      const response = await request(app).get("/api/v1/booking").set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Bookings retrieved successfully");
      expect(Array.isArray(response.body.data)).toBeTruthy();
    });
  });

  describe("getBooking", () => {
    it("should retrieve a specific booking", async () => {
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

      const newCourse = {
        code: "COE701",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science and Technology" });
      const facultyId = faculty.body.data._id;

      const newBooking = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroomId,
        course: courseId,
        faculty: facultyId,
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };

      const booking = await request(app).post("/api/v1/booking").set("Authorization", `Bearer ${token}`).send(newBooking);
      const bookingId = booking.body.data._id;

      const response = await request(app).get(`/api/v1/booking/${bookingId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Booking retrieved successfully");
      expect(response.body.data).toHaveProperty("_id", bookingId);
    });
  });

  describe("updateBookingStatus", () => {
    it("should update the status of a specific booking", async () => {
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

      const newCourse = {
        code: "COE711",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science and Technology 2" });
      const facultyId = faculty.body.data._id;

      const newBooking = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroomId,
        course: courseId,
        faculty: facultyId,
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };

      const booking = await request(app).post("/api/v1/booking").set("Authorization", `Bearer ${token}`).send(newBooking);
      const bookingId = booking.body.data._id;

      const reviewStatus = {
        booking_status: "APPROVED"
      };

      const response = await request(app).patch(`/api/v1/booking/review/${bookingId}`).set("Authorization", `Bearer ${token}`).send(reviewStatus);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Booking updated successfully");
    });
  });

  describe("deleteBooking", () => {
    it("should delete a specific booking", async () => {
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

      const newCourse = {
        code: "COE715",
        name: "Introduction to Computer Science",
        description: "A foundational course in computer science",
        credits: 3
      };
      const course = await request(app).post("/api/v1/course").set("Authorization", `Bearer ${token}`).send(newCourse);
      const courseId = course.body.data._id;

      const faculty = await request(app).post("/api/v1/faculty").set("Authorization", `Bearer ${token}`).send({ name: "Faculty of Science and Technology 3" });
      const facultyId = faculty.body.data._id;

      const newBooking = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroomId,
        course: courseId,
        faculty: facultyId,
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };

      const booking = await request(app).post("/api/v1/booking").set("Authorization", `Bearer ${token}`).send(newBooking);
      const bookingId = booking.body.data._id;

      const response = await request(app).delete(`/api/v1/booking/${bookingId}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Booking deleted successfully");
    });
  });
});
