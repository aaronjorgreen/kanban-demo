import { useBoardContext, BOARD_ACTIONS } from '../context/BoardContext';

export function useBoardActions() {
  const { dispatch } = useBoardContext();

  const addTask = (columnId, task) => {
    dispatch({
      type: BOARD_ACTIONS.ADD_TASK,
      payload: { columnId, task }
    });
  };

  const updateTask = (taskId, updates) => {
    dispatch({
      type: BOARD_ACTIONS.UPDATE_TASK,
      payload: { taskId, updates }
    });
  };

  const deleteTask = (taskId) => {
    dispatch({
      type: BOARD_ACTIONS.DELETE_TASK,
      payload: { taskId }
    });
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
  };

  const updateColumn = (columnId, updates) => {
    dispatch({
      type: BOARD_ACTIONS.UPDATE_COLUMN,
      payload: { columnId, updates }
    });
  };

  const deleteColumn = (columnId, migrationColumnId = null) => {
    dispatch({
      type: BOARD_ACTIONS.DELETE_COLUMN,
      payload: { columnId, migrationColumnId }
    });
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
