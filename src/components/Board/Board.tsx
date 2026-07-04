'use client';

import { useAppSelector } from '@/src/store/hooks';
import Column from '@/src/components/Column/Column';
import styles from './Board.module.css';

export default function Board() {
    const tasks = useAppSelector(state => state.board.tasks);
    const columns = useAppSelector(state => state.board.columns);
    const columnOrder = useAppSelector(state => state.board.columnOrder);

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
                <div className={styles.board}>
                    {columnOrder.map(colId => {
                        const column = columns[colId];
                        const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
                        return (
                            <Column key={colId} column={column} tasks={columnTasks} />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}