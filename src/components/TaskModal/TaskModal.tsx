'use client';

import { useReducer, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Task, TaskPriority, TaskType } from '@/src/types/board';
import styles from './TaskModal.module.css';

interface TaskModalProps {
    columnId: string;
    task?: Task;
    onSubmit: (data: {
        title: string;
        description: string;
        priority: TaskPriority;
        type: TaskType;
    }) => void;
    onClose: () => void;
}


interface FormState {
    title: string;
    description: string;
    priority: TaskPriority;
    type: TaskType;
    titleError: boolean;
}

type FormAction =
    | { type: 'SET_TITLE';       payload: string }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_PRIORITY';    payload: TaskPriority }
    | { type: 'SET_TYPE';        payload: TaskType }
    | { type: 'SET_ERROR';       payload: boolean };

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...state, title: action.payload, titleError: false };
        case 'SET_DESCRIPTION':
            return { ...state, description: action.payload };
        case 'SET_PRIORITY':
            return { ...state, priority: action.payload };
        case 'SET_TYPE':
            return { ...state, type: action.payload };
        case 'SET_ERROR':
            return { ...state, titleError: action.payload };
        default:
            return state;
    }
}


export default function TaskModal({ columnId, task, onSubmit, onClose }: TaskModalProps) {
    const isEditing = Boolean(task);

    const [form, formDispatch] = useReducer(formReducer, {
        title:       task?.title       ?? '',
        description: task?.description ?? '',
        priority:    task?.priority    ?? 'medium',
        type:        task?.type        ?? 'task',
        titleError:  false,
    });

    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            titleRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = () => {
        if (!form.title.trim()) {
            formDispatch({ type: 'SET_ERROR', payload: true });
            titleRef.current?.focus(); // фокусируем поле с ошибкой через ref
            return;
        }
        onSubmit({
            title:       form.title.trim(),
            description: form.description.trim(),
            priority:    form.priority,
            type:        form.type,
        });
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
                            ref={titleRef}
                            className={`${styles.input} ${form.titleError ? styles.inputError : ''}`}
                            value={form.title}
                            onChange={e => formDispatch({ type: 'SET_TITLE', payload: e.target.value })}
                            placeholder="Название задачи"
                        />
                        {form.titleError && (
                            <span className={styles.errorMsg}>Название обязательно</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Описание</label>
                        <textarea
                            className={styles.textarea}
                            value={form.description}
                            onChange={e => formDispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })}
                            placeholder="Описание (необязательно)"
                            rows={3}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Тип</label>
                            <select
                                className={styles.select}
                                value={form.type}
                                onChange={e => formDispatch({ type: 'SET_TYPE', payload: e.target.value as TaskType })}
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
                                value={form.priority}
                                onChange={e => formDispatch({ type: 'SET_PRIORITY', payload: e.target.value as TaskPriority })}
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