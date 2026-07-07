import boardReducer, {
    addTask,
    updateTask,
    deleteTask,
    moveTask,
} from '@/src/features/board/boardSlice';
import { BoardState } from '@/src/types/board';

const baseState: BoardState & { status: 'succeeded'; error: null } = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Тестовая задача',
            priority: 'medium',
            type: 'task',
            createdAt: 1704067200000,
        },
        'task-2': {
            id: 'task-2',
            title: 'Вторая задача',
            priority: 'high',
            type: 'bug',
            createdAt: 1704067200000,
        },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'To Do',      taskIds: ['task-1'], color: '#4f6ef7' },
        'col-2': { id: 'col-2', title: 'In Progress', taskIds: ['task-2'], color: '#f5a623' },
    },
    columnOrder: ['col-1', 'col-2'],
    status: 'succeeded',
    error: null,
};

describe('boardSlice reducers', () => {

    //addTask

    describe('addTask', () => {
        it('добавляет задачу в словарь tasks', () => {
            const newTask = {
                id: 'task-3',
                title: 'Новая задача',
                priority: 'low' as const,
                type: 'feature' as const,
                createdAt: 1704067200000,
            };

            const result = boardReducer(baseState, addTask({
                task: newTask,
                columnId: 'col-1',
            }));

            expect(result.tasks['task-3']).toEqual(newTask);
        });

        it('добавляет taskId в конец указанной колонки', () => {
            const newTask = {
                id: 'task-3',
                title: 'Новая задача',
                priority: 'low' as const,
                type: 'feature' as const,
                createdAt: 1704067200000,
            };

            const result = boardReducer(baseState, addTask({
                task: newTask,
                columnId: 'col-1',
            }));

            expect(result.columns['col-1'].taskIds).toEqual(['task-1', 'task-3']);
        });

        it('не затрагивает другие колонки', () => {
            const newTask = {
                id: 'task-3',
                title: 'Новая задача',
                priority: 'low' as const,
                type: 'feature' as const,
                createdAt: 1704067200000,
            };

            const result = boardReducer(baseState, addTask({
                task: newTask,
                columnId: 'col-1',
            }));

            expect(result.columns['col-2'].taskIds).toEqual(['task-2']);
        });
    });

    //updateTask

    describe('updateTask', () => {
        it('обновляет поля задачи', () => {
            const result = boardReducer(baseState, updateTask({
                taskId: 'task-1',
                changes: { title: 'Обновлённое название', priority: 'high' },
            }));

            expect(result.tasks['task-1'].title).toBe('Обновлённое название');
            expect(result.tasks['task-1'].priority).toBe('high');
        });

        it('не трогает другие поля задачи', () => {
            const result = boardReducer(baseState, updateTask({
                taskId: 'task-1',
                changes: { title: 'Новый заголовок' },
            }));

            expect(result.tasks['task-1'].type).toBe('task');
            expect(result.tasks['task-1'].createdAt).toBe(1704067200000);
        });

        it('не падает если задача не найдена', () => {
            expect(() => {
                boardReducer(baseState, updateTask({
                    taskId: 'task-999',
                    changes: { title: 'Тест' },
                }));
            }).not.toThrow();
        });
    });

    //deleteTask

    describe('deleteTask', () => {
        it('удаляет задачу из словаря tasks', () => {
            const result = boardReducer(baseState, deleteTask({
                taskId: 'task-1',
                columnId: 'col-1',
            }));

            expect(result.tasks['task-1']).toBeUndefined();
        });

        it('удаляет taskId из колонки', () => {
            const result = boardReducer(baseState, deleteTask({
                taskId: 'task-1',
                columnId: 'col-1',
            }));

            expect(result.columns['col-1'].taskIds).toEqual([]);
        });

        it('не затрагивает другие задачи', () => {
            const result = boardReducer(baseState, deleteTask({
                taskId: 'task-1',
                columnId: 'col-1',
            }));

            expect(result.tasks['task-2']).toBeDefined();
        });
    });

    //moveTask

    describe('moveTask', () => {
        it('перемещает задачу между колонками', () => {
            const result = boardReducer(baseState, moveTask({
                taskId: 'task-1',
                fromColumnId: 'col-1',
                toColumnId: 'col-2',
                toIndex: 0,
            }));

            expect(result.columns['col-1'].taskIds).not.toContain('task-1');
            expect(result.columns['col-2'].taskIds).toContain('task-1');
        });

        it('вставляет задачу на правильную позицию', () => {
            const result = boardReducer(baseState, moveTask({
                taskId: 'task-1',
                fromColumnId: 'col-1',
                toColumnId: 'col-2',
                toIndex: 0,
            }));

            expect(result.columns['col-2'].taskIds).toEqual(['task-1', 'task-2']);
        });

        it('корректно меняет порядок внутри одной колонки', () => {
            const stateWithTwo: typeof baseState = {
                ...baseState,
                columns: {
                    ...baseState.columns,
                    'col-1': { ...baseState.columns['col-1'], taskIds: ['task-1', 'task-2'] },
                    'col-2': { ...baseState.columns['col-2'], taskIds: [] },
                },
            };

            const result = boardReducer(stateWithTwo, moveTask({
                taskId: 'task-2',
                fromColumnId: 'col-1',
                toColumnId: 'col-1',
                toIndex: 0,
            }));

            expect(result.columns['col-1'].taskIds).toEqual(['task-2', 'task-1']);
        });
    });

});