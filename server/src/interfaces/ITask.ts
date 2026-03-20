import type { RowDataPacket } from "mysql2";

export interface ITask extends RowDataPacket {
  id: number;
  uuid: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  position: number;
  isCompleted: boolean;
  columnUuid: string;
  userUuid: string;
  createdAt: Date;
  updatedAt: Date;
}
