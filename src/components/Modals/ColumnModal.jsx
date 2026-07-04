import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useBoardActions } from '../../hooks/useBoardActions';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import Input from '../common/Input';
import styles from './ColumnModal.module.css';

const COLOR_PRESETS = [
  '#94a3b8', // Slate
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444'  // Red
];

export default function ColumnModal({ column, onClose }) {
  const { addColumn, updateColumn } = useBoardActions();
  const isEditMode = !!column;
  
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[1]); // Default to Indigo
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && column) {
      setTitle(column.title);
      setColor(column.color);
    }
  }, [column, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Column title is required');
      return;
    }
    
    if (isEditMode) {
      updateColumn(column.id, { title: title.trim(), color });
    } else {
      addColumn({
        id: `col-${uuidv4()}`,
        title: title.trim(),
        color
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

  return (
    <div className={`${styles.overlay} glass-overlay`} onClick={onClose}>
      <div 
        className={`${styles.modalContainer} glass-modal animate-modal-open`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{isEditMode ? 'Edit Column' : 'Add New Column'}</h2>
          <IconButton icon={X} onClick={onClose} title="Close Modal" />
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="col-title"
            label="Column Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., In Review"
            error={error}
            autoFocus
          />
          
          <div className={styles.colorSection}>
            <label className={styles.colorLabel}>Accent Color</label>
            <div className={styles.colorGrid}>
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`${styles.colorOption} ${color === preset ? styles.activeColor : ''}`}
                  style={{ backgroundColor: preset }}
                  onClick={() => setColor(preset)}
                  title={preset}
                />
              ))}
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? 'Save Changes' : 'Create Column'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
