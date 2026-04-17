import { useState } from "react";
import { useT } from "../../i18n/useT";
import TextNote from "./TextNote/TextNote";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import styles from "./NotesPanel.module.css";

export default function NotesPanel({ taskId, notes, isOpen }) {
  const [activeTab, setActiveTab] = useState("text");
  const t = useT();

  if (!isOpen) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "text" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("text")}
        >
          ✏️ {t.notesPanel.text}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "draw" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("draw")}
        >
          🖊️ {t.notesPanel.draw}
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "text" ? (
          <TextNote taskId={taskId} text={notes.text} />
        ) : (
          <DrawingCanvas taskId={taskId} strokes={notes.strokes} />
        )}
      </div>
    </div>
  );
}
