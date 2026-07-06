'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '@/src/types/board';
import Column from '@/src/components/Column/Column';
import SortableTaskCard from '@/src/components/SortableTaskCard/SortableTaskCard';
import styles from './DroppableColumn.module.css';

interface DroppableColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export default function DroppableColumn({ column, tasks }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    return (
        <Column column={column} tasks={tasks}>
            {}
            <SortableContext
                items={tasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={`${styles.dropZone} ${isOver ? styles.isOver : ''}`}
                >
                    {tasks.map(task => (
                        <SortableTaskCard key={task.id} task={task} columnId={column.id} />
                    ))}
                </div>
            </SortableContext>
        </Column>
    );
}