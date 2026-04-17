# Task Planner

A futuristic, feature-rich task management app built with React, Redux Toolkit, and Vite. Supports bilingual UI, drag-and-drop reordering, per-task notes with a freehand drawing canvas, subtasks, priority levels, due dates, and full dark/light theming.

---

## Features

### Tasks
- **Add tasks** with a title, priority level (Low / Medium / High), and an optional due date
- **Toggle completion** by clicking the task text or the checkbox
- **Inline edit** by double-clicking the task text — confirm with Enter or blur, cancel with Escape
- **Delete** individual tasks or use **Clear Done** to remove all completed tasks at once
- **Drag and drop** to reorder tasks — grab the `⠿` handle on the left

### Due Dates
- Dates display in locale-aware format (DD/MM/YYYY in English, DD.MM.YYYY in Turkish)
- **Overdue** tasks show a red ⚠ indicator
- **Critical** tasks (due today) show an amber ⚡ indicator

### Filtering & Search
- **Status filter** — All / Active / Done
- **Priority filter** — All / Low / Medium / High
- **Live search** — filters tasks by text as you type
- All filters combine and persist across page refreshes

### Subtasks
- Each task can have any number of subtasks
- Subtasks can be toggled complete or deleted independently
- The subtask toggle button shows a `done/total` count badge
- Collapsed by default — click ☑ on the task to expand

### Notes Panel
- Each task has a collapsible notes panel (click 📝 to open)
- **Text tab** — a freehand text area for written notes
- **Draw tab** — a freehand drawing canvas with 6 pen tools

### Drawing Canvas
| Tool | Behaviour |
|---|---|
| Ballpoint | Thin, consistent line |
| Fountain | Pressure-sensitive width (stylus/tablet) |
| Marker | Wide, semi-transparent stroke |
| Pencil | Textured, slightly transparent |
| Highlighter | Very wide, multiply-blend overlay |
| Eraser | Removes painted pixels |

- Works with **mouse, touch, and pen/tablet** via the Pointer Events API
- Stylus pressure affects stroke width on the Fountain pen
- Canvas **auto-expands** when you draw near the bottom edge
- Canvas **auto-shrinks** when strokes are removed from the lower region
- 8 colour swatches adapt automatically between light and dark themes
- Stroke colours are stored theme-neutrally and re-adapt when the theme changes

### Dark Mode
- Toggle between light and dark themes via the header button
- All surfaces, borders, shadows, and canvas colours respond to the theme
- The date picker popup respects the active theme via `color-scheme`
- Theme preference persists across page refreshes

### Bilingual UI (EN / TR)
- Full English and Turkish translations for all UI text
- Switch instantly with the **EN / TR** button in the header
- Language preference persists across page refreshes
- Date formats and the date picker calendar localise to the selected language

---

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | React 18 |
| State management | Redux Toolkit |
| React–Redux binding | react-redux |
| Drag and drop | @dnd-kit/core + @dnd-kit/sortable |
| Freehand strokes | perfect-freehand |
| Build tool | Vite 5 |
| Styling | CSS Modules + CSS custom properties |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

The dev server runs at `http://localhost:5173` by default (increments the port if already in use).

---

## Project Structure

```
src/
├── styles/
│   └── variables.css              # All CSS custom properties (light + dark theme tokens)
├── store/
│   ├── index.js                   # Store setup with localStorage middleware
│   ├── tasksSlice.js              # Task CRUD, subtasks, notes, strokes, filtering
│   ├── filtersSlice.js            # Status / priority / search filter state
│   └── uiSlice.js                 # Dark mode, language, expanded notes panels
├── middleware/
│   └── localStorageMiddleware.js  # Custom persistence (no redux-persist)
├── i18n/
│   ├── translations.js            # All UI strings in EN and TR
│   └── useT.js                    # Hook that returns the active language's strings
└── components/
    ├── Header/                    # Filter controls, counts, clear-done, lang + theme toggle
    ├── SearchBar/                 # Live search input
    ├── TaskForm/                  # Add task form (title, priority, due date)
    ├── TaskList/                  # Sortable list wrapper
    ├── TaskItem/                  # Individual task row with all controls
    ├── PriorityBadge/             # Coloured low/high badge
    ├── DarkModeToggle/            # Theme toggle button
    ├── SubtaskList/               # Nested subtask list with add form
    └── NotesPanel/
        ├── NotesPanel.jsx         # Tab switcher (Text / Draw)
        ├── TextNote/              # Textarea for written notes
        └── DrawingCanvas/
            ├── DrawingCanvas.jsx  # Canvas with pointer events + auto-expand logic
            ├── strokeRenderer.js  # Pure render function using perfect-freehand
            └── penTools.js        # Tool configs + colour palette + theme adapter
```

---

## Persistence

All data is saved to `localStorage` under the key `taskPlanner_v1` using a custom Redux middleware. The following state is persisted:

- All tasks (text, completion, priority, due date, order, subtasks, notes, strokes)
- Active filters (status, priority, search query)
- UI preferences (dark mode, language)

The notes panel open/close state is intentionally **not** persisted — it resets on every page load.
