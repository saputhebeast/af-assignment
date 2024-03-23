import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createFaculty, createUser } from "../util/repository";
import { deleteFaculty, getFaculties, getFaculty, updateFaculty } from "../../src/service/faculty.service";

describe("Faculty Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addFaculty", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmin@gmail.com", "ADMIN");
      const addedFaculty = await createFaculty("Faculty of Computing", user);
      expect(addedFaculty).toBeDefined();
    });

    it("fail_faculty_already_existing", async () => {
      const user = await createUser("Super Admin", "superadminsamefac@gmail.com", "ADMIN");
      try {
        // eslint-disable-next-line no-unused-vars
        const addedFaculty = await createFaculty("Faculty of Computing", user);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual("Faculty already exists");
      }
    });
  });

  describe("getFaculty", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadminadd@gmail.com", "ADMIN");
      const addedFaculty = await createFaculty("Faculty of Business", user);

      const response = await getFaculty(addedFaculty["_id"]);
      expect(response).toBeDefined();
      expect(response.name).toBe("Faculty of Business");
    });

    it("fail_faculty_not_found", async () => {
      const nonExistentFacultyId = "65ec0c2d7c6799001595badd";
      try {
        await getFaculty(nonExistentFacultyId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Faculty not found");
      }
    });
  });

  describe("getFaculties", () => {
    it("success", async () => {
      const faculties = await getFaculties();

      expect(faculties).toBeDefined();
      expect(Array.isArray(faculties)).toBe(true);
    });
  });

  describe("updateFaculty", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadminupdate@gmail.com", "ADMIN");
      const addedFaculty = await createFaculty("Faculty of SE", user);

      const payload = {
        name: "Faculty of Software Engineering"
      };

      const response = await updateFaculty(addedFaculty["_id"], payload);
      expect(response).toBeDefined();
      expect(response.name).toBe("Faculty of Software Engineering");
    });

    it("fail_faculty_not_found", async () => {
      const invalidUserId = "65ec0c2d7c6799001595badd";
      try {
        const payload = {
          name: "Faculty of Software Engineering"
        };
        await updateFaculty(invalidUserId, payload);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Faculty not found");
      }
    });
  });

  describe("deleteFaculty", () => {
    it("success", async () => {
      const user = await createUser("Super Admin", "superadmindeletefac@gmail.com", "ADMIN");
      const addedFaculty = await createFaculty("Faculty of Delete", user);

      const deletedFaculty = await deleteFaculty(addedFaculty["_id"]);
      expect(deletedFaculty).toBeDefined();
      expect(deletedFaculty["is_active"]).toBe(false);
    });

    it("fail_faculty_not_found", async () => {
      const invalidFacultyId = "65ec0c2d7c6799001595badd";
      try {
        await deleteFaculty(invalidFacultyId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Faculty not found");
      }
    });
  });
});
