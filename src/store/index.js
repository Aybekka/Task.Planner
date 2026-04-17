import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import filtersReducer from "./filtersSlice";
import uiReducer from "./uiSlice";
import { createSyncMiddleware } from "../middleware/syncMiddleware";

export function createAppStore(uid, preloadedState) {
  if (preloadedState?.ui) preloadedState.ui.expandedNotes = {};
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      filters: filtersReducer,
      ui: uiReducer,
    },
    preloadedState: preloadedState ?? undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(createSyncMiddleware(uid)),
  });
}
