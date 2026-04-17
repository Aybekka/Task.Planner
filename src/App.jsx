import { useDispatch } from "react-redux";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { reorderTasks } from "./store/tasksSlice";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskList from "./components/TaskList/TaskList";
import styles from "./App.module.css";

export default function App({ onSignOut, userProfile }) {
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd({ active, over }) {
    if (over && active.id !== over.id) {
      dispatch(reorderTasks({ activeId: active.id, overId: over.id }));
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Header onSignOut={onSignOut} userProfile={userProfile} />
        <SearchBar />
        <TaskForm />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <TaskList />
        </DndContext>
      </div>
    </div>
  );
}
