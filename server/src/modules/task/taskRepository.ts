import type { ResultSetHeader } from "mysql2";
import client from "../../../database/client";
import type { TaskDTO } from "../../dto/TaskDTO";
import type { ITask } from "../../interfaces/ITask";

const selectSql =
  "SELECT id, uuid, name, description, priority, position, isCompleted, columnId, userId, createdAt, updatedAt FROM tasks";
export default class TaskRepository {
  async findAllByColumnUuid(columnUuid: string) {
    try {
      const [rows] = await client.query<ITask[]>(
        `${selectSql} WHERE columnId = ? ORDER BY position ASC`,
        [columnUuid],
      );
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des tâches: ${error}`);
    }
  }

  async findOneByUUId(uuid: string) {
    try {
      const [rows] = await client.query<ITask[]>(
        `${selectSql} WHERE uuid = ? `,
        [uuid],
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la tâche: ${error}`);
    }
  }

  async create(task: TaskDTO) {
    try {
      const [result] = await client.query<ResultSetHeader>(
        "INSERT INTO tasks (uuid, name, description, priority, position, isCompleted, columnId, userId) VALUES (?,?,?,?,?,?,?,?)",
        [
          task.uuid,
          task.name,
          task.description,
          task.priority,
          task.position,
          task.isCompleted,
          task.columnUuid,
          task.userUuid,
        ],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la création de la tâche: ${error}`);
    }
  }

  async delete(uuid: string) {
    try {
      const [result] = await client.execute<ResultSetHeader>(
        "DELETE FROM tasks WHERE uuid = ?",
        [uuid],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la tâche: ${error}`);
    }
  }

  async update(uuid: string, task: TaskDTO) {
    try {
      const fields = [];
      const values = [];

      if (task.name !== undefined) {
        fields.push("name = ?");
        values.push(task.name);
      }
      if (task.position !== undefined) {
        fields.push("position = ?");
        values.push(task.position);
      }
      if (task.description !== undefined) {
        fields.push("description = ?");
        values.push(task.description);
      }
      if (task.priority !== undefined) {
        fields.push("priority = ?");
        values.push(task.priority);
      }
      if (task.isCompleted !== undefined) {
        fields.push("isCompleted = ?");
        values.push(task.isCompleted);
      }
      if (task.columnUuid !== undefined) {
        fields.push("columnId = ?");
        values.push(task.columnUuid);
      }

      if (fields.length === 0) {
        throw new Error("Aucun champ à mettre à jour");
      }

      values.push(uuid);

      const query = `UPDATE tasks SET ${fields.join(", ")} WHERE uuid = ?`;
      const [result] = await client.execute<ResultSetHeader>(query, values);

      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la tâche: ${error}`);
    }
  }
}
