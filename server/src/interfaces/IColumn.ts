import type { RowDataPacket } from "mysql2";

export interface IColumn extends RowDataPacket {
  id: number;
  uuid: string;
  name: string;
  position: number;
  projectUuid: string;
  createdAt: Date;
  updatedAt: Date;
}
