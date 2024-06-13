import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";
import { createUser, createResource } from "../util/repository";
import { deleteResource, getResource, getResources, updateResource } from "../../src/service/resource.service";

describe("Resource Unit Tests", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  describe("addResource", () => {
    it("success", async () => {
      const user = await createUser("Resource Manager", "resourcemanager_create@gmail.com", "ADMIN");
      const resource = await createResource("Projector", "HD Projector", 2, user);
      expect(resource).toBeDefined();
    });

    it("fail_resource_already_exists", async () => {
      try {
        const user = await createUser("Resource Manager", "resourcemanager_create2@gmail.com", "ADMIN");
        await createResource("Existing Projector", "Projector already in system", 1, user);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(error.message).toEqual("Resource already exists");
      }
    });
  });

  describe("getResource", () => {
    it("success", async () => {
      const user = await createUser("Resource Manager", "resourcemanager_getid@gmail.com", "ADMIN");
      const resource = await createResource("Laptop", "High-end laptop", 10, user);
      expect(resource).toBeDefined();
      expect(resource.name).toBe("Laptop");
    });

    it("fail_resource_not_found", async () => {
      const nonExistentResourceId = "65ec0c2d7c6799001595badd";
      try {
        await getResource(nonExistentResourceId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Resource not found");
      }
    });
  });

  describe("getResources", () => {
    it("success", async () => {
      const resources = await getResources();
      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
    });
  });

  describe("updateResource", () => {
    it("success", async () => {
      const user = await createUser("Resource Manager", "resourcemanager_update@gmail.com", "ADMIN");
      const resource = await createResource("Whiteboard", "Standard whiteboard", 5, user);
      const updatedResource = await updateResource(resource["_id"], { name: "Updated Whiteboard", quantity: 4 });
      expect(updatedResource).toBeDefined();
      expect(updatedResource.name).toBe("Updated Whiteboard");
    });

    it("fail_resource_not_found", async () => {
      const invalidResourceId = "65ec0c2d7c6799001595badd";
      try {
        await updateResource(invalidResourceId, { name: "Non-existent Resource" });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Resource not found");
      }
    });
  });

  describe("deleteResource", () => {
    it("success", async () => {
      const user = await createUser("Resource Manager", "resourcemanager_delete@gmail.com", "ADMIN");
      const resource = await createResource("Printer", "Office printer", 2, user);
      const deletedResource = await deleteResource(resource["_id"]);
      expect(deletedResource).toBeDefined();
      expect(deletedResource.is_active).toBe(false);
    });

    it("fail_resource_not_found", async () => {
      const invalidResourceId = "65ec0c2d7c6799001595badd";
      try {
        await deleteResource(invalidResourceId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toBe("Resource not found");
      }
    });
  });
});
