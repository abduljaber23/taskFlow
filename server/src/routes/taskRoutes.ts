import express from "express";

const taskRoutes = express.Router();

import { verifyToken } from "../middlewares/verifyToken";
import taskController from "../modules/task/taskController";

/**
 * @swagger
 * /tasks/column/{columnUuid}:
 *   get:
 *     summary: Get all tasks for a specific column
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: columnUuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UUID of the column
 *     responses:
 *       200:
 *         description: A list of tasks for the specified column
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Column not found
 */
taskRoutes.get(
  "/tasks/column/:columnUuid",
  verifyToken,
  taskController.browseAllByColumnUuid,
);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
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
 *               priority:
 *                 type: string
 *               columnUuid:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
taskRoutes.post("/tasks", verifyToken, taskController.add);

// delete
/**
 * @swagger
 * /tasks/{uuid}:
 *   delete:
 *     summary: Delete a task by UUID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
taskRoutes.delete("/tasks/:uuid", verifyToken, taskController.destroy);

// update
/**
 * @swagger
 * /tasks/{uuid}:
 *   put:
 *     summary: Update a task by UUID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the task to update
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
 *               priority:
 *                 type: string
 *               position:
 *                 type: integer
 *               isCompleted:
 *                 type: boolean
 *               columnUuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
taskRoutes.put("/tasks/:uuid", verifyToken, taskController.edit);

export default taskRoutes;
