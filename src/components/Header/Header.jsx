import { useSelector, useDispatch } from "react-redux";
import { selectTaskCounts } from "../../store/tasksSlice";
import { clearCompleted } from "../../store/tasksSlice";
import {
  selectStatusFilter, setStatusFilter, StatusFilter,
  selectPriorityFilter, setPriorityFilter, PriorityFilter,
} from "../../store/filtersSlice";
import { toggleLanguage } from "../../store/uiSlice";
import { useT } from "../../i18n/useT";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();
  const t = useT();
  const { completed, active } = useSelector(selectTaskCounts);
  const currentStatus = useSelector(selectStatusFilter);
  const currentPriority = useSelector(selectPriorityFilter);

  const STATUS_FILTERS = [
    { label: t.statusFilter.all,    value: StatusFilter.All },
    { label: t.statusFilter.active, value: StatusFilter.Active },
    { label: t.statusFilter.done,   value: StatusFilter.Completed },
  ];

  const PRIORITY_FILTERS = [
    { label: t.priorityFilter.all,  value: PriorityFilter.All },
    { label: t.priorityFilter.low,  value: PriorityFilter.Low },
    { label: t.priorityFilter.med,  value: PriorityFilter.Medium },
    { label: t.priorityFilter.high, value: PriorityFilter.High },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{t.header.title}</h1>
        <div className={styles.titleActions}>
          <button
            className={styles.langBtn}
            onClick={() => dispatch(toggleLanguage())}
            title="Switch language"
          >
            {t.header.language}
          </button>
          <DarkModeToggle />
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.left}>
          <div className={styles.counts}>
            <span className={styles.countBadge}>{t.header.done}: <strong>{completed}</strong></span>
            <span className={styles.countBadge}>{t.header.active}: <strong>{active}</strong></span>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t.header.status}</span>
            <div className={styles.filterRow}>
              {STATUS_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => dispatch(setStatusFilter(value))}
                  className={`${styles.filterBtn} ${currentStatus === value ? styles.active : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t.header.priority}</span>
            <div className={styles.filterRow}>
              {PRIORITY_FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => dispatch(setPriorityFilter(value))}
                  className={`${styles.filterBtn} ${currentPriority === value ? styles.active : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {completed > 0 && (
            <button
              className={styles.clearBtn}
              onClick={() => dispatch(clearCompleted())}
              title={t.header.clearDone}
            >
              {t.header.clearDone}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
