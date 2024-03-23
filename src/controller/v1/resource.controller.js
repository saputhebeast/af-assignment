import express from "express";
import { celebrate, Segments } from "celebrate";
import { traced, tracedAsyncHandler } from "@sliit-foss/functions";
import { default as filterQuery } from "@sliit-foss/mongoose-filter-query";
import { response } from "../../utils";
import { hasAnyRole } from "../../middleware";
import { addResourceSchema, updateResourceSchema } from "../../schema/resource.schema";
import { addResource, deleteResource, getResource, getResources, updateResource } from "../../service/resource.service";

const resource = express.Router();

resource.post(
  "/",
  hasAnyRole(["ADMIN"]),
  celebrate({ [Segments.BODY]: addResourceSchema }),
  tracedAsyncHandler(async function addCourseController(req, res) {
    const resource = await traced(addResource)(req.body);
    return response({ res, message: "Resource added successfully", data: resource });
  })
);

resource.get(
  "/",
  filterQuery,
  tracedAsyncHandler(async (req, res) => {
    const resource = await traced(getResources)(req.query.filter, req.query.sort, req.query.page, req.query.limit);
    return response({ res, message: "Resource retrieved successfully", data: resource });
  })
);

resource.get(
  "/:id",
  tracedAsyncHandler(async (req, res) => {
    const resource = await traced(getResource)(req.params.id);
    return response({ res, message: "Resource retrieved successfully", data: resource });
  })
);

resource.patch(
  "/:id",
  celebrate({ [Segments.BODY]: updateResourceSchema }),
  tracedAsyncHandler(async (req, res) => {
    const resource = await traced(updateResource)(req.params.id, req.body);
    return response({ res, message: "Resource updated successfully", data: resource });
  })
);

resource.delete(
  "/:id",
  hasAnyRole(["ADMIN"]),
  tracedAsyncHandler(async (req, res) => {
    const resource = await traced(deleteResource)(req.params.id);
    return response({ res, message: "Resource deleted successfully", data: resource });
  })
);

export default resource;
