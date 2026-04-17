import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import filtersReducer from "./filtersSlice";
import uiReducer from "./uiSlice";
import { localStorageMiddleware, loadState } from "../middleware/localStorageMiddleware";

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
