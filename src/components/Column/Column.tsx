import { Column as ColumnType, Task } from '@/src/types/board';
import styles from './Column.module.css';
import TaskCard from "@/src/components/TaskCard/TaskCard";

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export default function Column({ column, tasks }: ColumnProps) {
    return (
        <div className={styles.column}>
            <div className={styles.header}>
                <h2 className={styles.title}>{column.title}</h2>
                <span className={styles.count}>{tasks.length}</span>
            </div>

            <div className={styles.taskList}>
                {tasks.length === 0 ? (
                    <p className={styles.empty}>Нет задач</p>
                ) : (
                    tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
}