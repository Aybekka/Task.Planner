import { getActiveProfileId, dataKey } from "../profiles/profileStorage";

const LEGACY_KEY = "taskPlanner_v1";

function getStorageKey() {
  const id = getActiveProfileId();
  return id ? dataKey(id) : LEGACY_KEY;
}

export const loadState = () => {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed.ui) parsed.ui.expandedNotes = {};
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
      getStorageKey(),
      JSON.stringify({
        tasks,
        filters,
        ui: { darkMode: ui.darkMode, language: ui.language },
      })
    );
  } catch {}
  return result;
};
