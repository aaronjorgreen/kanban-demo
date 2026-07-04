import React from 'react';
import { Trash2, Edit2, User } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import SubtaskProgress from './SubtaskProgress';
import IconButton from '../common/IconButton';
import styles from './TaskCard.module.css';

export default function TaskCard({ 
  task, 
  onClick, 
  onDelete 
}) {
  // Get assignee initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(task.assignee);

  const handleCardClick = () => {
    if (onClick) onClick(task);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent opening modal when clicking delete
    if (onDelete) onDelete(task.id);
  };

  return (
    <div 
      className={`${styles.cardContainer} glass-card animate-card-enter`}
      onClick={handleCardClick}
    >
      <div className={styles.cardHeader}>
        <PriorityBadge priority={task.priority} />
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
