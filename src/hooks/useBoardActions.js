import { useBoardContext, BOARD_ACTIONS } from '../context/BoardContext';
import { useToast } from '../context/ToastContext';

export function useBoardActions() {
  const { state, dispatch } = useBoardContext();
  const { addToast } = useToast();

  const addTask = (columnId, task) => {
    dispatch({
      type: BOARD_ACTIONS.ADD_TASK,
      payload: { columnId, task }
    });
    addToast(`✅ Task "${task.title}" created`);
  };

  const updateTask = (taskId, updates) => {
    dispatch({
      type: BOARD_ACTIONS.UPDATE_TASK,
      payload: { taskId, updates }
    });
    addToast(`✏️ Task "${updates.title || 'updated'}" updated`);
  };

  const deleteTask = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    dispatch({
      type: BOARD_ACTIONS.DELETE_TASK,
      payload: { taskId }
    });
    addToast(`🗑️ Task "${task?.title || ''}" deleted`);
  };

  const moveTask = (taskId, toColumnId, toIndex) => {
    dispatch({
      type: BOARD_ACTIONS.MOVE_TASK,
      payload: { taskId, toColumnId, toIndex }
    });
  };

  const addColumn = (column) => {
    dispatch({
      type: BOARD_ACTIONS.ADD_COLUMN,
      payload: { column }
    });
    addToast(`✅ Column "${column.title}" added`);
  };

  const updateColumn = (columnId, updates) => {
    dispatch({
      type: BOARD_ACTIONS.UPDATE_COLUMN,
      payload: { columnId, updates }
    });
    addToast(`✏️ Column "${updates.title || 'updated'}" updated`);
  };

  const deleteColumn = (columnId, migrationColumnId = null) => {
    const col = state.columns.find(c => c.id === columnId);
    dispatch({
      type: BOARD_ACTIONS.DELETE_COLUMN,
      payload: { columnId, migrationColumnId }
    });
    addToast(`🗑️ Column "${col?.title || ''}" deleted`);
  };

  const setSearchQuery = (query) => {
    dispatch({
      type: BOARD_ACTIONS.SET_SEARCH_QUERY,
      payload: query
    });
  };

  const setPriorityFilter = (priority) => {
    dispatch({
      type: BOARD_ACTIONS.SET_PRIORITY_FILTER,
      payload: priority
    });
  };

  const setAssigneeFilter = (assignee) => {
    dispatch({
      type: BOARD_ACTIONS.SET_ASSIGNEE_FILTER,
      payload: assignee
    });
  };

  const clearFilters = () => {
    dispatch({
      type: BOARD_ACTIONS.CLEAR_FILTERS
    });
  };

  return {
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    setSearchQuery,
    setPriorityFilter,
    setAssigneeFilter,
    clearFilters
  };
}
