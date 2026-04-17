import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, selectDarkMode } from "../../store/uiSlice";
import styles from "./DarkModeToggle.module.css";

export default function DarkModeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  return (
    <button
      className={styles.btn}
      onClick={() => dispatch(toggleDarkMode())}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
