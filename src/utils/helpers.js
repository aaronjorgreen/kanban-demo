/**
 * Filters and sorts tasks belonging to a specific column by their order field.
 */
export const getTasksByColumn = (tasks, columnId) => {
  return tasks
    .filter(task => task.columnId === columnId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Extracts a list of unique assignee names from all tasks, excluding empty names.
 */
export const getUniqueAssignees = (tasks) => {
  const assignees = tasks
    .map(task => task.assignee)
    .filter(assignee => assignee && assignee.trim() !== '');
  return [...new Set(assignees)];
};

/**
 * Reorders items in an array from startIndex to endIndex.
 */
export const reorderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Validates whether the loaded state matches our expected schema.
 */
export const isValidState = (state) => {
  if (!state || typeof state !== 'object') return false;
  if (!Array.isArray(state.columns) || !Array.isArray(state.tasks)) return false;
  return true;
};
