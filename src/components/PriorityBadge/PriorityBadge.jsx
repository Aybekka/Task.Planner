import { useT } from "../../i18n/useT";
import styles from "./PriorityBadge.module.css";

export default function PriorityBadge({ priority }) {
  const t = useT();
  if (!priority || priority === "medium") return null;
  return (
    <span className={`${styles.badge} ${styles[priority]}`}>
      {t.priority[priority]}
    </span>
  );
}
