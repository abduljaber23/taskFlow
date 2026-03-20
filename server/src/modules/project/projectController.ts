import type { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import type { ProjectDTO } from "../../dto/ProjectDTO";
import type { AuthRequest } from "../../middlewares/verifyToken";
import ProjectRepository from "./projectRepository";

const projectRepository = new ProjectRepository();

const browse: RequestHandler = async (req, res, next) => {
  try {
    const projects = await projectRepository.findAll();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

const browseByUser: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.userUuid;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const projects = await projectRepository.findAllProjectsByUserUuid(userId);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const user = req.user;
    const projectUUID = req.params.uuid;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const project = await projectRepository.findOneByUUId(projectUUID);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (project.status === "private" && project.createdBy !== user.userUuid) {
      res.status(403).json({ message: "Accès interdit" });
      return;
    }
    console.log(project.status, user.userUuid, project.createdBy);
    res.json(project);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const projectUUID = req.params.uuid;
    const project = await projectRepository.findOneByUUId(projectUUID);
    if (!project || project.createdBy !== req.user?.userUuid) {
      res.status(403).json({ message: "Accès interdit" });
      return;
    }
    const result = await projectRepository.delete(projectUUID);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Projet non trouvé" });
    }

    res.json({ message: "projet supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req: AuthRequest, res, next) => {
  const { name, description, status } = req.body;
  try {
    if (!req.user || !req.user.userUuid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!name || !description || !status) {
      res.status(400).json({ message: "Tous les champs ne sont pas remplis" });
      return;
    }
    if (status !== "private" && status !== "public") {
      res
        .status(400)
        .json({ message: "Le statut doit être 'private' ou 'public'" });
      return;
    }
    const newProject: ProjectDTO = {
      uuid: uuidv4(),
      name,
      description,
      status,
      createdBy: req.user.userUuid,
    };
    const result = await projectRepository.create(newProject);
    res.status(201).json({
      message: "Project crée  avec succés!",
      userUuid: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req: AuthRequest, res, next) => {
  const { name, description, status } = req.body;
  const projectUUID = req.params.uuid;
  try {
    const project = await projectRepository.findOneByUUId(projectUUID);
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (project.createdBy !== user.userUuid) {
      res.status(403).json({ message: "Accès interdit" });
      return;
    }

    const result = await projectRepository.update(projectUUID, {
      uuid: projectUUID,
      name,
      description,
      status,
      createdBy: user.userUuid,
    });

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Projet non trouvé" });
      return;
    }

    res.json({ message: "Projet mis à jour avec succés" });
  } catch (err) {
    next(err);
  }
};

export default { add, destroy, read, browse, browseByUser, edit };
