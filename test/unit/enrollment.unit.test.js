import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createUser, createCourse } from "../util/repository";
import { addEnrollment, getEnrollment, getEnrollments, updateEnrollment, deleteEnrollment } from "../../src/service/enrollment.service";

describe("Enrollment Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addEnrollment", () => {
    it("success", async () => {
      const user = await createUser("Test Student", "student@example.com", "STUDENT");
      const course = await createCourse("CS101", "Intro to Computer Science", user);
      const enrollmentData = { student: user._id, course: course._id };

      const addedEnrollment = await addEnrollment(enrollmentData, user);
      expect(addedEnrollment).toBeDefined();
      expect(addedEnrollment.student.toString()).toEqual(user._id.toString());
      expect(addedEnrollment.course.toString()).toEqual(course._id.toString());
    });
  });

  describe("getEnrollment", () => {
    it("success", async () => {
      const user = await createUser("Test Student", "anotherstudent@example.com", "STUDENT");
      const course = await createCourse("CS102", "Data Structures", user);
      const enrollment = await addEnrollment({ student: user._id, course: course._id }, user);

      const foundEnrollment = await getEnrollment(enrollment._id);
      expect(foundEnrollment).toBeDefined();
      expect(foundEnrollment._id.toString()).toEqual(enrollment._id.toString());
    });

    it("fail_enrollment_not_found", async () => {
      const nonExistentEnrollmentId = "65ec0c2d7c6799001595badd";
      await expect(getEnrollment(nonExistentEnrollmentId)).rejects.toThrow("Enrollment not found");
    });
  });

  describe("getEnrollments", () => {
    it("success", async () => {
      const enrollments = await getEnrollments();
      expect(enrollments).toBeDefined();
      expect(Array.isArray(enrollments)).toBeTruthy();
    });
  });

  describe("updateEnrollment", () => {
    it("success", async () => {
      const user = await createUser("Test Student", "updatestudent@example.com", "STUDENT");
      const course = await createCourse("CS103", "Algorithms", user);
      const enrollment = await addEnrollment({ student: user._id, course: course._id }, user);

      const updatedEnrollment = await updateEnrollment(enrollment._id, { is_active: false });
      expect(updatedEnrollment).toBeDefined();
      expect(updatedEnrollment.is_active).toBeFalsy();
    });

    it("fail_enrollment_not_found", async () => {
      const invalidEnrollmentId = "65ec0c2d7c6799001595badd";
      await expect(updateEnrollment(invalidEnrollmentId, { is_active: false })).rejects.toThrow("Enrollment not found");
    });
  });

  describe("deleteEnrollment", () => {
    it("success", async () => {
      const user = await createUser("Test Student", "deletestudent@example.com", "STUDENT");
      const course = await createCourse("CS104", "Operating Systems", user);
      const enrollment = await addEnrollment({ student: user._id, course: course._id }, user);

      const deletedEnrollment = await deleteEnrollment(enrollment._id);
      expect(deletedEnrollment).toBeDefined();
      expect(deletedEnrollment.is_active).toBeFalsy();
    });

    it("fail_enrollment_not_found", async () => {
      const invalidEnrollmentId = "65ec0c2d7c6799001595badd";
      await expect(deleteEnrollment(invalidEnrollmentId)).rejects.toThrow("Enrollment not found");
    });
  });
});
