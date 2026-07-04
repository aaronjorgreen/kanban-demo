import React, { useState } from 'react';
import { Kanban } from 'lucide-react';
import Board from './components/Board/Board';
import TaskCard from './components/TaskCard/TaskCard';
import TaskModal from './components/Modals/TaskModal';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal';
import styles from './App.module.css';

function App() {
  // Modal states for task CRUD
  const [activeTask, setActiveTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

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
      <header className={`${styles.appHeader} glass-header`}>
        <div className={styles.titleContainer}>
          <div className={styles.logo}>
            <Kanban size={28} strokeWidth={2.5} />
          </div>
          <h1 className={styles.logoText}>KanBan</h1>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>
          🤖 Developed by Antigravity AI
        </div>
      </header>
      
      <main className={styles.appMain}>
        <Board 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
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
            setIsTaskModalOpen(false); // Close task modal first
            setTaskToDeleteId(taskId); // Open confirm dialog
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
    </div>
  );
}

export default App;
