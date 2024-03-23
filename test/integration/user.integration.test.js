import { afterAll, beforeAll, describe, it } from "@jest/globals";
import express from "express";
import request from "supertest";
import user from "../../src/controller/v1/user.controller";
import { connectMongo } from "../util/connect";
import { disconnectMongo } from "../util/disconnect";

let app;

describe('User Integration Tests', () => {

    beforeAll(async () => {
        await connectMongo();
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/api/v1/user', user);
    });

    afterAll(async () => {
        await disconnectMongo();
    });

    it('should return 200 for /v1/user route', async () => {
        const response = await request(app).get('/api/v1/user/65ec0c2d7c6799001595badd').expect(404);
        console.log(response);
    }, 20000);
});
