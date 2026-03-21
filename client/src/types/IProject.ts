export interface IProject {
  id: number;
  uuid: string;
  name: string;
  description: string;
  status: "public" | "private";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
