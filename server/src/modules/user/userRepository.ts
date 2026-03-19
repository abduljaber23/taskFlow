import type { ResultSetHeader } from "mysql2";
import client from "../../../database/client";
import type { UserDTO } from "../../dto/UserDTO";
import type { IUser } from "../../interfaces/IUser";
const selectSql =
  "SELECT id, uuid, username, email, role, createdAt, updatedAt FROM users";

export default class UserRepository {
  async findAll() {
    try {
      const [rows] = await client.query<IUser[]>(`${selectSql}`);
      return rows;
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des utilisateurs: ${error}`,
      );
    }
  }

  async findOneById(id: number) {
    try {
      const [rows] = await client.query<IUser[]>(`${selectSql} WHERE id = ? `, [
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error}`,
      );
    }
  }

  async findOneByUUId(uuid: string) {
    try {
      const [rows] = await client.query<IUser[]>(
        `${selectSql} WHERE uuid = ? `,
        [uuid],
      );
      return rows[0];
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error}`,
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const [rows] = await client.query<IUser[]>(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      return rows[0];
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error}`,
      );
    }
  }
  async findOneByUsername(username: string) {
    try {
      const [rows] = await client.query<IUser[]>(
        "SELECT * FROM users WHERE username = ?",
        [username],
      );
      return rows[0];
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${error}`,
      );
    }
  }

  async create(user: UserDTO) {
    try {
      const [result] = await client.query<ResultSetHeader>(
        "INSERT INTO users (uuid,email,username,password) VALUES (?,?,?,?)",
        [user.uuid, user.email, user.username, user.password],
      );
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error}`);
    }
  }

  async delete(uuid: string) {
    try {
      const [result] = await client.execute<ResultSetHeader>(
        "DELETE FROM users WHERE uuid = ?",
        [uuid],
      );
      return result;
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de l'utilisateur: ${error}`,
      );
    }
  }

  async update(uuid: string, user: UserDTO) {
    try {
      const fields = [];
      const values = [];

      if (user.email !== undefined) {
        fields.push("email = ?");
        values.push(user.email);
      }
      if (user.username !== undefined) {
        fields.push("username = ?");
        values.push(user.username);
      }
      if (user.password !== undefined) {
        fields.push("password = ?");
        values.push(user.password);
      }

      values.push(uuid);

      const query = `UPDATE users SET ${fields.join(", ")} WHERE uuid = ?`;
      const [result] = await client.execute<ResultSetHeader>(query, values);

      return result;
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur: ${error}`,
      );
    }
  }
}
