import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import type { ColumnDTO } from "../../dto/ColumnDTO";
import type { AuthRequest } from "../../middlewares/verifyToken";
import { generatePosition } from "../../utils/generatePosition";
import projectRepository from "../project/projectRepository";
import ColumnRepository from "./columnRepository";

const columnRepository = new ColumnRepository();
const projectRepo = new projectRepository();

const browseAllByProjectUuid: RequestHandler = async (req, res, next) => {
  try {
    const { projectUuid } = req.params;
    if (!projectUuid) {
      res.status(400).json({ message: "Project UUID is required" });
      return;
    }
    const projectExist = await projectRepo.findOneByUUId(projectUuid);
    if (!projectExist) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    const columns = await columnRepository.findAllByProjectUuid(projectUuid);
    res.json(columns);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const itemUUID = req.params.uuid;
    const item = await columnRepository.findOneByUUId(itemUUID);

    if (item == null) {
      res.json({ message: "Column not found", status: 404 }).status(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const { name, projectUuid } = req.body;
    if (!name || !projectUuid) {
      res.status(400).json({ message: "Name and project UUID are required" });
      return;
    }
    const projectExist = await projectRepo.findOneByUUId(projectUuid);
    if (!projectExist) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    const newColumn: ColumnDTO = {
      uuid: uuidv4(),
      name,
      position: generatePosition(),
      projectUuid,
    };
    const result = await columnRepository.create(newColumn);
    res
      .status(201)
      .json({ message: "Column created", columnId: result.insertId });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: AuthRequest, res, next) => {
  const { name } = req.body;
  const columnUUID = req.params.uuid;
  try {
    const column = await columnRepository.findOneByUUId(columnUUID);
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await columnRepository.update(columnUUID, {
      uuid: columnUUID,
      name,
      position: column.position,
      projectUuid: column.projectUuid,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Colonne non trouvée" });
      return;
    }

    res.json({ message: "Colonne mise à jour avec succès" });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req: AuthRequest, res, next) => {
  const columnUUID = req.params.uuid;
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const result = await columnRepository.delete(columnUUID);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Colonne non trouvée" });
      return;
    }

    res.json({ message: "Colonne supprimée avec succès" });
  } catch (err) {
    next(err);
  }
};

export default { browseAllByProjectUuid, add, edit, destroy, read };
