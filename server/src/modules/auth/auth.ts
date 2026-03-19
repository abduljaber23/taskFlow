import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import type { JwtPayload } from "../../interfaces/JwtPayload";

import type { RequestHandler } from "express";
import type { UserDTO } from "../../dto/UserDTO";
import UserRepository from "../user/userRepository";

const userRepository = new UserRepository();
const register: RequestHandler = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "Tous les champs ne sont pas remplis" });
    }
    const emailExists = await userRepository.findOneByEmail(email);
    if (emailExists) {
      res.status(409).json({ message: "Email exist dèjà" });
    }
    const usernameExists = await userRepository.findOneByUsername(username);
    if (usernameExists) {
      res.status(409).json({ message: "username exist dèjà" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: UserDTO = {
      uuid: uuidv4(),
      email,
      username,
      password: hashedPassword,
    };
    const result = await userRepository.create(newUser);
    res.status(201).json({
      message: "Utilisateur crear avec succés!",
      userId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "Tous les champs ne sont pas remplis" });
    }
    const user = await userRepository.findOneByEmail(email);
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const payload: JwtPayload = {
      userId: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const generateToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "15d",
    });
    res.cookie("access_token", generateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 3600000,
    });
    res.status(200).json({
      message: "Connexion reussie",
      user: {
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token: generateToken,
    });
  } catch (err) {
    next(err);
  }
};

const logout: RequestHandler = (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Déconnexion reussie" });
  } catch (err) {
    next(err);
  }
};

export default { register, login, logout };
