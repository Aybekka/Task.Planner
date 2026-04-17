import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSubtask, toggleSubtask, deleteSubtask } from "../../store/tasksSlice";
import { useT } from "../../i18n/useT";
import styles from "./SubtaskList.module.css";

export default function SubtaskList({ taskId, subtasks }) {
  const dispatch = useDispatch();
  const t = useT();
  const [text, setText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch(addSubtask({ taskId, text: trimmed }));
    setText("");
  };

  return (
    <div className={styles.wrapper}>
      {subtasks.map((s) => (
        <div key={s.id} className={`${styles.subtask} ${s.completed ? styles.completed : ""}`}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={s.completed}
            onChange={() => dispatch(toggleSubtask({ taskId, subtaskId: s.id }))}
          />
          <span className={styles.text}>{s.text}</span>
          <button
            className={styles.deleteBtn}
            onClick={() => dispatch(deleteSubtask({ taskId, subtaskId: s.id }))}
            aria-label="Delete subtask"
          >
            ×
          </button>
        </div>
      ))}
      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.addInput}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.subtaskList.placeholder}
        />
        <button className={styles.addBtn} type="submit" aria-label={t.subtaskList.addLabel}>+</button>
      </form>
    </div>
  );
}
