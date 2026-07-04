import React, { useState } from 'react';
import { useBoardContext } from '../../context/BoardContext';
import { useBoardActions } from '../../hooks/useBoardActions';
import Column from '../Column/Column';
import ColumnModal from '../Modals/ColumnModal';
import DeleteConfirmModal from '../Modals/DeleteConfirmModal';
import styles from './Board.module.css';

export default function Board({ 
  onAddTask, 
  onEditTask,
  renderTaskCard // helper to render task card from App.jsx
}) {
  const { state } = useBoardContext();
  const { deleteColumn } = useBoardActions();
  
  // Modal states
  const [editingColumn, setEditingColumn] = useState(null);
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [colToDeleteId, setColToDeleteId] = useState(null);
  
  // Filter tasks based on global search & filters
  const getFilteredTasks = () => {
    return state.tasks.filter(task => {
      // 1. Search Query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) return false;
      }
      
      // 2. Priority Filter
      if (state.filterPriority && task.priority !== state.filterPriority) {
        return false;
      }
      
      // 3. Assignee Filter
      if (state.filterAssignee && task.assignee !== state.filterAssignee) {
        return false;
      }
      
      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  const handleEditColumnClick = (column) => {
    setEditingColumn(column);
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
    setEditingColumn(null);
    setIsColModalOpen(false);
  };

  const handleAddColumnClick = () => {
    setEditingColumn(null);
    setIsColModalOpen(true);
  };

  return (
    <div className={styles.boardWrapper}>
      <div className={styles.boardColumns}>
        {state.columns
          .sort((a, b) => a.order - b.order)
          .map(col => {
            const colTasks = filteredTasks
              .filter(t => t.columnId === col.id)
              .sort((a, b) => a.order - b.order);
            const totalTasksCount = state.tasks.filter(t => t.columnId === col.id).length;
            
            return (
              <Column
                key={col.id}
                column={col}
                tasks={colTasks}
                allTasksCount={totalTasksCount}
                onEditColumn={handleEditColumnClick}
                onDeleteColumn={handleDeleteColumnClick}
                onAddTask={onAddTask}
                onEditTask={onEditTask}
                renderTaskCard={renderTaskCard}
              />
            );
          })}
          
        {/* Transparent column placeholder to trigger add column modal */}
        <div 
          className={`${styles.addColumnPlaceholder} glass-panel glass-panel-hover`}
          onClick={handleAddColumnClick}
        >
          <span>+ Add Column</span>
        </div>
      </div>

      {/* Modals */}
      {isColModalOpen && (
        <ColumnModal 
          column={editingColumn} 
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
