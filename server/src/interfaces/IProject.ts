import type { RowDataPacket } from "mysql2";

export interface IProject extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  status: "public" | "private";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
