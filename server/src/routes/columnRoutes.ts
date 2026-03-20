import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import columnController from "../modules/column/columnController";

const columnRoutes = express.Router();

/**
 * @swagger
 * /columns/project/{projectUuid}:
 *   get:
 *     summary: Get all columns for a specific project
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: projectUuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the project
 *     responses:
 *       200:
 *         description: A list of columns for the specified project
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */
columnRoutes.get(
  "/columns/project/:projectUuid",
  verifyToken,
  columnController.browseAllByProjectUuid,
);

/**
 * @swagger
 * /columns/{uuid}:
 *   get:
 *     summary: Get a column by UUID
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the column
 *     responses:
 *       200:
 *         description: A column object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
columnRoutes.get("/columns/:uuid", verifyToken, columnController.read);

/**
 * @swagger
 * /columns:
 *   post:
 *     summary: Create a new column
 *     tags: [Columns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               projectUuid:
 *                 type: string
 *     responses:
 *       201:
 *         description: Column created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
columnRoutes.post("/columns", verifyToken, columnController.add);

/**
 * @swagger
 * /columns/{uuid}:
 *   put:
 *     summary: Update a column by UUID
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the column
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Column updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
columnRoutes.put("/columns/:uuid", verifyToken, columnController.edit);

/**
 * @swagger
 * /columns/{uuid}:
 *   delete:
 *     summary: Delete a column by UUID
 *     tags: [Columns]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the column
 *     responses:
 *       200:
 *         description: Column deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
columnRoutes.delete("/columns/:uuid", verifyToken, columnController.destroy);

export default columnRoutes;
