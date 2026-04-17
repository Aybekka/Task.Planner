import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: false,
    language: "en",
    expandedNotes: {},
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    toggleLanguage(state) {
      state.language = state.language === "en" ? "tr" : "en";
    },
    toggleNotesPanel(state, action) {
      const id = action.payload;
      state.expandedNotes[id] = !state.expandedNotes[id];
    },
  },
});

export const { toggleDarkMode, toggleLanguage, toggleNotesPanel } = uiSlice.actions;

export const selectDarkMode = (state) => state.ui.darkMode;
export const selectLanguage = (state) => state.ui.language ?? "en";
export const selectNotesExpanded = (taskId) => (state) =>
  !!state.ui.expandedNotes?.[taskId];

export default uiSlice.reducer;
