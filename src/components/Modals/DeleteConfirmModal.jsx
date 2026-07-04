import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useBoardContext } from '../../context/BoardContext';
import { useBoardActions } from '../../hooks/useBoardActions';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Select from '../common/Select';
import styles from './DeleteConfirmModal.module.css';

export default function DeleteConfirmModal({ type, targetId, onClose }) {
  const { state } = useBoardContext();
  const { deleteColumn, deleteTask } = useBoardActions();
  
  const [migrationColumnId, setMigrationColumnId] = useState('');
  const [shouldMigrate, setShouldMigrate] = useState(false);
  
  // Find other columns for migration
  const otherColumns = state.columns.filter(col => col.id !== targetId);
  const targetColTasks = state.tasks.filter(t => t.columnId === targetId);
  const columnHasTasks = targetColTasks.length > 0;

  useEffect(() => {
    if (otherColumns.length > 0) {
      setMigrationColumnId(otherColumns[0].id);
      setShouldMigrate(true); // Default to migrating
    }
  }, [state.columns, targetId]);

  const handleDelete = () => {
    if (type === 'column') {
      deleteColumn(targetId, shouldMigrate ? migrationColumnId : null);
    } else if (type === 'task') {
      deleteTask(targetId);
    }
    onClose();
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const renderColumnDeleteContent = () => {
    const colName = state.columns.find(c => c.id === targetId)?.title || 'Column';
    
    if (!columnHasTasks) {
      return (
        <>
          <p className={styles.warningText}>
            Are you sure you want to delete the column <strong>"{colName}"</strong>? This action cannot be undone.
          </p>
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Column</Button>
          </div>
        </>
      );
    }

    return (
      <div className={styles.columnDeleteBody}>
        <p className={styles.warningText}>
          The column <strong>"{colName}"</strong> contains <strong>{targetColTasks.length}</strong> task(s).
        </p>
        
        {otherColumns.length > 0 ? (
          <div className={styles.choiceGroup}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="deleteAction" 
                checked={shouldMigrate} 
                onChange={() => setShouldMigrate(true)} 
              />
              Move tasks to another column
            </label>
            
            {shouldMigrate && (
              <Select
                id="migration-col"
                label="Destination Column"
                value={migrationColumnId}
                onChange={(e) => setMigrationColumnId(e.target.value)}
                options={otherColumns.map(col => ({ value: col.id, label: col.title }))}
                className={styles.migrationSelect}
              />
            )}
            
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="deleteAction" 
                checked={!shouldMigrate} 
                onChange={() => setShouldMigrate(false)} 
              />
              Delete all tasks in this column
            </label>
          </div>
        ) : (
          <p className={styles.noMigrationMessage}>
            Since there are no other columns, deleting this column will also delete all its tasks.
          </p>
        )}
        
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>
            {shouldMigrate ? 'Delete Column & Move Tasks' : 'Delete Column & Tasks'}
          </Button>
        </div>
      </div>
    );
  };

  const renderTaskDeleteContent = () => {
    const taskName = state.tasks.find(t => t.id === targetId)?.title || 'Task';
    return (
      <>
        <p className={styles.warningText}>
          Are you sure you want to delete the task <strong>"{taskName}"</strong>? This action cannot be undone.
        </p>
        <div className={styles.modalFooter}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Task</Button>
        </div>
      </>
    );
  };

  return (
    <div className={`${styles.overlay} glass-overlay`} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} glass-modal animate-modal-open`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.titleArea}>
            <AlertTriangle className={styles.warningIcon} size={22} />
            <h2>{type === 'column' ? 'Delete Column' : 'Delete Task'}</h2>
          </div>
          <IconButton icon={X} onClick={onClose} title="Close Modal" />
        </div>
        
        <div className={styles.modalBody}>
          {type === 'column' ? renderColumnDeleteContent() : renderTaskDeleteContent()}
        </div>
      </div>
    </div>
  );
}
