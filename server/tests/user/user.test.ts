import jwt from "jsonwebtoken";
import supertest from "supertest";
import databaseClient from "../../database/client";
import type { Result, Rows } from "../../database/client";
import app from "../../src/app";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("GET /api/users", () => {
  it("should fetch users successfully", async () => {
    process.env.JWT_SECRET = "testsecret";

    const rows = [] as Rows;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    const token = jwt.sign(
      {
        userUuid: "test-uuid",
        email: "test@test.com",
        username: "test",
        role: "user",
      },
      process.env.JWT_SECRET,
    );

    const response = await supertest(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });
});

describe("GET /api/users/:uuid", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  it("should fetch a single user successfully", async () => {
    const rows = [{}] as Rows;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    const token = jwt.sign(
      {
        userUuid: "test-uuid",
        email: "test@test.com",
        username: "test",
        role: "user",
      },
      process.env.JWT_SECRET as string,
    );

    const response = await supertest(app)
      .get("/api/users/9db693d9-0051-48bf-98be-3a876874c167")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows[0]);
  });

  it("should fail on invalid id", async () => {
    const rows = [] as Rows;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    const token = jwt.sign(
      {
        userUuid: "test-uuid",
        email: "test@test.com",
        username: "test",
        role: "user",
      },
      process.env.JWT_SECRET as string,
    );

    const response = await supertest(app)
      .get("/api/users/invalid-uuid")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found", status: 404 });
  });
});

describe("POST /api/users", () => {
  it("should add a new user successfully", async () => {
    const result = { insertId: 1 } as Result;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);

    const fakeItem = { email: "foo", username: "foo", password: "foo" };

    const response = await supertest(app)
      .post("/api/auth/register")
      .send(fakeItem);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Utilisateur crear avec succés!",
      userId: result.insertId,
    });
  });

  it("should fail on invalid request body", async () => {
    const fakeUser = { username: "foo", password: "foo" };

    const response = await supertest(app)
      .post("/api/auth/register")
      .send(fakeUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Tous les champs ne sont pas remplis",
    });
  });
});
