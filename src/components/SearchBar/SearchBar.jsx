import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, selectSearchQuery } from "../../store/filtersSlice";
import { useT } from "../../i18n/useT";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const dispatch = useDispatch();
  const t = useT();
  const query = useSelector(selectSearchQuery);

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="search"
        placeholder={t.searchBar.placeholder}
        value={query}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        aria-label={t.searchBar.placeholder}
      />
      {query && (
        <button
          className={styles.clearBtn}
          onClick={() => dispatch(setSearchQuery(""))}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
