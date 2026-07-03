export const LOCAL_STORAGE_KEY = 'kanban-board-data';

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PRIORITY_DETAILS = {
  [PRIORITIES.LOW]: {
    label: 'Low',
    color: 'var(--priority-low)',
    bgColor: 'var(--priority-low-bg)'
  },
  [PRIORITIES.MEDIUM]: {
    label: 'Medium',
    color: 'var(--priority-medium)',
    bgColor: 'var(--priority-medium-bg)'
  },
  [PRIORITIES.HIGH]: {
    label: 'High',
    color: 'var(--priority-high)',
    bgColor: 'var(--priority-high-bg)'
  }
};

export const DEFAULT_COLUMN_COLORS = {
  BACKLOG: '#94a3b8',   // Slate
  TODO: '#6366f1',      // Indigo
  PROGRESS: '#f59e0b',  // Amber
  DONE: '#10b981'       // Emerald
};
