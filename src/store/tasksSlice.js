import { createSlice } from "@reduxjs/toolkit";
import { arrayMove } from "@dnd-kit/sortable";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeTask(text, priority = "medium", dueDate = null, order = 0) {
  return {
    id: makeId(),
    text,
    completed: false,
    priority,
    dueDate,
    order,
    subtasks: [],
    notes: { text: "", strokes: [] },
  };
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState: { items: [] },
  reducers: {
    addTask: (state, action) => {
      const { text, priority, dueDate } = typeof action.payload === "string"
        ? { text: action.payload, priority: "medium", dueDate: null }
        : action.payload;
      state.items.push(makeTask(text, priority, dueDate, state.items.length));
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.items.forEach((t, i) => { t.order = i; });
    },
    toggleTask: (state, action) => {
      const t = state.items.find((t) => t.id === action.payload);
      if (t) t.completed = !t.completed;
    },
    editTask: (state, action) => {
      const { id, text } = action.payload;
      const t = state.items.find((t) => t.id === id);
      if (t) t.text = text;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((t) => !t.completed);
      state.items.forEach((t, i) => { t.order = i; });
    },
    setPriority: (state, action) => {
      const { id, priority } = action.payload;
      const t = state.items.find((t) => t.id === id);
      if (t) t.priority = priority;
    },
    setDueDate: (state, action) => {
      const { id, dueDate } = action.payload;
      const t = state.items.find((t) => t.id === id);
      if (t) t.dueDate = dueDate;
    },
    reorderTasks: (state, action) => {
      const { activeId, overId } = action.payload;
      const oldIndex = state.items.findIndex((t) => t.id === activeId);
      const newIndex = state.items.findIndex((t) => t.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        state.items = arrayMove(state.items, oldIndex, newIndex);
        state.items.forEach((t, i) => { t.order = i; });
      }
    },
    addSubtask: (state, action) => {
      const { taskId, text } = action.payload;
      const t = state.items.find((t) => t.id === taskId);
      if (t) t.subtasks.push({ id: makeId(), text, completed: false });
    },
    toggleSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const t = state.items.find((t) => t.id === taskId);
      const s = t?.subtasks.find((s) => s.id === subtaskId);
      if (s) s.completed = !s.completed;
    },
    deleteSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const t = state.items.find((t) => t.id === taskId);
      if (t) t.subtasks = t.subtasks.filter((s) => s.id !== subtaskId);
    },
    updateNoteText: (state, action) => {
      const { taskId, text } = action.payload;
      const t = state.items.find((t) => t.id === taskId);
      if (t) t.notes.text = text;
    },
    addStroke: (state, action) => {
      const { taskId, stroke } = action.payload;
      const t = state.items.find((t) => t.id === taskId);
      if (t) t.notes.strokes.push({ ...stroke, id: makeId() });
    },
    clearStrokes: (state, action) => {
      const t = state.items.find((t) => t.id === action.payload);
      if (t) t.notes.strokes = [];
    },
  },
});

export const {
  addTask, deleteTask, toggleTask, editTask, clearCompleted,
  setPriority, setDueDate, reorderTasks,
  addSubtask, toggleSubtask, deleteSubtask,
  updateNoteText, addStroke, clearStrokes,
} = tasksSlice.actions;

export const selectTasks = (state) => state.tasks.items;

export const selectFilteredTasks = (state) => {
  const { items } = state.tasks;
  const { status, priority, searchQuery } = state.filters;
  const q = (searchQuery || "").toLowerCase();

  return items
    .filter((t) => {
      if (status === "active" && t.completed) return false;
      if (status === "completed" && !t.completed) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (q && !t.text.toLowerCase().includes(q)) return false;
      return true;
    })
    .slice()
    .sort((a, b) => a.order - b.order);
};

export const selectTaskCounts = (state) => {
  const tasks = state.tasks.items;
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length,
  };
};

export default tasksSlice.reducer;
