import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import type { AuthRequest } from "../../middlewares/verifyToken";
// import { AuthRequest } from "../../middlewares/verifyToken";
import UserRepository from "./userRepository";

const repo = new UserRepository();

const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await repo.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const itemUUID = req.params.uuid;
    const item = await repo.findOneByUUId(itemUUID);

    if (item == null) {
      res.json({ message: "User not found", status: 404 });
    } else {
      res.json(item);
    }
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const itemUUID = req.params.uuid;
    const result = await repo.delete(itemUUID);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: AuthRequest, res, next) => {
  const { email, username, password } = req.body;
  const itemUUID = req.params.uuid;
  try {
    if (req.user?.userUuid !== req.params.uuid) {
      res.status(403).json({ message: "Accès interdit" });
      return;
    }

    const emailExists = await repo.findOneByEmail(email);
    if (emailExists) {
      res.status(409).json({ message: "Email exist dèjà" });
    }
    const usernameExists = await repo.findOneByUsername(username);
    if (usernameExists) {
      res.status(409).json({ message: "username exist dèjà" });
    }

    let hashedPassword: string | undefined;

    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const result = await repo.update(itemUUID, {
      uuid: itemUUID,
      email,
      username,
      password: hashedPassword,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur mis à jour avec succés" });
  } catch (err) {
    next(err);
  }
};

const profile: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

export default { browse, read, destroy, edit, profile };
