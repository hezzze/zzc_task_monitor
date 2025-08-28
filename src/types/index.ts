// API Response Types (snake_case as returned by backend)
export interface ApiTaskResponse {
  id: string;
  prompt?: string;
  status: 'pending' | 'processing' | 'running' | 'completed' | 'failed' | 'timeout';
  result?: {
    images?: string[];
    videos?: string[];
    outputs?: Record<string, any>;
    logs?: any[];
  };
  error?: string;
  worker_id?: string;
  priority?: number;
  timeout?: number;
  created_at?: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
  workflow?: any;
}

// UI Data Types (camelCase for internal use)
export interface TaskData {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'running' | 'completed' | 'failed' | 'timeout';
  result?: {
    images?: string[];
    videos?: string[];
    outputs?: Record<string, any>;
    logs?: any[];
  };
  error?: string;
  workerId?: string;
  priority?: number;
  timeout?: number;
  createdAt?: string;
  updatedAt?: string;
  startedAt?: string;
  completedAt?: string;
  startTime?: number;
  endTime?: number;
  workflow?: any;
}

export interface SystemInfo {
  workerCount: string;
  queueLength: string | number;
  totalTasks: string | number;
}

export interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface WorkflowNode {
  class_type: string;
  inputs: Record<string, any>;
}

export interface Workflow {
  [nodeId: string]: WorkflowNode;
}

export interface TaskSubmissionResponse {
  id: string;
  status: string;
}

export interface TasksResponse {
  tasks: ApiTaskResponse[];
}

export interface SortOptions {
  sortBy: 'created_at' | 'updated_at' | 'started_at' | 'completed_at';
  sortOrder: 'asc' | 'desc';
}

export interface StatsResponse {
  queue_length: number;
  total_tasks: number;
}

export interface HealthResponse {
  online_workers: number;
  total_workers: number;
}