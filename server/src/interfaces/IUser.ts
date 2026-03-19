import type { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: number;
  uuid: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
