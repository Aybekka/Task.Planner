import { createSlice } from "@reduxjs/toolkit";

export const StatusFilter = {
  All: "all",
  Active: "active",
  Completed: "completed",
};

export const PriorityFilter = {
  All: "all",
  Low: "low",
  Medium: "medium",
  High: "high",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    status: StatusFilter.All,
    priority: PriorityFilter.All,
    searchQuery: "",
  },
  reducers: {
    setStatusFilter: (state, action) => { state.status = action.payload; },
    setPriorityFilter: (state, action) => { state.priority = action.payload; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
  },
});

export const { setStatusFilter, setPriorityFilter, setSearchQuery } = filtersSlice.actions;

export const selectStatusFilter = (state) => state.filters.status;
export const selectPriorityFilter = (state) => state.filters.priority;
export const selectSearchQuery = (state) => state.filters.searchQuery;

export default filtersSlice.reducer;
