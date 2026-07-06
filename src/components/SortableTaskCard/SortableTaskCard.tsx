'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/src/types/board';
import TaskCard from '@/src/components/TaskCard/TaskCard';
import React from "react";

interface SortableTaskCardProps {
    task: Task;
    columnId: string;
}

export default function SortableTaskCard({ task, columnId }: SortableTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    } as React.CSSProperties;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} columnId={columnId} isDragging={isDragging} />
        </div>
    );
}