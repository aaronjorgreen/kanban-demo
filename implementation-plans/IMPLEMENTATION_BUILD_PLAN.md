# 🏗️ Kanban Board — Implementation Build Plan

> **Project**: kanban-demo  
> **Type**: Frontend-only React application  
> **Repo**: [github.com/aaronjorgreen/kanban-demo](https://github.com/aaronjorgreen/kanban-demo)  
> **Project Board**: [GitHub Project #6](https://github.com/users/aaronjorgreen/projects/6)

---

## 1. Vision & Objectives

Build a polished, production-quality drag-and-drop Kanban board application that feels like a premium SaaS tool. The app is **frontend-only** (no backend), uses **localStorage** for persistence, and features a sleek glassmorphic light-mode design with depth and layering.

### Core Principles
- **State-driven drag & drop** — dragging a card updates its `status` property, not just its visual position
- **Full CRUD** — users can create, read, update, and delete both tasks and columns
- **Persistent** — all data survives page refreshes via localStorage
- **Polished UX** — every action has clear affordances (buttons, tooltips, indicators)
- **Accessible** — keyboard navigation and screen reader support via `@dnd-kit`

---

## 2. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Build Tool** | [Vite](https://vitejs.dev/) | Instant HMR, fast builds, zero-config React setup |
| **UI Framework** | React 18+ | Component model, hooks, context for state |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) | Modern, accessible, highly customizable, actively maintained |
| **Unique IDs** | `uuid` (v4) | Collision-free IDs for tasks and columns |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icon set with tree-shaking |
| **Styling** | Vanilla CSS (CSS Modules) | Full control for glassmorphism, gradients, and animations |
| **Persistence** | localStorage | No backend required |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |Modern, highly legible UI typeface |

---

## 3. Design System

### 3.1 Color Palette

```
/* --- Base --- */
--bg-primary:        #f0f2f5;        /* Page background — soft cool grey */
--bg-secondary:      #e4e7ec;        /* Column backgrounds */
--surface:           rgba(255, 255, 255, 0.65);  /* Glass card surface */
--surface-hover:     rgba(255, 255, 255, 0.85);  /* Glass card hover */
--border-glass:      rgba(255, 255, 255, 0.45);  /* Glass border */
--border-subtle:     #d1d5db;        /* Subtle dividers */

/* --- Text --- */
--text-primary:      #1a1d23;        /* Headings, card titles */
--text-secondary:    #6b7280;        /* Descriptions, meta */
--text-muted:        #9ca3af;        /* Placeholders */

/* --- Accent --- */
--accent-primary:    #6366f1;        /* Indigo — primary actions */
--accent-primary-hover: #4f46e5;
--accent-secondary:  #8b5cf6;        /* Violet — secondary accents */

/* --- Priority --- */
--priority-high:     #ef4444;        /* Red */
--priority-high-bg:  rgba(239, 68, 68, 0.1);
--priority-medium:   #f59e0b;        /* Amber */
--priority-medium-bg: rgba(245, 158, 11, 0.1);
--priority-low:      #10b981;        /* Emerald */
--priority-low-bg:   rgba(16, 185, 129, 0.1);

/* --- Status (Column Colors) --- */
--status-backlog:    #94a3b8;        /* Slate */
--status-todo:       #6366f1;        /* Indigo */
--status-progress:   #f59e0b;        /* Amber */
--status-done:       #10b981;        /* Emerald */

/* --- Shadows & Glass --- */
--shadow-sm:         0 1px 3px rgba(0,0,0,0.06);
--shadow-md:         0 4px 12px rgba(0,0,0,0.08);
--shadow-lg:         0 8px 30px rgba(0,0,0,0.12);
--shadow-drag:       0 12px 40px rgba(99,102,241,0.2);
--glass-blur:        12px;
```

### 3.2 Glassmorphism Principles

- **Cards**: Semi-transparent white backgrounds (`rgba(255,255,255,0.65)`), `backdrop-filter: blur(12px)`, subtle white border, soft shadow
- **Modals**: Frosted glass overlay with deeper blur
- **Column headers**: Slight glass effect with colored accent strip on the left border
- **Depth stacking**: Background → Columns → Cards → Modals/Overlays, each layer progressively more opaque

### 3.3 Typography

```
--font-family:       'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-size-xs:      0.75rem;     /* 12px — badges, meta */
--font-size-sm:      0.8125rem;   /* 13px — descriptions */
--font-size-base:    0.875rem;    /* 14px — body text */
--font-size-md:      1rem;        /* 16px — card titles */
--font-size-lg:      1.125rem;    /* 18px — column headers */
--font-size-xl:      1.5rem;      /* 24px — page title */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold:  700;
```

### 3.4 Spacing & Radius

```
--space-xs:  4px;
--space-sm:  8px;
--space-md:  12px;
--space-lg:  16px;
--space-xl:  24px;
--space-2xl: 32px;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
```

### 3.5 Micro-Animations

| Element | Animation | Duration |
|---|---|---|
| Card hover | Scale up 1.02, shadow lift | 200ms ease |
| Card drag | Scale 1.05, rotate ±2°, elevated shadow, reduced opacity (0.85) | 150ms ease |
| Drop zone active | Subtle pulse border glow | 300ms ease-in-out |
| Card enter column | Fade in + slide down | 250ms ease-out |
| Modal open | Fade in + scale from 0.95 | 200ms ease-out |
| Modal close | Fade out + scale to 0.95 | 150ms ease-in |
| Priority badge | Gentle pulse on high priority | 2s infinite |
| Button hover | Background color shift + slight lift | 150ms ease |
| Delete action | Slide out + fade | 200ms ease-in |
| Toast notification | Slide in from top + fade | 300ms ease |

---

## 4. Data Architecture

### 4.1 Data Models

```javascript
// Column (represents a status)
{
  id: "col-uuid",
  title: "In Progress",
  color: "#f59e0b",       // Accent color for the column
  order: 2,               // Position in the board
  createdAt: "ISO-8601"
}

// Task (represents an item with state)
{
  id: "task-uuid",
  title: "Implement drag and drop",
  description: "Add @dnd-kit integration for card movement between columns",
  priority: "high",       // "low" | "medium" | "high"
  assignee: "Aaron",      // Free-text assignee name
  columnId: "col-uuid",   // Foreign key → column.id (this IS the task's status)
  order: 0,               // Position within the column
  subtasks: [
    { id: "sub-uuid", text: "Install @dnd-kit", completed: true },
    { id: "sub-uuid", text: "Create drag overlay", completed: false }
  ],
  createdAt: "ISO-8601",
  updatedAt: "ISO-8601"
}
```

### 4.2 State Shape

```javascript
{
  columns: Column[],      // Ordered array of columns
  tasks: Task[],          // All tasks across all columns
  searchQuery: "",        // Current search/filter text
  filterPriority: null,   // null | "low" | "medium" | "high"
  filterAssignee: null    // null | "assignee name"
}
```

### 4.3 localStorage Strategy

- **Key**: `kanban-board-data`
- **Value**: JSON stringified `{ columns, tasks }`
- **Sync**: Debounced write (300ms) on every state mutation via a `useEffect` hook
- **Load**: On app mount, hydrate state from localStorage or fall back to default seed data
- **Seed data**: Pre-populate 4 default columns and 6-8 sample tasks to demonstrate the app on first load

---

## 5. Component Architecture

```
src/
├── main.jsx                          # Entry point
├── App.jsx                           # Root component, state provider
├── App.module.css
│
├── context/
│   └── BoardContext.jsx              # React Context + useReducer for global state
│
├── hooks/
│   ├── useLocalStorage.js            # Debounced localStorage read/write
│   └── useBoardActions.js            # Dispatch helpers (addTask, moveTask, etc.)
│
├── components/
│   ├── Header/
│   │   ├── Header.jsx                # App title, search bar, filter controls
│   │   └── Header.module.css
│   │
│   ├── Board/
│   │   ├── Board.jsx                 # DndContext wrapper, horizontal column layout
│   │   └── Board.module.css
│   │
│   ├── Column/
│   │   ├── Column.jsx                # Single column: header, task list, add button
│   │   ├── Column.module.css
│   │   ├── ColumnHeader.jsx          # Title, task count badge, edit/delete buttons
│   │   └── ColumnHeader.module.css
│   │
│   ├── TaskCard/
│   │   ├── TaskCard.jsx              # Draggable card: title, priority, assignee, subtasks
│   │   ├── TaskCard.module.css
│   │   ├── PriorityBadge.jsx         # Colored priority indicator
│   │   ├── PriorityBadge.module.css
│   │   ├── SubtaskProgress.jsx       # Mini progress bar for subtasks
│   │   └── SubtaskProgress.module.css
│   │
│   ├── DragOverlay/
│   │   ├── DragOverlay.jsx           # Custom drag preview (ghost card)
│   │   └── DragOverlay.module.css
│   │
│   ├── Modals/
│   │   ├── TaskModal.jsx             # Add/Edit task modal (shared form)
│   │   ├── TaskModal.module.css
│   │   ├── ColumnModal.jsx           # Add/Edit column modal
│   │   ├── ColumnModal.module.css
│   │   ├── DeleteConfirmModal.jsx    # Confirm delete dialog
│   │   └── DeleteConfirmModal.module.css
│   │
│   ├── Toast/
│   │   ├── Toast.jsx                 # Notification toasts for actions
│   │   └── Toast.module.css
│   │
│   └── common/
│       ├── Button.jsx                # Reusable button (primary, secondary, danger, ghost)
│       ├── Button.module.css
│       ├── IconButton.jsx            # Small icon-only action button (edit, delete, etc.)
│       ├── IconButton.module.css
│       ├── Badge.jsx                 # Count badge, status badge
│       ├── Badge.module.css
│       ├── Input.jsx                 # Styled input field
│       ├── Input.module.css
│       ├── Textarea.jsx              # Styled textarea
│       ├── Textarea.module.css
│       ├── Select.jsx                # Styled dropdown select
│       └── Select.module.css
│
├── utils/
│   ├── seedData.js                   # Default columns and sample tasks
│   ├── constants.js                  # Priority levels, colors, localStorage key
│   └── helpers.js                    # Utility functions (getTasksByColumn, etc.)
│
└── styles/
    ├── index.css                     # Global styles, CSS variables, resets
    ├── animations.css                # Keyframe animations
    └── glass.css                     # Reusable glassmorphism utility classes
```

### 5.1 Component Responsibility Breakdown

#### `BoardContext.jsx` — State Management
- Uses `useReducer` with action types: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `MOVE_TASK`, `REORDER_TASK`, `ADD_COLUMN`, `UPDATE_COLUMN`, `DELETE_COLUMN`, `REORDER_COLUMN`, `SET_FILTER`, `CLEAR_FILTERS`
- Wraps entire app via `<BoardProvider>`
- Exposes state and dispatch via `useBoardContext()` hook

#### `Board.jsx` — DnD Orchestrator
- Wraps columns in `<DndContext>` from `@dnd-kit/core`
- Handles `onDragStart`, `onDragOver`, `onDragEnd` events
- On `onDragEnd`: dispatches `MOVE_TASK` with new `columnId` and `order` — this is where the **status update** happens
- Renders custom `<DragOverlay>` for the dragged card ghost
- Columns are `<SortableContext>` containers with vertical sorting strategy

#### `Column.jsx` — Droppable Status Lane
- Registers as a droppable zone via `useDroppable`
- Renders `<ColumnHeader>` with title, task count badge, and action buttons (edit ✏️, delete 🗑️)
- Renders filtered/sorted `<TaskCard>` list
- Has a sticky `+ Add Task` button at the bottom
- Empty state: shows a dashed placeholder with "Drop tasks here" prompt

#### `TaskCard.jsx` — Draggable Item
- Uses `useSortable` from `@dnd-kit/sortable` for drag handle
- Displays: title, truncated description (2 lines), priority badge, assignee avatar/initial, subtask progress
- Action buttons on hover: edit ✏️, delete 🗑️ (IconButtons that appear on card hover)
- Click on card opens `<TaskModal>` in edit mode

#### `TaskModal.jsx` — Create/Edit Form
- Shared modal for both "Add" and "Edit" flows
- Fields: Title (required), Description (textarea), Priority (select dropdown), Assignee (text input), Column/Status (select dropdown)
- Subtasks section: list of subtask items with checkboxes, inline add/remove
- Footer: Save / Cancel buttons, Delete button (edit mode only)
- Glass overlay background with form card

#### `Header.jsx` — Toolbar
- App title/logo on the left
- Search input (filters tasks by title/description match)
- Priority filter dropdown
- Assignee filter dropdown (auto-populated from existing tasks)
- `+ New Column` button
- Clear filters button (appears when filters are active)

---

## 6. Drag & Drop Implementation Detail

### 6.1 @dnd-kit Setup

```
DndContext
├── sensors: [PointerSensor (activationConstraint: distance 8px)]
├── collisionDetection: closestCorners
│
├── SortableContext (column-1, vertical strategy)
│   ├── TaskCard (sortable)
│   ├── TaskCard (sortable)
│   └── TaskCard (sortable)
│
├── SortableContext (column-2, vertical strategy)
│   ├── TaskCard (sortable)
│   └── ...
│
└── DragOverlay
    └── TaskCard (clone, elevated style)
```

### 6.2 Drag Event Flow

1. **`onDragStart`** — Set `activeTask` in state, used to render DragOverlay
2. **`onDragOver`** — When dragging over a different column, optimistically move the task to the new column in state (provides real-time visual feedback)
3. **`onDragEnd`** — Finalize the move:
   - Determine destination `columnId` and `order` index
   - Dispatch `MOVE_TASK` action which updates `task.columnId` (= status change) and `task.order`
   - Update `task.updatedAt` timestamp
   - Show toast: "Task moved to {columnName}"
4. **`onDragCancel`** — Revert optimistic state change

### 6.3 Visual Feedback During Drag
- **Dragged card**: Slightly rotated (2°), elevated shadow, 85% opacity
- **Drop target column**: Left border glows with column accent color
- **Drop indicator**: Thin horizontal line appears between cards at the insertion point
- **Source position**: Faded placeholder remains to show original position

---

## 7. Feature Specification

### 7.1 Column CRUD

| Action | Trigger | Behavior |
|---|---|---|
| **Add** | `+ New Column` button in Header | Opens ColumnModal with title + color picker |
| **Edit** | ✏️ icon button on ColumnHeader | Opens ColumnModal pre-filled |
| **Delete** | 🗑️ icon button on ColumnHeader | Opens DeleteConfirmModal. If column has tasks, warns user and offers to move tasks to another column or delete all |
| **Reorder** | Future enhancement (drag columns) | Not in v1 scope |

### 7.2 Task CRUD

| Action | Trigger | Behavior |
|---|---|---|
| **Add** | `+ Add Task` button at column bottom | Opens TaskModal with column pre-selected |
| **View/Edit** | Click on task card | Opens TaskModal in edit mode, all fields editable |
| **Delete** | 🗑️ icon on card hover OR delete button in modal | Opens DeleteConfirmModal |
| **Move** | Drag and drop | Updates `columnId` (status) and `order` |
| **Toggle subtask** | Click checkbox on subtask | Toggles `subtask.completed`, updates progress bar |

### 7.3 Search & Filter

- **Search**: Real-time text filtering across task `title` and `description`
- **Priority filter**: Dropdown to show only Low / Medium / High tasks
- **Assignee filter**: Dropdown auto-populated from unique assignee values across all tasks
- **Stacking**: Filters are additive (AND logic)
- **Clear**: A single "Clear filters" button resets all
- **Visual**: When filters are active, columns show filtered count vs total count (e.g., "3 of 7 tasks")

### 7.4 Toast Notifications

| Event | Message |
|---|---|
| Task created | "✅ Task '{title}' created" |
| Task updated | "✏️ Task '{title}' updated" |
| Task deleted | "🗑️ Task deleted" |
| Task moved | "📋 Task moved to {columnName}" |
| Column created | "✅ Column '{title}' added" |
| Column deleted | "🗑️ Column deleted" |

---

## 8. Build Phases

### Phase 1 — Project Scaffolding & Design Foundation
Set up the Vite + React project, install dependencies, establish the CSS design system (variables, glassmorphism utilities, animations), and create the global layout shell.

### Phase 2 — State Management & Data Layer
Build the `BoardContext` with `useReducer`, implement all action types, create the `useLocalStorage` hook for persistence, and define seed data for the initial board state.

### Phase 3 — Board Layout & Columns
Build the `Board`, `Column`, and `ColumnHeader` components. Render columns horizontally with proper glassmorphism styling. Implement column CRUD (add, edit, delete) with modals.

### Phase 4 — Task Cards
Build the `TaskCard` component with priority badges, assignee display, subtask progress, and hover action buttons. Implement task CRUD (add, edit, delete) with the `TaskModal`.

### Phase 5 — Drag & Drop Integration
Integrate `@dnd-kit` into the board. Implement cross-column dragging with status updates. Add the custom `DragOverlay`, visual feedback (drag styles, drop indicators), and optimistic state updates.

### Phase 6 — Search, Filter & Polish
Build the `Header` with search input and filter dropdowns. Implement task filtering logic. Add toast notifications, empty states, and final micro-animation polish.

### Phase 7 — Testing, Seed Data & Final QA
Test all CRUD flows, drag-and-drop edge cases, localStorage persistence, and responsive behavior. Populate rich seed data. Final visual polish pass.

---

## 9. Verification Plan

### Automated
```bash
npm run build          # Verify production build completes without errors
npm run dev            # Verify dev server starts correctly
```

### Manual Verification Checklist
- [ ] App loads with seed data on first visit
- [ ] Data persists after page refresh
- [ ] Can add a new column with custom title and color
- [ ] Can edit a column title and color
- [ ] Can delete a column (with task migration prompt)
- [ ] Can add a new task to any column
- [ ] Can edit all task fields (title, description, priority, assignee, subtasks)
- [ ] Can delete a task with confirmation
- [ ] Can drag a task between columns — status updates correctly
- [ ] Can reorder tasks within the same column
- [ ] Drag overlay appears with elevated card style
- [ ] Drop zone visual feedback works
- [ ] Task count badges update in real time
- [ ] Priority badges display correct colors (Low=green, Medium=amber, High=red)
- [ ] Search filters tasks across all columns
- [ ] Priority filter works
- [ ] Assignee filter works
- [ ] Filters stack correctly (AND logic)
- [ ] Toast notifications appear for all CRUD actions
- [ ] Glassmorphism effects render correctly (blur, transparency, borders)
- [ ] All micro-animations feel smooth (hover, drag, modal open/close)
- [ ] Empty column state displays correctly

---

## 10. Progress Checklist

### Phase 1 — Project Scaffolding & Design Foundation
- [ ] Initialize Vite + React project (`npx create-vite`)
- [ ] Install dependencies (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `uuid`, `lucide-react`)
- [ ] Set up folder structure (`components/`, `context/`, `hooks/`, `utils/`, `styles/`)
- [ ] Create `index.css` with CSS variables (colors, typography, spacing, shadows)
- [ ] Create `glass.css` with glassmorphism utility classes
- [ ] Create `animations.css` with keyframe definitions
- [ ] Import Google Font (Inter)
- [ ] Build `App.jsx` root layout shell (header area + board area)
- [ ] Build `App.module.css` with page layout

### Phase 2 — State Management & Data Layer
- [ ] Create `utils/constants.js` (priority levels, colors, localStorage key)
- [ ] Create `utils/seedData.js` (4 default columns + 6-8 sample tasks)
- [ ] Create `utils/helpers.js` (getTasksByColumn, getUniqueAssignees, etc.)
- [ ] Create `context/BoardContext.jsx` with `useReducer`
- [ ] Implement all reducer actions (`ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `MOVE_TASK`, `REORDER_TASK`, `ADD_COLUMN`, `UPDATE_COLUMN`, `DELETE_COLUMN`, `SET_FILTER`, `CLEAR_FILTERS`)
- [ ] Create `hooks/useLocalStorage.js` (debounced read/write)
- [ ] Create `hooks/useBoardActions.js` (dispatch helper functions)
- [ ] Wire localStorage persistence into BoardContext
- [ ] Verify: state initializes from localStorage or seed data

### Phase 3 — Board Layout & Columns
- [ ] Build common components: `Button`, `IconButton`, `Badge`, `Input`, `Textarea`, `Select`
- [ ] Build `Board.jsx` — horizontal scrollable column container
- [ ] Build `Column.jsx` — individual column with droppable area
- [ ] Build `ColumnHeader.jsx` — title, color accent, task count, edit/delete buttons
- [ ] Build `ColumnModal.jsx` — add/edit column form (title + color)
- [ ] Build `DeleteConfirmModal.jsx` — reusable confirmation dialog
- [ ] Style all column components with glassmorphism
- [ ] Wire column CRUD actions to context
- [ ] Verify: can add, edit, delete columns

### Phase 4 — Task Cards
- [ ] Build `PriorityBadge.jsx` — colored priority label
- [ ] Build `SubtaskProgress.jsx` — mini progress bar
- [ ] Build `TaskCard.jsx` — full card with all display elements
- [ ] Build `TaskModal.jsx` — add/edit task form with subtask management
- [ ] Style cards with glassmorphism, hover effects
- [ ] Add hover-reveal action buttons (edit, delete)
- [ ] Wire task CRUD actions to context
- [ ] Verify: can add, edit, delete tasks; subtask toggling works

### Phase 5 — Drag & Drop Integration
- [ ] Set up `DndContext` in `Board.jsx` with PointerSensor
- [ ] Add `SortableContext` to each `Column`
- [ ] Make `TaskCard` sortable with `useSortable`
- [ ] Implement `onDragStart` — set active task
- [ ] Implement `onDragOver` — optimistic column transfer
- [ ] Implement `onDragEnd` — finalize move, dispatch `MOVE_TASK`
- [ ] Implement `onDragCancel` — revert state
- [ ] Build `DragOverlay.jsx` — custom ghost card
- [ ] Add drag visual feedback (rotation, shadow, opacity)
- [ ] Add drop zone indicators (border glow, insertion line)
- [ ] Verify: cross-column drag updates `columnId` (status); within-column reorder works

### Phase 6 — Search, Filter & Polish
- [ ] Build `Header.jsx` — app title, search bar, filter controls
- [ ] Implement search filtering (title + description text match)
- [ ] Implement priority filter dropdown
- [ ] Implement assignee filter dropdown (auto-populated)
- [ ] Add filter stacking (AND logic)
- [ ] Add "Clear filters" button with visibility toggle
- [ ] Show filtered vs total task counts on columns
- [ ] Build `Toast.jsx` — notification component
- [ ] Add toast triggers for all CRUD and move actions
- [ ] Add empty column state UI
- [ ] Final micro-animation polish pass
- [ ] Verify: all filters work, toasts appear, animations are smooth

### Phase 7 — Testing & Final QA
- [ ] Test all CRUD flows end-to-end
- [ ] Test drag-and-drop across all columns
- [ ] Test localStorage persistence (refresh, clear, corrupt data recovery)
- [ ] Test edge cases (empty board, single column, max tasks)
- [ ] Enrich seed data with realistic task content
- [ ] Final visual polish (spacing, alignment, color consistency)
- [ ] Verify production build (`npm run build`)
- [ ] Push to GitHub repository

---

## 11. File Inventory Summary

| Category | Count |
|---|---|
| Components | ~22 files (JSX + CSS modules) |
| Context / Hooks | 3 files |
| Utilities | 3 files |
| Global Styles | 3 files |
| Config / Entry | 3 files (`main.jsx`, `App.jsx`, `index.html`) |
| **Total** | **~34 files** |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `backdrop-filter` not supported in older browsers | Progressive enhancement — cards still look good without blur |
| localStorage quota exceeded | Unlikely for this scale; add try/catch with user warning |
| Drag performance with many cards | `@dnd-kit` is optimized; use `React.memo` on TaskCard |
| State corruption from bad localStorage data | Validate data shape on load; fall back to seed data if invalid |

---

> **Next Step**: Upon approval, we begin **Phase 1 — Project Scaffolding & Design Foundation**.
