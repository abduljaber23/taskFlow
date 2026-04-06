import supertest from "supertest";
import app from "../../src/app";
import databaseClient from "../../database/client";
import jwt from "jsonwebtoken";

import type { Result, Rows } from "../../database/client";

// Restore all mocked functions after each test
afterEach(() => {
  jest.restoreAllMocks();
});

// Test suite for the GET /api/users route
describe("GET /api/users", () => {
  it("should fetch users successfully", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    // Mock jwt.verify so the verifyToken middleware passes
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Send a GET request to the /api/users endpoint
    const response = await supertest(app)
      .get("/api/users")
      .set("Authorization", "Bearer dummy-token");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows);
  });

  it("should fail without token", async () => {
    const response = await supertest(app).get("/api/users");
    expect(response.status).toBe(401);
  });
});

// Test suite for the GET /api/users/:uuid route
describe("GET /api/users/:uuid", () => {
  it("should fetch a single user successfully", async () => {
    // Mock rows returned from the database
    const rows = [{ uuid: "test-uuid", username: "testuser" }] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Send a GET request to the /api/users/:uuid endpoint
    const response = await supertest(app)
      .get("/api/users/test-uuid")
      .set("Authorization", "Bearer dummy-token");

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(rows[0]);
  });

  it("should fail on invalid user (not found)", async () => {
    // Mock empty rows returned from the database
    const rows = [] as Rows;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Send a GET request to the /api/users/:uuid endpoint
    const response = await supertest(app)
      .get("/api/users/unknown-uuid")
      .set("Authorization", "Bearer dummy-token");

    // Assertions
    expect(response.status).toBe(404);
  });
});

// Test suite for the GET /api/users/profile route
describe("GET /api/users/profile", () => {
  it("should fetch user profile successfully", async () => {
    // Mock rows returned from the database
    const rows = [{ uuid: "test-uuid", username: "testuser" }] as Rows;

    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [rows, []]);

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    const response = await supertest(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer dummy-token");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ userUuid: "test-uuid", role: "user" });
  });
});

// Test suite for the PUT /api/users/:uuid route
describe("PUT /api/users/:uuid", () => {
  it("should update an existing user successfully", async () => {
    // Mock result of the database query
    const result = { affectedRows: 1 } as Result;

    // Mock the implementation of the database query method
    jest
      .spyOn(databaseClient, "query")
      .mockImplementation(async () => [result, []]);
    jest
      .spyOn(databaseClient, "execute")
      .mockImplementation(async () => [result, []]);

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Fake user data
    const fakeUserData = { username: "updatedUser" };

    // Send a PUT request
    const response = await supertest(app)
      .put("/api/users/test-uuid")
      .set("Authorization", "Bearer dummy-token")
      .send(fakeUserData);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  it("should fail on invalid id (forbidden) when uuid doesn't match token", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "another-uuid",
      role: "user",
    }));

    const response = await supertest(app)
      .put("/api/users/test-uuid")
      .set("Authorization", "Bearer dummy-token")
      .send({ username: "foo" });

    // Assuming userController.edit returns 403 on mismatch (as seen in user.test.ts)
    expect(response.status).toBe(403);
  });
});

// Test suite for the DELETE /api/users/:uuid route
describe("DELETE /api/users/:uuid", () => {
  it("should delete an existing user successfully", async () => {
    // Mock finding the user
    jest.spyOn(databaseClient, "query").mockImplementation(async (sql) => {
      const sqlString = String(sql);
      if (sqlString.includes("SELECT")) {
        return [[{ uuid: "test-uuid", username: "testuser" } as any], []];
      }
      return [{ affectedRows: 1 } as Result, []];
    });

    jest.spyOn(databaseClient, "execute").mockImplementation(async () => {
      return [{ affectedRows: 1 } as Result, []];
    });

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Send a DELETE request
    const response = await supertest(app)
      .delete("/api/users/test-uuid")
      .set("Authorization", "Bearer dummy-token");

    // Assertions
    expect(response.status).toBe(200);
  });

  it("should return 404 if user not found", async () => {
    // Mock finding the user returning empty array
    jest.spyOn(databaseClient, "query").mockImplementation(async (sql) => {
      const sqlString = String(sql);
      if (sqlString.includes("SELECT")) {
        return [[], []];
      }
      return [{ affectedRows: 0 } as Result, []];
    });

    jest.spyOn(databaseClient, "execute").mockImplementation(async () => {
      return [{ affectedRows: 0 } as Result, []];
    });

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      userUuid: "test-uuid",
      role: "user",
    }));

    // Send a DELETE request
    const response = await supertest(app)
      .delete("/api/users/test-uuid")
      .set("Authorization", "Bearer dummy-token");

    // Assertions
    expect(response.status).toBe(404);
  });
});


// vocabulary:
//  - mockImplementation : simuler l'implémentation d'une fonction
//  - jest.spyOn : espionner une fonction pour vérifier son comportement
//  -  jest.spyOn(databaseClient, "execute").mockImplementation(async () => {
      // return [{ affectedRows: 0 } as Result, []];
    // }); : simuler l'implémentation de la méthode execute du databaseClient pour retourner un résultat spécifique
//  - expect(response.status).toBe(200) : vérifier que le code de statut de la réponse est 200
//  - expect(response.body).toStrictEqual(rows) : vérifier que le corps de la réponse correspond exactement à l'objet rows
//  - expect(response.body).toBeInstanceOf(Object) : vérifier que le corps de la réponse est une instance d'Object
//  - expect(response.status).toBe(401) : vérifier que le code de statut de la réponse est 401 (Unauthorized)
//  - expect(response.status).toBe(404) : vérifier que le code de statut de la réponse est 404 (Not Found)
//  - expect(response.status).toBe(403) : vérifier que le code de statut de la réponse est 403 (Forbidden)
//  - expect(response.body).toStrictEqual({ userUuid: "test-uuid", role: "user" }) : vérifier que le corps de la réponse correspond exactement à l'objet { userUuid: "test-uuid", role: "user" }
//  - expect(response.body).toBeInstanceOf(Object) : vérifier que le corps de la réponse est une instance d'Object