import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useBoardContext } from '../../context/BoardContext';
import { useBoardActions } from '../../hooks/useBoardActions';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import styles from './TaskModal.module.css';

export default function TaskModal({ task, defaultColumnId, onClose, onDeleteTask }) {
  const { state } = useBoardContext();
  const { addTask, updateTask } = useBoardActions();
  const isEditMode = !!task;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('low');
  const [assignee, setAssignee] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || '');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'low');
      setAssignee(task.assignee || '');
      setColumnId(task.columnId || '');
      setSubtasks(task.subtasks ? [...task.subtasks] : []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('low');
      setAssignee('');
      setColumnId(defaultColumnId || (state.columns[0]?.id || ''));
      setSubtasks([]);
    }
  }, [task, isEditMode, defaultColumnId, state.columns]);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    
    const newSub = {
      id: `sub-${uuidv4()}`,
      text: newSubtaskText.trim(),
      completed: false
    };
    
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskText('');
  };

  const handleToggleSubtask = (subId) => {
    setSubtasks(
      subtasks.map(sub => 
        sub.id === subId ? { ...sub, completed: !sub.completed } : sub
      )
    );
  };

  const handleDeleteSubtask = (subId) => {
    setSubtasks(subtasks.filter(sub => sub.id !== subId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tempErrors = {};
    if (!title.trim()) {
      tempErrors.title = 'Task title is required';
    }
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee: assignee.trim(),
      subtasks
    };

    if (isEditMode) {
      // If columnId has changed, we are moving the task via the modal edit form!
      if (task.columnId !== columnId) {
        // Find tasks in destination column to set order
        const destTasks = state.tasks.filter(t => t.columnId === columnId);
        updateTask(task.id, {
          ...taskData,
          columnId,
          order: destTasks.length
        });
      } else {
        updateTask(task.id, taskData);
      }
    } else {
      addTask(columnId, {
        id: `task-${uuidv4()}`,
        ...taskData
      });
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

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const columnOptions = state.columns.map(col => ({
    value: col.id,
    label: col.title
  }));

  return (
    <div className={`${styles.overlay} glass-overlay`} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} glass-modal animate-modal-open`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
          <IconButton icon={X} onClick={onClose} title="Close Modal" />
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formScroll}>
            <div className={styles.formGroup}>
              <Input
                id="task-title"
                label="Task Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g., Implement drag and drop"
                error={errors.title}
                autoFocus
              />
            </div>
            
            <div className={styles.formGroup}>
              <Textarea
                id="task-desc"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description..."
              />
            </div>
            
            <div className={styles.row}>
              <Select
                id="task-priority"
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                options={priorityOptions}
                className={styles.rowField}
              />
              <Input
                id="task-assignee"
                label="Assignee Name"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g., Aaron"
                className={styles.rowField}
              />
            </div>
            
            <div className={styles.formGroup}>
              <Select
                id="task-status"
                label="Status (Column)"
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                options={columnOptions}
              />
            </div>
            
            {/* Subtasks Section */}
            <div className={styles.subtasksSection}>
              <label className={styles.subtaskTitle}>Subtasks checklist</label>
              
              <div className={styles.subtaskInputArea}>
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder="Add a subtask..."
                  className={styles.subtaskInlineInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask(e);
                    }
                  }}
                />
                <IconButton 
                  icon={Plus} 
                  size={16} 
                  onClick={handleAddSubtask} 
                  title="Add Subtask"
                  className={styles.addSubtaskBtn}
                />
              </div>
              
              {subtasks.length > 0 && (
                <div className={styles.subtaskList}>
                  {subtasks.map((sub) => (
                    <div key={sub.id} className={styles.subtaskItem}>
                      <label className={styles.subtaskLabel}>
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => handleToggleSubtask(sub.id)}
                        />
                        <span className={sub.completed ? styles.completedText : ''}>
                          {sub.text}
                        </span>
                      </label>
                      <IconButton
                        icon={Trash2}
                        size={12}
                        variant="danger"
                        onClick={() => handleDeleteSubtask(sub.id)}
                        title="Delete Subtask"
                        className={styles.subtaskDeleteBtn}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <div className={styles.leftActions}>
              {isEditMode && (
                <Button 
                  variant="danger" 
                  onClick={() => {
                    if (onDeleteTask) onDeleteTask(task.id);
                  }}
                >
                  Delete Task
                </Button>
              )}
            </div>
            <div className={styles.rightActions}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
