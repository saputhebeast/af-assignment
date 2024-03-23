import request from "supertest";

export const loginUserAndGetToken = async (app, email, password) => {
  const response = await request(app).post("/api/v1/auth/login").send({ email, password });

  if (response.body.data && response.body.data.access_token) {
    return response.body.data.access_token;
  }
  return null;
};
