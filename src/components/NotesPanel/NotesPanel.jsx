import { useState, lazy, Suspense } from "react";
import { useT } from "../../i18n/useT";
import TextNote from "./TextNote/TextNote";
import styles from "./NotesPanel.module.css";

const DrawingCanvas = lazy(() => import("./DrawingCanvas/DrawingCanvas"));

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
          <Suspense fallback={<div className={styles.canvasLoader}>Loading…</div>}>
            <DrawingCanvas taskId={taskId} strokes={notes.strokes} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
