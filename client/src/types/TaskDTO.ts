export interface TaskDTO {
  uuid: string;
  content: string;
  priority: "low" | "medium" | "high";
  isCompleted?: boolean;
  userUuid: string;
  columnUuid: string;
  position: number;
}
