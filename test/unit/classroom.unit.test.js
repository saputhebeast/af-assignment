import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createUser, createClassroom } from "../util/repository";
import { deleteClassroom, getClassroom, getClassrooms, updateClassroom } from "../../src/service/classroom.service";

describe("Classroom Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addClassroom", () => {
    it("success", async () => {
      const user = await createUser("Classroom Manager", "classroommanager_create@gmail.com", "ADMIN");
      const classroom = await createClassroom("101", "Engineering", 1, 30, [], user);
      expect(classroom).toBeDefined();
    });

    it("fail_classroom_already_exists", async () => {
      try {
        const user = await createUser("Classroom Manager", "classroommanager_create2@gmail.com", "ADMIN");
        await createClassroom("101", "Engineering", 1, 30, [], user);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual("Classroom already exists");
      }
    });
  });

  describe("getClassroom", () => {
    it("success", async () => {
      const user = await createUser("Classroom Manager", "classroommanager_getid@gmail.com", "ADMIN");
      const classroom = await createClassroom("102", "Science", 2, 25, [], user);
      expect(classroom).toBeDefined();
      expect(classroom.room_number).toBe("102");
    });

    it("fail_classroom_not_found", async () => {
      const nonExistentClassroomId = "65ec0c2d7c6799001595badd";
      try {
        await getClassroom(nonExistentClassroomId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Classroom not found");
      }
    });
  });

  describe("getClassrooms", () => {
    it("success", async () => {
      const classrooms = await getClassrooms();
      expect(classrooms).toBeDefined();
      expect(Array.isArray(classrooms)).toBe(true);
    });
  });

  describe("updateClassroom", () => {
    it("success", async () => {
      const user = await createUser("Classroom Manager", "classroommanager_update@gmail.com", "ADMIN");
      const classroom = await createClassroom("103", "Mathematics", 3, 20, [], user);
      const updatedClassroom = await updateClassroom(classroom["_id"], { floor: 2 });
      expect(updatedClassroom).toBeDefined();
      expect(updatedClassroom.floor).toBe(2);
    });

    it("fail_classroom_not_found", async () => {
      const invalidClassroomId = "65ec0c2d7c6799001595badd";
      try {
        await updateClassroom(invalidClassroomId, { floor: 4 });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Classroom not found");
      }
    });
  });

  describe("deleteClassroom", () => {
    it("success", async () => {
      const user = await createUser("Classroom Manager", "classroommanager_delete@gmail.com", "ADMIN");
      const classroom = await createClassroom("104", "History", 4, 15, [], user);
      const deletedClassroom = await deleteClassroom(classroom["_id"]);
      expect(deletedClassroom).toBeDefined();
      expect(deletedClassroom.is_active).toBe(false);
    });

    it("fail_classroom_not_found", async () => {
      const invalidClassroomId = "65ec0c2d7c6799001595badd";
      try {
        await deleteClassroom(invalidClassroomId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Classroom not found");
      }
    });
  });
});
