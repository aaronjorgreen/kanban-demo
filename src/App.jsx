import React, { useState } from 'react';
import { useBoardContext } from './context/BoardContext';
import { useBoardActions } from './hooks/useBoardActions';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import TaskCard from './components/TaskCard/TaskCard';
import TaskModal from './components/Modals/TaskModal';
import ColumnModal from './components/Modals/ColumnModal';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal';
import styles from './App.module.css';

function App() {
  const { state } = useBoardContext();
  const { deleteColumn } = useBoardActions();

  // Task Modal states
  const [activeTask, setActiveTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  // Column Modal states
  const [activeColumn, setActiveColumn] = useState(null);
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [colToDeleteId, setColToDeleteId] = useState(null);

  // Task handlers
  const handleAddTask = (columnId) => {
    setActiveTask(null);
    setDefaultColumnId(columnId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setActiveTask(task);
    setDefaultColumnId(task.columnId);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTaskClick = (taskId) => {
    setTaskToDeleteId(taskId);
  };

  const handleTaskModalClose = () => {
    setActiveTask(null);
    setDefaultColumnId(null);
    setIsTaskModalOpen(false);
  };

  // Column handlers
  const handleAddColumn = () => {
    setActiveColumn(null);
    setIsColModalOpen(true);
  };

  const handleEditColumn = (column) => {
    setActiveColumn(column);
    setIsColModalOpen(true);
  };

  const handleDeleteColumnClick = (columnId) => {
    // Check if column has tasks
    const columnHasTasks = state.tasks.some(t => t.columnId === columnId);
    if (columnHasTasks) {
      setColToDeleteId(columnId);
    } else {
      // Direct delete if empty
      deleteColumn(columnId);
    }
  };

  const handleColModalClose = () => {
    setActiveColumn(null);
    setIsColModalOpen(false);
  };

  // Helper to render task card inside Column component
  const renderTaskCard = (task) => (
    <TaskCard
      key={task.id}
      task={task}
      onClick={handleEditTask}
      onDelete={handleDeleteTaskClick}
    />
  );

  return (
    <div className={styles.appContainer}>
      <Header onAddColumnClick={handleAddColumn} />
      
      <main className={styles.appMain}>
        <Board 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onAddColumn={handleAddColumn}
          onEditColumn={handleEditColumn}
          onDeleteColumn={handleDeleteColumnClick}
          renderTaskCard={renderTaskCard}
        />
      </main>

      {/* Task Creation / Edition Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={activeTask}
          defaultColumnId={defaultColumnId}
          onClose={handleTaskModalClose}
          onDeleteTask={(taskId) => {
            setIsTaskModalOpen(false);
            setTaskToDeleteId(taskId);
          }}
        />
      )}

      {/* Task Deletion Confirmation Modal */}
      {taskToDeleteId && (
        <DeleteConfirmModal
          type="task"
          targetId={taskToDeleteId}
          onClose={() => setTaskToDeleteId(null)}
        />
      )}

      {/* Column Creation / Edition Modal */}
      {isColModalOpen && (
        <ColumnModal
          column={activeColumn}
          onClose={handleColModalClose}
        />
      )}

      {colToDeleteId && (
        <DeleteConfirmModal
          type="column"
          targetId={colToDeleteId}
          onClose={() => setColToDeleteId(null)}
        />
      )}
    </div>
  );
}

export default App;
