import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import projectController from "../modules/project/projectController";

const projectRoutes = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: A project object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
projectRoutes.get("/projects", verifyToken, projectController.browse);

/**
 * @swagger
 * /projects/user/{uuid}:
 *   get:
 *     summary: Get all projects by user UUID
 *     tags: [Projects]
 *     parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: A project object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
projectRoutes.get(
  "/projects/user/:uuid",
  verifyToken,
  projectController.browseByUser,
);

/**
 * @swagger
 * /projects/{uuid}:
 *   get:
 *     summary: Get a project by UUID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A project object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
projectRoutes.get("/projects/:uuid", verifyToken, projectController.read);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
projectRoutes.post("/projects", verifyToken, projectController.add);

/**
 * @swagger
 * /projects/{uuid}:
 *   delete:
 *     summary: Delete a project by UUID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
projectRoutes.delete("/projects/:uuid", verifyToken, projectController.destroy);

/**
 * @swagger
 * /projects/{uuid}:
 *   put:
 *     summary: Update a project by UUID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
projectRoutes.put("/projects/:uuid", verifyToken, projectController.edit);

export default projectRoutes;
