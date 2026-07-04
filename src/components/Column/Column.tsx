'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Column as ColumnType, Task, TaskPriority, TaskType } from '@/src/types/board';
import { useAppDispatch } from '@/src/store/hooks';
import { addTask } from '@/src/features/board/boardSlice';
import TaskCard from '@/src/components/TaskCard/TaskCard';
import TaskModal from '@/src/components/TaskModal/TaskModal';
import styles from './Column.module.css';

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export default function Column({ column, tasks }: ColumnProps) {
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddTask = (data: {
        title: string;
        description: string;
        priority: TaskPriority;
        type: TaskType;
    }) => {
        const newTask: Task = {
            id: uuidv4(),
            createdAt: Date.now(),
            ...data,
        };
        dispatch(addTask({ task: newTask, columnId: column.id }));
    };

    return (
        <div className={styles.column}>
            {column.color && (
                <div className={styles.colorBar} style={{ backgroundColor: column.color }} />
            )}

            <div className={styles.header}>
                <h2 className={styles.title}>{column.title}</h2>
                <span className={styles.count}>{tasks.length}</span>
            </div>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <p className={styles.empty}>Нет задач</p>
                ) : (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} columnId={column.id} />
                    ))
                )}
            </div>

            <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                + Добавить задачу
            </button>

            {isModalOpen && (
                <TaskModal
                    columnId={column.id}
                    onSubmit={handleAddTask}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}