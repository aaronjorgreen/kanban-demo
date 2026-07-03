export const defaultColumns = [
  {
    id: 'col-backlog',
    title: 'Backlog',
    color: '#94a3b8',
    order: 0,
    createdAt: new Date('2026-07-01T08:00:00Z').toISOString()
  },
  {
    id: 'col-todo',
    title: 'To Do',
    color: '#6366f1',
    order: 1,
    createdAt: new Date('2026-07-01T08:05:00Z').toISOString()
  },
  {
    id: 'col-progress',
    title: 'In Progress',
    color: '#f59e0b',
    order: 2,
    createdAt: new Date('2026-07-01T08:10:00Z').toISOString()
  },
  {
    id: 'col-done',
    title: 'Done',
    color: '#10b981',
    order: 3,
    createdAt: new Date('2026-07-01T08:15:00Z').toISOString()
  }
];

export const defaultTasks = [
  {
    id: 'task-1',
    title: 'Explore the codebase structure',
    description: 'Review the folder layout under src/, including global styles and utility layers.',
    priority: 'low',
    assignee: 'Aaron',
    columnId: 'col-done',
    order: 0,
    subtasks: [
      { id: 'subtask-1-1', text: 'Inspect folder layout', completed: true },
      { id: 'subtask-1-2', text: 'Verify css imports', completed: true }
    ],
    createdAt: new Date('2026-07-02T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-02T09:30:00Z').toISOString()
  },
  {
    id: 'task-2',
    title: 'Setup GitHub repository labels',
    description: 'Ensure all required labels are configured in the repository prior to code edits.',
    priority: 'medium',
    assignee: 'Aaron',
    columnId: 'col-done',
    order: 1,
    subtasks: [],
    createdAt: new Date('2026-07-02T09:10:00Z').toISOString(),
    updatedAt: new Date('2026-07-03T10:00:00Z').toISOString()
  },
  {
    id: 'task-3',
    title: 'Build state management reducer',
    description: 'Implement BoardContext useReducer actions and support localStorage persistence.',
    priority: 'high',
    assignee: 'Antigravity',
    columnId: 'col-progress',
    order: 0,
    subtasks: [
      { id: 'subtask-3-1', text: 'Create constants.js', completed: true },
      { id: 'subtask-3-2', text: 'Write seedData.js', completed: true },
      { id: 'subtask-3-3', text: 'Define reducer logic', completed: false }
    ],
    createdAt: new Date('2026-07-03T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-03T22:00:00Z').toISOString()
  },
  {
    id: 'task-4',
    title: 'Design glassmorphism UI board layout',
    description: 'Create the application shell styling using CSS modules and radial gradients for transparency.',
    priority: 'medium',
    assignee: 'Antigravity',
    columnId: 'col-todo',
    order: 0,
    subtasks: [],
    createdAt: new Date('2026-07-03T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-03T10:00:00Z').toISOString()
  },
  {
    id: 'task-5',
    title: 'Integrate @dnd-kit sortable lists',
    description: 'Set up vertical sorting and cross-column card drag movements.',
    priority: 'high',
    assignee: 'Antigravity',
    columnId: 'col-backlog',
    order: 0,
    subtasks: [
      { id: 'subtask-5-1', text: 'Add DndContext provider', completed: false },
      { id: 'subtask-5-2', text: 'Implement SortableContext', completed: false }
    ],
    createdAt: new Date('2026-07-03T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-03T11:00:00Z').toISOString()
  },
  {
    id: 'task-6',
    title: 'Add toast alert systems',
    description: 'Provide micro-feedback for user actions including creation, updates, and drags.',
    priority: 'low',
    assignee: 'Aaron',
    columnId: 'col-backlog',
    order: 1,
    subtasks: [],
    createdAt: new Date('2026-07-03T12:00:00Z').toISOString(),
    updatedAt: new Date('2026-07-03T12:00:00Z').toISOString()
  }
];
