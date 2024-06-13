import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { addBooking, deleteBooking, getBooking, updateBookingStatus } from "../../src/service/booking.service";
import { createUser, createClassroom, createCourse, createFaculty } from "../util/repository";

describe("Booking Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addBooking - Comprehensive Scenarios", () => {
    it("should add a NOT_FULL_DAY booking successfully", async () => {
      const user = await createUser("Booking Admin", `bookingadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Science", user);
      const classroom = await createClassroom("101", "B801", 1, 100, [], user);
      const course = await createCourse("SCI101", "Science Basics", user);

      const bookingData = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };

      const booking = await addBooking(bookingData, user);
      expect(booking).toBeDefined();
      expect(booking.title).toBe("AF Lecture");
    });

    it("should add a FULL_DAY booking successfully", async () => {
      const user = await createUser("Booking Admin", `bookingadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Full Day", user);
      const classroom = await createClassroom("F101", "B801", 1, 100, [], user);
      const course = await createCourse("SCI103", "Full Science Basics", user);

      const bookingData = {
        title: "AF Competition",
        event_type: "LECTURE",
        description: "AF Competition for 1st year students",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T18:00:00.000Z",
        recurring: false
      };

      const booking = await addBooking(bookingData, user);
      expect(booking).toBeDefined();
      expect(booking.booking_type).toBe("FULL_DAY");
    });

    it("should add a recurring booking successfully", async () => {
      const user = await createUser("Booking Admin", `bookingadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Science Rec", user);
      const classroom = await createClassroom("101", "B801", 1, 100, [], user);
      const course = await createCourse("SCI104", "Science Basics Rec", user);

      const bookingData = {
        title: "AF Conference",
        event_type: "EVENT",
        description: "AF Conference for AF Enthusiasts",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "FULL_DAY",
        start_datetime: "2024-05-20T21:29:00.000Z",
        end_datetime: "2024-05-20T22:29:00.000Z",
        recurring: true,
        recurring_type: "WEEKLY",
        recurring_from: "2024-03-20T21:29:00.000Z",
        recurring_to: "2024-04-20T21:29:00.000Z"
      };

      const booking = await addBooking(bookingData, user);
      expect(booking).toBeDefined();
      expect(booking.recurring).toBeTruthy();
      expect(booking.recurring_type).toBe("WEEKLY");
    });

    it("should reject a booking exceeding time limit for NOT_FULL_DAY", async () => {
      const user = await createUser("Booking Admin", `bookingadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Science Ex", user);
      const classroom = await createClassroom("105", "B801", 1, 100, [], user);
      const course = await createCourse("SCI105", "Science Basics Ex", user);

      const bookingData = {
        title: "Long Duration Class",
        event_type: "LECTURE",
        description: "A long lecture that exceeds the allowed duration.",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T13:00:00.000Z",
        recurring: false
      };

      await expect(addBooking(bookingData, user)).rejects.toThrow("Non-full-day booking time difference exceeds the maximum limit of 4 hours");
    });
  });

  describe("getBooking", () => {
    it("success", async () => {
      const user = await createUser("Booking Admin", `bookingadminget${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Science Get", user);
      const classroom = await createClassroom("601", "B601", 1, 100, [], user);
      const course = await createCourse("SCI601", "Science Basics Get", user);

      const bookingData = {
        title: "AF Lecture",
        event_type: "LECTURE",
        description: "Application Frameworks lecture for the 3rd year 2nd semester students.",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "NOT_FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T10:00:00.000Z",
        recurring: false
      };
      const bookingRequest = await addBooking(bookingData, user);

      const booking = await getBooking(bookingRequest._id);
      expect(booking).toBeDefined();
      expect(booking.booking_type).toBe("NOT_FULL_DAY");
    });

    it("fail_booking_not_found", async () => {
      const nonExistentBookingId = "65ec0c2d7c6799001595badd";
      await expect(getBooking(nonExistentBookingId.toString())).rejects.toThrow("Booking not found");
    });
  });

  describe("updateBookingStatus", () => {
    it("success", async () => {
      const user = await createUser("Booking Admin", `bookingupdateadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Full Day Update", user);
      const classroom = await createClassroom("F109", "B809", 1, 100, [], user);
      const course = await createCourse("SCI109", "Full Science Update", user);

      const bookingData = {
        title: "AF Competition",
        event_type: "LECTURE",
        description: "AF Competition for 1st year students",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T18:00:00.000Z",
        recurring: false
      };

      const bookingToUpdate = await addBooking(bookingData, user);
      await updateBookingStatus(bookingToUpdate._id, { booking_status: "APPROVED" });

      const updatedBooking = await getBooking(bookingToUpdate._id);
      expect(updatedBooking.booking_status).toBe("APPROVED");
    });

    it("fail_booking_not_found", async () => {
      const nonExistentBookingId = "65ec0c2d7c6799001595badd";
      await expect(updateBookingStatus(nonExistentBookingId.toString(), { booking_status: "APPROVED" })).rejects.toThrow("Booking not found");
    });
  });

  describe("deleteBooking", () => {
    it("success", async () => {
      const user = await createUser("Booking Admin", `bookingdeleteadmin${Date.now()}@example.com`, "ADMIN");
      const faculty = await createFaculty("Faculty of Full Day Delete", user);
      const classroom = await createClassroom("F209", "B209", 1, 100, [], user);
      const course = await createCourse("SCI209", "Full Science Delete", user);

      const bookingData = {
        title: "AF Competition",
        event_type: "LECTURE",
        description: "AF Competition for 1st year students",
        classroom: classroom._id.toString(),
        course: course._id.toString(),
        faculty: faculty._id.toString(),
        booking_type: "FULL_DAY",
        start_datetime: "2024-03-26T08:00:00.000Z",
        end_datetime: "2024-03-26T18:00:00.000Z",
        recurring: false
      };
      const bookingToDelete = await addBooking(bookingData, user);

      await deleteBooking(bookingToDelete._id);

      const updatedBooking = await getBooking(bookingToDelete._id);
      expect(updatedBooking.is_active).toBe(false);
      expect(updatedBooking.booking_status).toBe("DELETED");
    });

    it("fail_booking_not_found", async () => {
      const nonExistentBookingId = "65ec0c2d7c6799001595badd";
      await expect(deleteBooking(nonExistentBookingId.toString())).rejects.toThrow("Booking not found");
    });
  });
});
