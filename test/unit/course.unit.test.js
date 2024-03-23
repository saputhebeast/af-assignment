import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createUser, createCourse } from "../util/repository";
import { deleteCourse, getCourse, getCourses, updateCourse } from "../../src/service/course.service";

describe("Course Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addCourse", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmin_create@gmail.com", "ADMIN");
      const course = await createCourse("IT2100", "IP", user);
      expect(course).toBeDefined();
    });

    it("fail_course_code_already_exists", async () => {
      try {
        const user = await createUser("Super Admin", "superadmin_create2@gmail.com", "ADMIN");
        // eslint-disable-next-line no-unused-vars
        const course = await createCourse("IT2200", "CS", user);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual("Course code already exists");
      }
    });
  });

  describe("getCourse", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmin_getid@gmail.com", "ADMIN");
      const course = await createCourse("IT2300", "IPS", user);
      expect(course).toBeDefined();
      expect(course.code).toBe("IT2300");
      expect(course.name).toBe("IPS");
    });

    it("fail_user_not_found", async () => {
      const nonExistentCourseId = "65ec0c2d7c6799001595badd";
      try {
        await getCourse(nonExistentCourseId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Course not found");
      }
    });
  });

  describe("getCourses", () => {
    it("success", async () => {
      const courses = await getCourses();
      expect(courses).toBeDefined();
      expect(Array.isArray(courses)).toBe(true);
    });
  });

  describe("updateCourse", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmin_update_course@gmail.com", "ADMIN");
      const course = await createCourse("IT2700", "IPF", user);
      const updatedCourse = await updateCourse(course["_id"], { name: "UPDATED" });
      expect(updatedCourse).toBeDefined();
      expect(updatedCourse["name"]).toBe("UPDATED");
    });

    it("fail_user_not_found", async () => {
      const invalidCourseId = "65ec0c2d7c6799001595badd";
      try {
        await updateCourse(invalidCourseId, { name: "New Name" });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Course not found");
      }
    });
  });

  describe("deleteCourse", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmin_delete_course@gmail.com", "ADMIN");
      const course = await createCourse("IT2800", "IPM", user);

      const deletedCourse = await deleteCourse(course["_id"]);
      expect(deletedCourse).toBeDefined();
      expect(deletedCourse["is_active"]).toBe(false);
    });

    it("fail_course_not_found", async () => {
      const invalidCourseId = "65ec0c2d7c6799001595badd";
      try {
        await deleteCourse(invalidCourseId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Course not found");
      }
    });
  });
});
