export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskType = 'task' | 'bug' | 'feature';

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    type: TaskType;
    createdAt: number;
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
    color?: string;
}

export interface BoardState {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}