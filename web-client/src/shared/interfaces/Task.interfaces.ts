export interface ITask {
  taskId: string;
  ownerId: string;
  title: string;
  content: string;
  sharedWith: string[];
  bgColor: string;
  dueDate: string;
  isCompleted: boolean;
  updatedAt: string;
}
