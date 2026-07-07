import { BoardState } from '@/src/types/board';

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockBoard: BoardState = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Настроить ESLint',
            description: 'Добавить правила для TypeScript',
            priority: 'medium',
            type: 'task',
            createdAt: 1704067200000,
        },
        'task-2': {
            id: 'task-2',
            title: 'Создать компоненты',
            priority: 'high',
            type: 'feature',
            createdAt: 1704067200000,
        },
        'task-3': {
            id: 'task-3',
            title: 'Подключить Redux',
            description: 'Настроить store и boardSlice',
            priority: 'high',
            type: 'task',
            createdAt: 1704067200000,
        },
        'task-4': {
            id: 'task-4',
            title: 'Реализовать DnD',
            description: 'Перетаскивание карточек между колонками',
            priority: 'medium',
            type: 'feature',
            createdAt: 1704067200000,
        },
        'task-5': {
            id: 'task-5',
            title: 'Написать README',
            priority: 'low',
            type: 'task',
            createdAt: 1704067200000,
        },
        'task-6': {
            id: 'task-6',
            title: 'Починить скролл на мобиле',
            description: 'Горизонтальный скролл не работает на iOS',
            priority: 'high',
            type: 'bug',
            createdAt: 1704067200000,
        },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'To Do',       taskIds: ['task-1', 'task-2'],           color: '#4f6ef7' },
        'col-2': { id: 'col-2', title: 'In Progress',  taskIds: ['task-3', 'task-4', 'task-6'], color: '#f5a623' },
        'col-3': { id: 'col-3', title: 'Done',         taskIds: ['task-5'],                     color: '#22c55e' },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};

export async function fetchBoardData(): Promise<BoardState> {
    await delay(800); // имитация асинхронных данных
    return mockBoard;
}