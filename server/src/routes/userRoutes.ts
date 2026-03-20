import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import userController from "../modules/user/userController";

const userRoutes = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A user object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRoutes.get("/users/profile", verifyToken, userController.profile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No users found
 */
userRoutes.get("/users", verifyToken, userController.browse);

/**
 * @swagger
 * /users/{uuid}:
 *   get:
 *     summary: Get a user by UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the user
 *     responses:
 *       200:
 *         description: A user object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRoutes.get("/users/:uuid", verifyToken, userController.read);

/**
 * @swagger
 * /users/{uuid}:
 *   delete:
 *     summary: Delete a user by UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRoutes.delete("/users/:uuid", verifyToken, userController.destroy);

/**
 * @swagger
 * /users/{uuid}:
 *   put:
 *     summary: Update a user by UUID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRoutes.put("/users/:uuid", verifyToken, userController.edit);

export default userRoutes;
