import { traced } from "@sliit-foss/functions";
import { saveUser, retrievedUserById, retrieveUsers, updateUserById, deleteUserById, retrievedUserByEmail } from "../repository/user.repository";
import { errors, hashPassword } from "../utils";

export const addUser = async (user) => {
  user.password = await hashPassword(user.password);

  const dbUser = await traced(retrievedUserByEmail)(user.email);
  if (dbUser) {
    throw errors.user_already_exists;
  }

  return traced(saveUser)(user);
};

export const getUser = async (id) => {
  const user = await traced(retrievedUserById)(id);
  if (user === null) {
    throw errors.user_not_found;
  }
  return user;
};

export const getUsers = (filters, sorts, page, limit) => {
  return traced(retrieveUsers)(filters, sorts, page, limit);
};

export const updateUser = async (id, payload) => {
  const user = await traced(retrievedUserById)(id);
  if (user === null) {
    throw errors.user_not_found;
  }
  return traced(updateUserById)(id, payload);
};

export const deleteUser = async (id) => {
  const user = await traced(retrievedUserById)(id);
  if (user === null) {
    throw errors.user_not_found;
  }
  return traced(deleteUserById)(id);
};
