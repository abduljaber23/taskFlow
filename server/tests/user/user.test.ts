import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../src/middlewares/verifyToken";

import type { IUser } from "../../src/interfaces/IUser";
import auth from "../../src/modules/auth/auth";
import userController from "../../src/modules/user/userController";
import userRepository from "../../src/modules/user/userRepository";

jest.mock("../../src/modules/user/userRepository");

// mock de la classe
const mockedRepo = userRepository as jest.MockedClass<typeof userRepository>;

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

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  browse
  it("should return all users", async () => {
    const req = mockRequest();
    const res = mockResponse();

    mockedRepo.prototype.findAll.mockResolvedValue([
      {
        id: 1,
        uuid: "123",
        username: "test",
        email: "test@test.com",
        password: "test",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await userController.browse(req, res, mockNext);

    expect(mockedRepo.prototype.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          uuid: "123",
          username: "test",
          email: "test@test.com",
          role: "user",
          password: "test",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ]),
    );
  });

  //  read
  it("should return user by uuid", async () => {
    const req = mockRequest({
      params: { uuid: "123" },
    });
    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue({
      id: 1,
      uuid: "123",
      username: "test",
      email: "test@test.com",
      password: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IUser);

    await userController.read(req, res, mockNext);

    expect(mockedRepo.prototype.findOneByUUId).toHaveBeenCalledWith("123");
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      uuid: "123",
      username: "test",
      email: "test@test.com",
      role: "user",
      password: "test",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should return 404 if user not found", async () => {
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

    await userController.read(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // register
  it("should return 400 if missing fields", async () => {
    const req = mockRequest({
      body: {},
    });
    const res = mockResponse();

    await auth.register(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should create user", async () => {
    const req = mockRequest({
      body: {
        username: "test",
        email: "test@test.com",
        password: "test",
      },
    });
    const res = mockResponse();

    mockedRepo.prototype.create.mockResolvedValue({
      id: 1,
      uuid: "123",
      ...req.body,
    } as never);

    await auth.register(req, res, mockNext);
    expect(mockedRepo.prototype.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // delete
  it("should delete user", async () => {
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "123" },
    });

    const res = mockResponse();

    mockedRepo.prototype.findOneByUUId.mockResolvedValue({
      id: 1,
      uuid: "123",
      username: "test",
      email: "test@test.com",
      role: "user",
    } as never);

    mockedRepo.prototype.delete.mockResolvedValue({ affectedRows: 1 } as never);

    await userController.destroy(req, res, mockNext);

    expect(mockedRepo.prototype.delete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(204);
  });

  // edit user
  it("should return 403 if user tries to edit another user", async () => {
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

    mockedRepo.prototype.update.mockResolvedValue({ affectedRows: 1 } as never);

    await userController.edit(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should update user", async () => {
    //  Préparer la requête et la réponse
    const req = mockRequest({
      user: {
        userUuid: "123",
        username: "test",
        email: "test@test.com",
        role: "user",
      },
      params: { uuid: "123" },
      body: { username: "new" }, // on ne change que le username
    });
    const res = mockResponse();

    mockedRepo.prototype.update.mockResolvedValue({ affectedRows: 1 } as never);

    await userController.edit(req, res, mockNext);

    expect(mockedRepo.prototype.update).toHaveBeenCalledWith("123", {
      uuid: "123",
      username: "new",
      email: undefined,
      password: undefined,
    });

    //  Vérification de la réponse
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur mis à jour avec succés",
    });
  });
});

// Vocabulaire des tests :
//  - browse : lister tous les éléments
//  - read : lire un élément
//  - add : ajouter un élément
//  - edit : modifier un élément
//  - delete : supprimer un élément

//  - should return all users : devrait retourner tous les utilisateurs
//  - should return user by uuid : devrait retourner un utilisateur par son uuid
//  - should return 404 if user not found : devrait retourner 404 si l'utilisateur n'est pas trouvé
//  - should create user : devrait créer un utilisateur
//  - should delete user : devrait supprimer un utilisateur
//  - should return 403 if user tries to edit another user : devrait retourner 403 si l'utilisateur essaie de modifier un autre utilisateur
//  - should update user : devrait mettre à jour un utilisateur

//  - affectedRows : nombre de lignes affectées par une requête SQL
//  - insertId : id de l'élément créé par une requête SQL
//  - rows : tableau de lignes renvoyées par une requête SQL
//  - ...data : opérateur de décomposition pour fusionner des objets

//  - findOneByUUId : trouver un utilisateur par son uuid
//  - findAll : trouver tous les utilisateurs
//  - create : créer un utilisateur
//  - update : mettre à jour un utilisateur
//  - delete : supprimer un utilisateur

//  - mockResolvedValue : simuler la valeur de retour d'une fonction asynchrone
//  - toHaveBeenCalledWith : vérifier qu'une fonction a été appelée avec des arguments spécifiques
//  - toHaveBeenCalled : vérifier qu'une fonction a été appelée

//  - mockRequest : simuler une requête HTTP
//  - mockResponse : simuler une réponse HTTP
//  - mockNext : simuler la fonction next() d'Express

//  - beforeEach : exécuter une fonction avant chaque test
//  - jest.clearAllMocks : réinitialiser tous les mocks

//  - describe : regrouper des tests
//  - it : définir un test
//  - expect : faire des assertions
