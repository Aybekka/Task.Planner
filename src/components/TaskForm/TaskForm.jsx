import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../store/tasksSlice";
import { selectLanguage } from "../../store/uiSlice";
import { useT } from "../../i18n/useT";
import styles from "./TaskForm.module.css";

export default function TaskForm() {
  const dispatch = useDispatch();
  const t = useT();
  const lang = useSelector(selectLanguage);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch(addTask({ text: trimmed, priority, dueDate: dueDate || null }));
    setText("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.taskForm.placeholder}
      />
      <select
        className={styles.select}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Priority"
      >
        <option value="low">{t.taskForm.low}</option>
        <option value="medium">{t.taskForm.medium}</option>
        <option value="high">{t.taskForm.high}</option>
      </select>
      <input
        className={styles.dateInput}
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
        lang={lang === "tr" ? "tr" : "en"}
      />
      <button className={styles.addBtn} type="submit">{t.taskForm.add}</button>
    </form>
  );
}
