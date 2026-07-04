'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskType } from '@/src/types/board';
import styles from './TaskModal.module.css';
import {createPortal} from "react-dom";

interface TaskModalProps {
    columnId: string;
    task?: Task;
    onSubmit: (data: { title: string; description: string; priority: TaskPriority; type: TaskType }) => void;
    onClose: () => void;
}

export default function TaskModal({ columnId, task, onSubmit, onClose }: TaskModalProps) {
    const isEditing = Boolean(task);

    const [title, setTitle]             = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [priority, setPriority]       = useState<TaskPriority>(task?.priority ?? 'medium');
    const [type, setType]               = useState<TaskType>(task?.type ?? 'task');

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), description: description.trim(), priority, type });
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        {isEditing ? 'Редактировать задачу' : 'Новая задача'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.body}>
                    <div className={styles.field}>
                        <label className={styles.label}>Название *</label>
                        <input
                            className={styles.input}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Название задачи"
                            autoFocus
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Описание</label>
                        <textarea
                            className={styles.textarea}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Описание (необязательно)"
                            rows={3}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Тип</label>
                            <select
                                className={styles.select}
                                value={type}
                                onChange={e => setType(e.target.value as TaskType)}
                            >
                                <option value="task">Task</option>
                                <option value="bug">Bug</option>
                                <option value="feature">Feature</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Приоритет</label>
                            <select
                                className={styles.select}
                                value={priority}
                                onChange={e => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
                    <button className={styles.submitBtn} onClick={handleSubmit}>
                        {isEditing ? 'Сохранить' : 'Создать'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}