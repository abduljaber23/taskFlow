export interface IUser {
  id: number;
  uuid: string;
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
