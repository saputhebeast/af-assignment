import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { deleteUser, getUser, getUsers, updateUser } from "../../src/service/user.service";
import { createUser } from "../util/repository";

describe("User Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addUser", () => {
    it("success", async () => {
      const response = await createUser("Super Admin", "superadmin_unique1@gmail.com", "ADMIN");
      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Object);
    });

    it("fail_email_already_exists", async () => {
      try {
        await createUser("Super Admin", "superadmin_unique2@gmail.com", "ADMIN");
        // Try to create user with the same email again
        await createUser("Super Admin", "superadmin_unique2@gmail.com", "ADMIN");
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual("User already exists");
      }
    });
  });

  describe("getUser", () => {
    it("success", async () => {
      const response = await createUser("Super Admin", "superadmin123@gmail.com", "ADMIN");
      const user = await getUser(response["_id"]);
      expect(user).toBeDefined();
      expect(user.name).toBe("Super Admin");
      expect(user.email).toBe("superadmin123@gmail.com");
    });

    it("fail_user_not_found", async () => {
      const nonExistentUserId = "65ec0c2d7c6799001595badd";
      try {
        await getUser(nonExistentUserId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("User not found");
      }
    });
  });

  describe("getUsers", () => {
    it("success", async () => {
      const users = await getUsers();
      expect(users).toBeDefined();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("updateUser", () => {
    it("success", async () => {
      const response = await createUser("Super Admin", "superadminupdate123@gmail.com", "ADMIN");
      const updatePayload = { name: "New Name" };
      const updatedUser = await updateUser(response["_id"], updatePayload);
      expect(updatedUser).toBeDefined();
      expect(updatedUser["name"]).toBe("New Name");
    });

    it("fail_user_not_found", async () => {
      const invalidUserId = "65ec0c2d7c6799001595badd";
      try {
        await updateUser(invalidUserId, { name: "New Name" });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("User not found");
      }
    });
  });

  describe("deleteUser", () => {
    it("success", async () => {
      const response = await createUser("Super Admin", "superadmindelete@gmail.com", "ADMIN");
      const deletedUser = await deleteUser(response["_id"]);
      expect(deletedUser).toBeDefined();
      expect(deletedUser["is_active"]).toBe(false);
    });

    it("fail_user_not_found", async () => {
      const invalidUserId = "65ec0c2d7c6799001595badd";
      try {
        await deleteUser(invalidUserId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("User not found");
      }
    });
  });
});
