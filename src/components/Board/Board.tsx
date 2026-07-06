'use client';

import { useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/src/store/hooks';
import { moveTask } from '@/src/features/board/boardSlice';
import { Task } from '@/src/types/board';
import DroppableColumn from '@/src/components/DroppableColumn/DroppableColumn';
import TaskCard from '@/src/components/TaskCard/TaskCard';
import styles from './Board.module.css';

import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';

export default function Board() {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(state => state.board.tasks);
    const columns = useAppSelector(state => state.board.columns);
    const columnOrder = useAppSelector(state => state.board.columnOrder);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );


    const findColumnByTaskId = useCallback((taskId: string): string | undefined => {
        return Object.values(columns).find(col =>
            col.taskIds.includes(taskId)
        )?.id;
    }, [columns]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const taskId = event.active.id as string;
        setActiveTask(tasks[taskId] ?? null);
    }, [tasks]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        const fromColumnId = findColumnByTaskId(taskId);
        if (!fromColumnId) return;

        let toColumnId: string;
        let toIndex: number;

        if (columns[overId]) {
            toColumnId = overId;
            toIndex = columns[overId].taskIds.length;
        } else {
            toColumnId = findColumnByTaskId(overId) ?? fromColumnId;
            const toColumn = columns[toColumnId];
            toIndex = toColumn.taskIds.indexOf(overId);
        }

        if (fromColumnId === toColumnId) {
            const currentIndex = columns[fromColumnId].taskIds.indexOf(taskId);
            if (currentIndex === toIndex) return;
        }

        dispatch(moveTask({ taskId, fromColumnId, toColumnId, toIndex }));
    }, [dispatch, columns, findColumnByTaskId]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <div className={styles.headerLeft}>
                        <span className={styles.logo}>Kanban</span>
                        <span className={styles.projectName}>My Project</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className={styles.board}>
                        {columnOrder.map(colId => {
                            const column = columns[colId];
                            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
                            return (
                                <DroppableColumn key={colId} column={column} tasks={columnTasks} />
                            );
                        })}
                    </div>

                    <DragOverlay dropAnimation={null}>
                        {activeTask ? (
                            <TaskCard task={activeTask} columnId="" isDragging />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    );
}