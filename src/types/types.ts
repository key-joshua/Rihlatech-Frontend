export interface TaskType {
  id: string;
  tag: string;
  title: string;
  stageId: string;
  dueDate: string;
  assignee: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface StageType {
  id: string;
  title: string;
  description: string;
  isCollapsed?: boolean;
}

export interface NotificationType {
  id: string;
  isRead: boolean;
  message: string;
  timestamp: Date;
  toStage?: string;
  taskTitle?: string;
  fromStage?: string;
  type: 'TASK_MOVED' | 'TASK_ASSIGNED' | 'STATUS_UPDATE';
}
