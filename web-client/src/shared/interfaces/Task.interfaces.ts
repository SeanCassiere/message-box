export interface ITask {
  taskId: string;
  ownerId: string;
  title: string;
  content: string;
  sharedWith: string[];
  bgColor: string;
  dueDate: string;
  completedDate: string | null;
  isCompleted: boolean;
  updatedAt: string;
}
