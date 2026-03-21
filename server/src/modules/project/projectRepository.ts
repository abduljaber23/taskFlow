import type { ResultSetHeader } from "mysql2";
import client from "../../../database/client";
import type { ProjectDTO } from "../../dto/ProjectDTO";
import type { IProject } from "../../interfaces/IProject";

const selectSql =
  "SELECT id, uuid, name, description, status, createdBy, createdAt, updatedAt FROM projects";
export default class projectRepository {
  async findAll() {
    try {
      const [rows] = await client.query<IProject[]>(`${selectSql}`);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des projets: ${error}`);
    }
  }

  async findAllProjectsByUserUuid(userUuid: string) {
    try {
      const [rows] = await client.query<IProject[]>(
        `${selectSql} WHERE createdBy = ? ORDER BY createdAt DESC`,
        [userUuid],
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des projets: ${error}`);
    }
  }

  async findOneById(id: number) {
    try {
      const [rows] = await client.query<IProject[]>(
        `${selectSql} WHERE id = ? `,
        [id],
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du projet: ${error}`);
    }
  }

  async findOneByUUId(uuid: string) {
    try {
      const [rows] = await client.query<IProject[]>(
        `${selectSql} WHERE uuid = ? `,
        [uuid],
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du projet: ${error}`);
    }
  }

  async create(projet: ProjectDTO) {
    try {
      const [result] = await client.query<ResultSetHeader>(
        "INSERT INTO projects (uuid, name, description, status, createdBy) VALUES (?,?,?,?,?)",
        [
          projet.uuid,
          projet.name,
          projet.description,
          projet.status,
          projet.createdBy,
        ],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la création du projet: ${error}`);
    }
  }

  async delete(uuid: string) {
    try {
      const [result] = await client.execute<ResultSetHeader>(
        "DELETE FROM projects WHERE uuid = ?",
        [uuid],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du projet: ${error}`);
    }
  }

  async update(uuid: string, projet: ProjectDTO) {
    try {
      const fields = [];
      const values = [];

      if (projet.name !== undefined) {
        fields.push("name = ?");
        values.push(projet.name);
      }
      if (projet.description !== undefined) {
        fields.push("description = ?");
        values.push(projet.description);
      }
      if (projet.status !== undefined) {
        fields.push("status = ?");
        values.push(projet.status);
      }
      if (fields.length === 0) {
        throw new Error("Aucun champ à mettre à jour");
      }

      values.push(uuid);

      const query = `UPDATE projects SET ${fields.join(", ")} WHERE uuid = ?`;
      const [result] = await client.execute<ResultSetHeader>(query, values);

      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du projet: ${error}`);
    }
  }
}
