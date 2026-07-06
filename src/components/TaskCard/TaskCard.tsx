'use client';

import { useState } from 'react';
import { Task, TaskPriority, TaskType } from '@/src/types/board';
import { useAppDispatch } from '@/src/store/hooks';
import { deleteTask, updateTask } from '@/src/features/board/boardSlice';
import TaskModal from '@/src/components/TaskModal/TaskModal';
import styles from './TaskCard.module.css';

interface TaskCardProps {
    task: Task;
    columnId: string;
    isDragging?: boolean;
}

const priorityConfig = {
    low:    { label: 'Low',    className: 'priorityLow' },
    medium: { label: 'Medium', className: 'priorityMedium' },
    high:   { label: 'High',   className: 'priorityHigh' },
};

const typeConfig = {
    task:    { label: 'Task',    className: 'typeTask' },
    bug:     { label: 'Bug',     className: 'typeBug' },
    feature: { label: 'Feature', className: 'typeFeature' },
};

export default function TaskCard({ task, columnId, isDragging = false }: TaskCardProps) {
    const dispatch = useAppDispatch();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const priority = priorityConfig[task.priority];
    const type = typeConfig[task.type];

    const date = new Date(task.createdAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!columnId) return;
        dispatch(deleteTask({ taskId: task.id, columnId }));
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditOpen(true);
    };

    const handleUpdate = (data: {
        title: string;
        description: string;
        priority: TaskPriority;
        type: TaskType;
    }) => {
        dispatch(updateTask({ taskId: task.id, changes: data }));
    };

    return (
        <>
            <div className={`${styles.card} ${isDragging ? styles.dragging : ''}`}>
                <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[type.className]}`}>
            {type.label}
          </span>
                    <span className={`${styles.badge} ${styles[priority.className]}`}>
            {priority.label}
          </span>

                    {columnId && (
                        <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={handleEdit} title="Редактировать">✎</button>
                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete} title="Удалить">✕</button>
                        </div>
                    )}
                </div>

                <h3 className={styles.title}>{task.title}</h3>

                {task.description && (
                    <p className={styles.description}>{task.description}</p>
                )}

                <div className={styles.footer}>
                    <span className={styles.taskId}>{task.id.slice(0, 8)}</span>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>

            {isEditOpen && columnId && (
                <TaskModal
                    columnId={columnId}
                    task={task}
                    onSubmit={handleUpdate}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </>
    );
}