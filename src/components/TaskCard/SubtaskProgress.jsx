import React from 'react';
import { CheckSquare } from 'lucide-react';
import styles from './SubtaskProgress.module.css';

export default function SubtaskProgress({ subtasks = [] }) {
  if (!subtasks || subtasks.length === 0) return null;
  
  const total = subtasks.length;
  const completed = subtasks.filter(s => s.completed).isActive || subtasks.filter(s => s.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressTextLine}>
        <span className={styles.label}>
          <CheckSquare size={12} className={styles.icon} />
          {completed}/{total} Subtasks
        </span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>
      
      <div className={styles.progressBarBg}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
