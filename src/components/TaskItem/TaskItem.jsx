import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteTask, toggleTask, editTask } from "../../store/tasksSlice";
import { toggleNotesPanel, selectNotesExpanded, selectLanguage } from "../../store/uiSlice";
import { useT } from "../../i18n/useT";
import PriorityBadge from "../PriorityBadge/PriorityBadge";
import SubtaskList from "../SubtaskList/SubtaskList";
import NotesPanel from "../NotesPanel/NotesPanel";
import styles from "./TaskItem.module.css";

function formatDate(iso, lang) {
  if (!iso) return null;
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

const TODAY = () => new Date().toISOString().slice(0, 10);

function isOverdue(dueDate) {
  if (!dueDate) return false;
  return dueDate < TODAY();
}

function isCritical(dueDate) {
  if (!dueDate) return false;
  return dueDate === TODAY();
}

export default function TaskItem({ task }) {
  const { id, text, completed, priority, dueDate, subtasks, notes } = task;
  const dispatch = useDispatch();
  const t = useT();
  const lang = useSelector(selectLanguage);
  const notesOpen = useSelector(selectNotesExpanded(id));
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [subtasksOpen, setSubtasksOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function saveEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== text) dispatch(editTask({ id, text: trimmed }));
    setIsEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") { setEditText(text); setIsEditing(false); }
  }

  const overdue = isOverdue(dueDate);
  const critical = !overdue && isCritical(dueDate);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${styles.wrapper} ${isDragging ? styles.dragging : ""} ${completed ? styles.completed : ""}`}
      {...attributes}
    >
      <div className={styles.item}>
        <span className={styles.dragHandle} {...listeners} aria-label={t.taskItem.dragLabel}>⠿</span>

        <input
          className={styles.checkbox}
          type="checkbox"
          checked={completed}
          onChange={() => dispatch(toggleTask(id))}
        />

        {isEditing ? (
          <input
            className={styles.editInput}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <p
            className={styles.text}
            onClick={() => dispatch(toggleTask(id))}
            onDoubleClick={() => { setEditText(text); setIsEditing(true); }}
            title={t.taskItem.clickToggle}
          >
            {text}
          </p>
        )}

        <div className={styles.meta}>
          <PriorityBadge priority={priority} />
          {dueDate && (
            <span className={`${styles.dueDate} ${overdue ? styles.overdue : ""} ${critical ? styles.critical : ""}`}>
              {overdue ? "⚠ " : critical ? "⚡ " : ""}{formatDate(dueDate, lang)}
            </span>
          )}
          <button
            className={`${styles.notesToggle} ${subtasksOpen ? styles.active : ""}`}
            onClick={() => setSubtasksOpen((o) => !o)}
            aria-label={subtasksOpen ? t.taskItem.subtasksOpen : t.taskItem.subtasksClose}
            title={t.taskItem.subtasksTitle}
          >
            ☑{subtasks.length > 0 ? ` ${subtasks.filter(s => s.completed).length}/${subtasks.length}` : ""}
          </button>
          <button
            className={`${styles.notesToggle} ${notesOpen ? styles.active : ""}`}
            onClick={() => dispatch(toggleNotesPanel(id))}
            aria-label={notesOpen ? t.taskItem.notesOpen : t.taskItem.notesClose}
            title={t.taskItem.notesTitle}
          >
            📝
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => dispatch(deleteTask(id))}
            aria-label={t.taskItem.deleteLabel}
          >
            ×
          </button>
        </div>
      </div>

      {subtasksOpen && <SubtaskList taskId={id} subtasks={subtasks} />}

      <NotesPanel taskId={id} notes={notes} isOpen={notesOpen} />
    </li>
  );
}
