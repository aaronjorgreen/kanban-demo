import React from 'react';
import { Trash2, Edit2, User } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PriorityBadge from './PriorityBadge';
import SubtaskProgress from './SubtaskProgress';
import IconButton from '../common/IconButton';
import styles from './TaskCard.module.css';

export default function TaskCard({ 
  task, 
  onClick, 
  onDelete,
  isOverlay = false
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  // Get assignee initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(task.assignee);

  const handleCardClick = (e) => {
    // If it's a drag overlay clone, do nothing
    if (isOverlay) return;
    if (onClick) onClick(task);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete
    if (isOverlay) return;
    if (onDelete) onDelete(task.id);
  };

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.35 : 1,
    cursor: isOverlay ? 'grabbing' : 'grab'
  };

  return (
    <div 
      ref={setNodeRef}
      style={cardStyle}
      className={`${styles.cardContainer} glass-card ${isOverlay ? styles.overlayCard : ''}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardHeader}>
        <PriorityBadge priority={task.priority} />
        {!isOverlay && (
          <div className={styles.cardActions}>
            <IconButton 
              icon={Edit2} 
              size={12} 
              title="Edit Task"
              className={styles.actionBtn}
              onClick={handleCardClick}
            />
            <IconButton 
              icon={Trash2} 
              size={12} 
              variant="danger" 
              title="Delete Task"
              className={styles.actionBtn}
              onClick={handleDeleteClick}
            />
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.title}>{task.title}</h4>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
      </div>

      {(task.subtasks?.length > 0 || task.assignee) && (
        <div className={styles.cardFooter}>
          {task.subtasks?.length > 0 ? (
            <SubtaskProgress subtasks={task.subtasks} />
          ) : (
            <div /> // spacer
          )}
          
          {task.assignee && (
            <div 
              className={styles.assigneeAvatar} 
              title={`Assignee: ${task.assignee}`}
            >
              {initials ? (
                <span className={styles.avatarText}>{initials}</span>
              ) : (
                <User size={12} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
