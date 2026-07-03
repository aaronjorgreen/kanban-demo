import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultColumns, defaultTasks } from '../utils/seedData';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import { isValidState } from '../utils/helpers';

// Create context
const BoardContext = createContext(null);

// Action Types
export const BOARD_ACTIONS = {
  // Task actions
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
  
  // Column actions
  ADD_COLUMN: 'ADD_COLUMN',
  UPDATE_COLUMN: 'UPDATE_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  
  // Filter actions
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_PRIORITY_FILTER: 'SET_PRIORITY_FILTER',
  SET_ASSIGNEE_FILTER: 'SET_ASSIGNEE_FILTER',
  CLEAR_FILTERS: 'CLEAR_FILTERS'
};

// Initial state
const getInitialState = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidState(parsed)) {
        return {
          columns: parsed.columns,
          tasks: parsed.tasks,
          searchQuery: '',
          filterPriority: null,
          filterAssignee: null
        };
      }
    }
  } catch (error) {
    console.error('Failed to parse localStorage data:', error);
  }
  
  return {
    columns: defaultColumns,
    tasks: defaultTasks,
    searchQuery: '',
    filterPriority: null,
    filterAssignee: null
  };
};

// Reducer function
function boardReducer(state, action) {
  switch (action.type) {
    case BOARD_ACTIONS.ADD_TASK: {
      const { columnId, task } = action.payload;
      // Get all tasks in the target column
      const columnTasks = state.tasks.filter(t => t.columnId === columnId);
      const newTask = {
        ...task,
        columnId,
        order: columnTasks.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };
    }
    
    case BOARD_ACTIONS.UPDATE_TASK: {
      const { taskId, updates } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
            : task
        )
      };
    }
    
    case BOARD_ACTIONS.DELETE_TASK: {
      const { taskId } = action.payload;
      const targetTask = state.tasks.find(t => t.id === taskId);
      if (!targetTask) return state;
      
      // Remove task
      const remainingTasks = state.tasks.filter(t => t.id !== taskId);
      
      // Re-index remaining tasks in the same column
      const updatedTasks = remainingTasks.map(task => {
        if (task.columnId === targetTask.columnId && task.order > targetTask.order) {
          return { ...task, order: task.order - 1 };
        }
        return task;
      });
      
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case BOARD_ACTIONS.MOVE_TASK: {
      const { taskId, toColumnId, toIndex } = action.payload;
      const targetTask = state.tasks.find(t => t.id === taskId);
      if (!targetTask) return state;
      
      const fromColumnId = targetTask.columnId;
      const fromIndex = targetTask.order;
      
      let updatedTasks = [...state.tasks];
      
      if (fromColumnId === toColumnId) {
        // Moving within the same column
        const colTasks = updatedTasks
          .filter(t => t.columnId === fromColumnId)
          .sort((a, b) => a.order - b.order);
        
        // Remove from current index
        const [movedTask] = colTasks.splice(fromIndex, 1);
        // Insert at new index
        colTasks.splice(toIndex, 0, movedTask);
        
        // Update orders in the main array
        updatedTasks = updatedTasks.map(task => {
          if (task.columnId === fromColumnId) {
            const indexInSorted = colTasks.findIndex(t => t.id === task.id);
            return { 
              ...task, 
              order: indexInSorted,
              updatedAt: task.id === taskId ? new Date().toISOString() : task.updatedAt
            };
          }
          return task;
        });
      } else {
        // Moving to a different column
        // 1. Remove from source column and re-index following tasks
        updatedTasks = updatedTasks.map(task => {
          if (task.columnId === fromColumnId && task.order > fromIndex) {
            return { ...task, order: task.order - 1 };
          }
          return task;
        });
        
        // 2. Insert into destination column at toIndex and shift subsequent tasks
        updatedTasks = updatedTasks.map(task => {
          if (task.columnId === toColumnId && task.order >= toIndex) {
            return { ...task, order: task.order + 1 };
          }
          return task;
        });
        
        // 3. Update the moved task itself
        updatedTasks = updatedTasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              columnId: toColumnId,
              order: toIndex,
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        });
      }
      
      return {
        ...state,
        tasks: updatedTasks
      };
    }
    
    case BOARD_ACTIONS.ADD_COLUMN: {
      const { column } = action.payload;
      const newColumn = {
        ...column,
        order: state.columns.length,
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        columns: [...state.columns, newColumn]
      };
    }
    
    case BOARD_ACTIONS.UPDATE_COLUMN: {
      const { columnId, updates } = action.payload;
      return {
        ...state,
        columns: state.columns.map(col => 
          col.id === columnId ? { ...col, ...updates } : col
        )
      };
    }
    
    case BOARD_ACTIONS.DELETE_COLUMN: {
      const { columnId, migrationColumnId } = action.payload;
      const targetColumn = state.columns.find(c => c.id === columnId);
      if (!targetColumn) return state;
      
      // Remove the column
      const remainingColumns = state.columns.filter(c => c.id !== columnId);
      // Re-index remaining columns
      const updatedColumns = remainingColumns.map((col, index) => ({
        ...col,
        order: index
      }));
      
      let updatedTasks = [...state.tasks];
      
      if (migrationColumnId) {
        // Migrate tasks to another column
        const destColTasksCount = state.tasks.filter(t => t.columnId === migrationColumnId).length;
        
        updatedTasks = updatedTasks.map(task => {
          if (task.columnId === columnId) {
            // Task is in deleted column, migrate it to target column at the end
            const migratedTaskIndex = destColTasksCount + task.order;
            return {
              ...task,
              columnId: migrationColumnId,
              order: migratedTaskIndex,
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        });
      } else {
        // Delete all tasks in the deleted column
        updatedTasks = updatedTasks.filter(task => task.columnId !== columnId);
      }
      
      return {
        ...state,
        columns: updatedColumns,
        tasks: updatedTasks
      };
    }
    
    case BOARD_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };
      
    case BOARD_ACTIONS.SET_PRIORITY_FILTER:
      return {
        ...state,
        filterPriority: action.payload
      };
      
    case BOARD_ACTIONS.SET_ASSIGNEE_FILTER:
      return {
        ...state,
        filterAssignee: action.payload
      };
      
    case BOARD_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        searchQuery: '',
        filterPriority: null,
        filterAssignee: null
      };
      
    default:
      return state;
  }
}

// Provider Component
export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(boardReducer, null, getInitialState);
  
  // debounced write to local storage
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        columns: state.columns,
        tasks: state.tasks
      }));
    }, 300); // 300ms debounce
    
    return () => clearTimeout(handler);
  }, [state.columns, state.tasks]);
  
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

// Custom hook to use Board Context
export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider');
  }
  return context;
}
