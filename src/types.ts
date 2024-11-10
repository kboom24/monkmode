export type TaskStatus = 'today' | 'upcoming' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskEnergy = 'low' | 'medium' | 'high';
export type ExecutiveFunction = 'planning' | 'organization' | 'time-management' | 'emotional-control' | 'focus' | 'memory';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  subtasks: Subtask[];
  color?: string;
  energy?: TaskEnergy;
  executiveFunction?: ExecutiveFunction;
  category?: string;
  timeEstimate?: number;
  actualTime?: number;
}

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  isBreak: boolean;
}