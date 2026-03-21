export interface ProjectDTO {
  uuid: string;
  name: string;
  description: string;
  status: "public" | "private";
  createdBy: string;
}
