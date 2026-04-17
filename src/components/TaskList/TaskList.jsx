import { useSelector } from "react-redux";
import { selectFilteredTasks } from "../../store/tasksSlice";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskItem from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css";

export default function TaskList() {
  const tasks = useSelector(selectFilteredTasks);

  if (tasks.length === 0) {
    return <p className={styles.empty}>No tasks match your filters. Add one above!</p>;
  }

  return (
    <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
      <ul className={styles.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </SortableContext>
  );
}
