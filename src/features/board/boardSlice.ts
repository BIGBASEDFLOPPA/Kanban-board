import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardState, Task } from '@/src/types/board';

const initialState: BoardState = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Настроить ESLint',
            description: 'Добавить правила для TypeScript',
            priority: 'medium',
            type: 'task',
            createdAt: Date.now(),
        },
        'task-2': {
            id: 'task-2',
            title: 'Создать компоненты',
            priority: 'high',
            type: 'feature',
            createdAt: Date.now(),
        },
        'task-3': {
            id: 'task-3',
            title: 'Подключить Redux',
            description: 'Настроить store и boardSlice',
            priority: 'high',
            type: 'task',
            createdAt: Date.now(),
        },
        'task-4': {
            id: 'task-4',
            title: 'Реализовать DnD',
            description: 'Перетаскивание карточек между колонками',
            priority: 'medium',
            type: 'feature',
            createdAt: Date.now(),
        },
        'task-5': {
            id: 'task-5',
            title: 'Написать README',
            priority: 'low',
            type: 'task',
            createdAt: Date.now(),
        },
        'task-6': {
            id: 'task-6',
            title: 'Починить скролл на мобиле',
            description: 'Горизонтальный скролл не работает на iOS',
            priority: 'high',
            type: 'bug',
            createdAt: Date.now(),
        },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'To Do',       taskIds: ['task-1', 'task-2'],           color: '#4f6ef7' },
        'col-2': { id: 'col-2', title: 'In Progress',  taskIds: ['task-3', 'task-4', 'task-6'], color: '#f5a623' },
        'col-3': { id: 'col-3', title: 'Done',         taskIds: ['task-5'],                     color: '#22c55e' },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {

        addTask: (
            state,
            action: PayloadAction<{ task: Task; columnId: string }>
        ) => {
            const { task, columnId } = action.payload;
            state.tasks[task.id] = task;
            state.columns[columnId].taskIds.push(task.id);
        },

        updateTask: (
            state,
            action: PayloadAction<{ taskId: string; changes: Partial<Omit<Task, 'id' | 'createdAt'>> }>
        ) => {
            const { taskId, changes } = action.payload;
            const task = state.tasks[taskId];
            if (task) {
                Object.assign(task, changes);
            }
        },

        deleteTask: (
            state,
            action: PayloadAction<{ taskId: string; columnId: string }>
        ) => {
            const { taskId, columnId } = action.payload;
            delete state.tasks[taskId];
            state.columns[columnId].taskIds = state.columns[columnId].taskIds.filter(
                id => id !== taskId
            );
        },

        moveTask: (
            state,
            action: PayloadAction<{
                taskId: string;
                fromColumnId: string;
                toColumnId: string;
                toIndex: number;
            }>
        ) => {
            const { taskId, fromColumnId, toColumnId, toIndex } = action.payload;

            state.columns[fromColumnId].taskIds = state.columns[fromColumnId].taskIds.filter(
                id => id !== taskId
            );

            state.columns[toColumnId].taskIds.splice(toIndex, 0, taskId);
        },

    },
});

export const { addTask, updateTask, deleteTask, moveTask } = boardSlice.actions;
export default boardSlice.reducer;