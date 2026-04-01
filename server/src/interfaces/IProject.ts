export interface IProject {
  id: number;
  name: string;
  description: string;
  status: "public" | "private";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
