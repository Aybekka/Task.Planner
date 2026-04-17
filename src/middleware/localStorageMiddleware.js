const STORAGE_KEY = "taskPlanner_v1";

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    // Ensure ephemeral fields that are never persisted have safe defaults
    if (parsed.ui) {
      parsed.ui.expandedNotes = {};
    }
    return parsed;
  } catch {
    return undefined;
  }
};

export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const { tasks, filters, ui } = store.getState();
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        tasks,
        filters,
        ui: { darkMode: ui.darkMode, language: ui.language },
      })
    );
  } catch {}
  return result;
};
