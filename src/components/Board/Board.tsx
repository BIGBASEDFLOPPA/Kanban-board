import {BoardState} from "@/src/types/board";
import styles from "./Board.module.css";
import Column from "@/src/components/Column/Column";

const mockData: BoardState = {
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Настроить ESLint',
            description: 'Добавить правила для TypeScript',
            createdAt: Date.now()
        },
        'task-2': {id: 'task-2', title: 'Создать компоненты', createdAt: Date.now()},
        'task-3': {
            id: 'task-3',
            title: 'Подключить Redux',
            description: 'Настроить store и boardSlice',
            createdAt: Date.now()
        },
        'task-4': {
            id: 'task-4',
            title: 'Реализовать DnD',
            description: 'Перетаскивание карточек между колонками',
            createdAt: Date.now()
        },
        'task-5': {id: 'task-5', title: 'Написать README', createdAt: Date.now()},
    },
    columns: {
        'col-1': {id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2']},
        'col-2': {id: 'col-2', title: 'In Progress', taskIds: ['task-3', 'task-4']},
        'col-3': {id: 'col-3', title: 'Done', taskIds: ['task-5']},
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};

export default function Board(){
    const {tasks,columns,columnOrder} = mockData;
    return(
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

