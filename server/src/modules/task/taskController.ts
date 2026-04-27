import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import type { ColumnDTO } from "../../dto/ColumnDTO";
import type { AuthRequest } from "../../middlewares/verifyToken";
import { generatePosition } from "../../utils/generatePosition";
import projectRepository from "../project/projectRepository";

import type { TaskDTO } from "../../dto/TaskDTO";
import ColumnRepository from "../column/columnRepository";
import TaskRepository from "./taskRepository";

const taskRepository = new TaskRepository();
const columnRepository = new ColumnRepository();

const browseAllByColumnUuid: RequestHandler = async (req, res, next) => {
  try {
    const { columnUuid } = req.params as { columnUuid: string };
    if (!columnUuid) {
      res.status(400).json({ message: "Column UUID is required" });
      return;
    }
    const columnExist = await columnRepository.findOneByUUId(columnUuid);
    if (!columnExist) {
      res.status(404).json({ message: "Column not found" });
      return;
    }
    const tasks = await taskRepository.findAllByColumnUuid(columnUuid);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const itemUUID = req.params.uuid as string;
    const item = await taskRepository.findOneByUUId(itemUUID);

    if (item == null) {
      res.json({ message: "Task not found", status: 404 }).status(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const { content, priority, columnUuid } = req.body;
    if (!content || !priority) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const columnExist = await columnRepository.findOneByUUId(columnUuid);
    if (!columnExist) {
      res.status(404).json({ message: "Column not found" });
      return;
    }

    if (priority !== "low" && priority !== "medium" && priority !== "high") {
      res
        .status(400)
        .json({ message: "Le priority doit être 'low', 'medium' ou 'high'" });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newTask: TaskDTO = {
      uuid: uuidv4(),
      content,
      priority,
      position: generatePosition(),
      isCompleted: false,
      columnUuid,
      userUuid: user.userUuid,
    };
    const result = await taskRepository.create(newTask);
    res.status(201).json({ message: "Task created", taskId: result.insertId });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req: AuthRequest, res, next) => {
  const taskUUID = req.params.uuid as string;
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await taskRepository.delete(taskUUID);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Tâche non trouvée" });
      return;
    }

    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: AuthRequest, res, next) => {
  const taskUUID = req.params.uuid as string;
  const { content, priority, position, isCompleted, columnUuid } = req.body;
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const task = await taskRepository.findOneByUUId(taskUUID);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const result = await taskRepository.update(taskUUID, {
      uuid: taskUUID,
      content,
      priority,
      position,
      isCompleted,
      columnUuid,
      userUuid: user.userUuid,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    next(err);
  }
};

const toggle: RequestHandler = async (req: AuthRequest, res, next) => {
  const taskUUID = req.params.uuid as string;
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const task = await taskRepository.findOneByUUId(taskUUID);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const result = await taskRepository.update(taskUUID, {
      uuid: task.uuid,
      content: task.content,
      priority: task.priority,
      userUuid: task.userUuid,
      columnUuid: task.columnUuid,
      position: task.position,
      isCompleted: !task.isCompleted,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task toggled successfully" });
  } catch (err) {
    next(err);
  }
};

export default { browseAllByColumnUuid, add, destroy, read, edit, toggle };
