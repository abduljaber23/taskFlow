import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../../src/middlewares/verifyToken";

import projectController from "../../../src/modules/project/projectController";
import projectRepository from "../../../src/modules/project/projectRepository";

jest.mock("../../../src/modules/project/projectRepository");

// mock de la classe
const mockedRepo = projectRepository as jest.MockedClass<
  typeof projectRepository
>;

const mockRequest = (data: Partial<AuthRequest> = {}): AuthRequest =>
  ({
    body: {},
    params: {},
    user: undefined,
    ...data,
  }) as AuthRequest;

const mockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

const mockNext: jest.MockedFunction<NextFunction> = jest.fn();

describe("ProjectController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  browse
  it("should return all projects", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockedRepo.prototype.findAll.mockResolvedValue([
      {
        id: 1,
        name: "test",
        description: "desc",
        status: "public",
        createdBy: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await projectController.browse(req, res, mockNext);

    expect(mockedRepo.prototype.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: "test",
          description: "desc",
          status: "public",
          createdBy: "123",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ]),
    );
  });

  //  browseByUser
  it("should return 401 if no user", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await projectController.browseByUser(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return projects for a user", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
    });
    const res = mockResponse();

    mockedRepo.prototype.findAllProjectsByUserUuid.mockResolvedValue([
      {
        id: 1,
        description: "abc",
        name: "test",
        status: "public",
        createdBy: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await projectController.browseByUser(req, res, mockNext);

    expect(mockedRepo.prototype.findAllProjectsByUserUuid).toHaveBeenCalledWith(
      "123",
    );

    expect(res.json).toHaveBeenCalled();
  });

  //  read
  it("should return 404 if project not found", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "abc" },
    });
    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue(null as never);

    await projectController.read(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should block private project", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "abc" },
    });
    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue({
      status: "private",
      createdBy: "999",
    } as never);

    await projectController.read(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  //  add
  it("should return 400 if missing fields", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      body: {},
    });
    const res = mockResponse();

    await projectController.add(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should create project", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      body: {
        name: "test",
        description: "desc",
        status: "public",
      },
    });
    const res = mockResponse();

    mockedRepo.prototype.create.mockResolvedValue({ insertId: 1 } as never);

    await projectController.add(req, res, mockNext);

    expect(mockedRepo.prototype.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  //  delete
  it("should forbid delete if not owner", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "abc" },
    });
    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue({
      createdBy: "999",
    } as never);

    await projectController.destroy(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  //  update
  it("should update project", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "abc" },
      body: { name: "new" },
    });
    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue({
      createdBy: "123",
    } as never);

    mockedRepo.prototype.update.mockResolvedValue({
      affectedRows: 1,
    } as never);

    await projectController.edit(req, res, mockNext);

    expect(mockedRepo.prototype.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
