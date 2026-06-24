export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  complexity: number; // 1-5
  effort: number;     // 1-5 (needed for Smart Priority score)
  importance: number; // 1-5 (needed for Smart Priority score)
  subtasks: SubTask[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface WorkloadStatus {
  day: string;
  todo: number;
  inProgress: number;
  completed: number;
}
