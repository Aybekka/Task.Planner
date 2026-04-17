import { saveLocalData, saveCloudData } from "../firebase/userData";

function extractSaveData(state) {
  const { tasks, filters, ui } = state;
  return { tasks, filters, ui: { darkMode: ui.darkMode, language: ui.language } };
}

// Creates a middleware that saves to localStorage immediately and Firestore debounced
export function createSyncMiddleware(uid) {
  let cloudTimer = null;

  return (store) => (next) => (action) => {
    const result = next(action);
    const data = extractSaveData(store.getState());

    // Immediate local cache
    saveLocalData(uid, data);

    // Debounced cloud sync (1.5s after last action)
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => saveCloudData(uid, data), 1500);

    return result;
  };
}
