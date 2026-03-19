import type { ResultSetHeader } from "mysql2";
import client from "../../../database/client";
import type { ColumnDTO } from "../../dto/ColumnDTO";
import type { IColumn } from "../../interfaces/IColumn";

const selectSql =
  "SELECT id, uuid, name, position, projectId, createdAt, updatedAt FROM projectColumns";
export default class ColumnRepository {
  async findAllByProjectUuid(projectUuid: string) {
    try {
      const [rows] = await client.query<IColumn[]>(
        `${selectSql} WHERE projectId = ? ORDER BY position ASC`,
        [projectUuid],
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des colonnes: ${error}`);
    }
  }

  async findOneByUUId(uuid: string) {
    try {
      const [rows] = await client.query<IColumn[]>(
        `${selectSql} WHERE uuid = ? `,
        [uuid],
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la colonne: ${error}`);
    }
  }

  async create(column: ColumnDTO) {
    try {
      const [result] = await client.query<ResultSetHeader>(
        "INSERT INTO projectColumns (uuid, name, position, projectId) VALUES (?,?,?,?)",
        [column.uuid, column.name, column.position, column.projectUuid],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la colonne: ${error}`);
    }
  }

  async delete(uuid: string) {
    try {
      const [result] = await client.execute<ResultSetHeader>(
        "DELETE FROM projectColumns WHERE uuid = ?",
        [uuid],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la colonne: ${error}`);
    }
  }

  async update(uuid: string, column: ColumnDTO) {
    try {
      const fields = [];
      const values = [];

      if (column.name !== undefined) {
        fields.push("name = ?");
        values.push(column.name);
      }
      if (column.position !== undefined) {
        fields.push("position = ?");
        values.push(column.position);
      }
      if (column.projectUuid !== undefined) {
        fields.push("project_uuid = ?");
        values.push(column.projectUuid);
      }
      if (fields.length === 0) {
        throw new Error("Aucun champ à mettre à jour");
      }

      values.push(uuid);

      const query = `UPDATE projectColumns SET ${fields.join(", ")} WHERE uuid = ?`;
      const [result] = await client.execute<ResultSetHeader>(query, values);

      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la colonne: ${error}`);
    }
  }
}
