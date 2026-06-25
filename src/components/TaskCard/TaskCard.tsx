import {Task} from "@/src/types/board";
import styles from "./TaskCard.module.css";
interface TaskCardProps {
    task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
    return(
      <div className={styles.card}>
          <h3 className={styles.title}>{task.title}</h3>
          {task.description && (
              <p className={styles.description}>{task.description}</p>
          )}
      </div>
    );
}