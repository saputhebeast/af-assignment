import { tracedAsyncHandler } from "@sliit-foss/functions";
import context from "express-http-context";
import { errors, verify } from "../utils";
import { retrievedUserById } from "../repository/user.repository";
import config from "../config";

const whitelistedRoutes = ["/v1/auth/login", "/v1/auth/verify", "/v1/auth/register", "/v1/auth/refresh-token", "/v1/health"];

export const authorizer = tracedAsyncHandler(async function authorizer(req) {
  if (whitelistedRoutes.find((route) => req.path.match(new RegExp(route)))) {
    return;
  }
  const token = req.headers.authorization?.replace("Bearer ", "")?.replace("null", "");
  if (!token) {
    throw errors.missing_token;
  }
  const decodedUser = verify(token);
  const user = await retrievedUserById(decodedUser._id);
  if (!user) {
    throw errors.invalid_token;
  }
  context.set("user", user);
});

export const hasAnyRole = (roles) => {
  return (req, res, next) => {
    // if (config.APP_ENV === "test") {
    //   return next();
    // }
    const user = context.get("user");
    if (!user || !user.role || !roles.includes(user.role)) {
      throw errors.invalid_permission;
    }
    next();
  };
};
