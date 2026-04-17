import { useDispatch } from "react-redux";
import { updateNoteText } from "../../../store/tasksSlice";
import { useT } from "../../../i18n/useT";
import styles from "./TextNote.module.css";

export default function TextNote({ taskId, text }) {
  const dispatch = useDispatch();
  const t = useT();
  return (
    <textarea
      className={styles.textarea}
      value={text}
      onChange={(e) => dispatch(updateNoteText({ taskId, text: e.target.value }))}
      placeholder={t.textNote.placeholder}
      rows={5}
    />
  );
}
