export interface TaskDTO {
  uuid: string;
  name: string;
  description: string;
  priority: "low" | "medium" | "high";
  isCompleted?: boolean;
  userUuid: string;
  columnUuid: string;
  position: number;
}
