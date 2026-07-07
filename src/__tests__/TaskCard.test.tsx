import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import boardReducer from '@/src/features/board/boardSlice';
import TaskCard from '@/src/components/TaskCard/TaskCard';
import { Task } from '@/src/types/board';
import React from "react";


jest.mock('react-dom', () => ({
    ...jest.requireActual('react-dom'),
    createPortal: (node: React.ReactNode) => node,
}));

function makeStore() {
    return configureStore({
        reducer: { board: boardReducer },
    });
}

function renderWithStore(ui: React.ReactElement) {
    const store = makeStore();
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        store,
    };
}

const mockTask: Task = {
    id: 'task-1',
    title: 'Тестовая задача',
    description: 'Описание задачи',
    priority: 'high',
    type: 'bug',
    createdAt: 1704067200000,
};

describe('TaskCard', () => {

    it('рендерит заголовок задачи', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
    });

    it('рендерит описание если оно есть', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        expect(screen.getByText('Описание задачи')).toBeInTheDocument();
    });

    it('не рендерит описание если его нет', () => {
        const taskWithoutDesc = { ...mockTask, description: undefined };
        renderWithStore(<TaskCard task={taskWithoutDesc} columnId="col-1" />);
        expect(screen.queryByText('Описание задачи')).not.toBeInTheDocument();
    });

    it('рендерит бейдж типа', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        expect(screen.getByText('Bug')).toBeInTheDocument();
    });

    it('рендерит бейдж приоритета', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('показывает кнопки редактирования и удаления', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        expect(screen.getByTitle('Редактировать')).toBeInTheDocument();
        expect(screen.getByTitle('Удалить')).toBeInTheDocument();
    });

    it('открывает модалку редактирования по клику на Edit', () => {
        renderWithStore(<TaskCard task={mockTask} columnId="col-1" />);
        fireEvent.click(screen.getByTitle('Редактировать'));
        expect(screen.getByText('Редактировать задачу')).toBeInTheDocument();
    });

    it('диспатчит deleteTask по клику на Delete', () => {
        const store = configureStore({
            reducer: { board: boardReducer },
            preloadedState: {
                board: {
                    tasks: { 'task-1': mockTask },
                    columns: {
                        'col-1': { id: 'col-1', title: 'To Do', taskIds: ['task-1'], color: '#4f6ef7' },
                    },
                    columnOrder: ['col-1'],
                    status: 'succeeded' as const,
                    error: null,
                },
            },
        });

        render(
            <Provider store={store}>
                <TaskCard task={mockTask} columnId="col-1" />
            </Provider>
        );

        fireEvent.click(screen.getByTitle('Удалить'));

        const state = store.getState();
        expect(state.board.tasks['task-1']).toBeUndefined();
    });

});