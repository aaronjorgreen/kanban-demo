import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import IconButton from '../common/IconButton';
import Badge from '../common/Badge';
import styles from './ColumnHeader.module.css';

export default function ColumnHeader({
  column,
  taskCount,
  totalTaskCount,
  onEditColumn,
  onDeleteColumn
}) {
  const isFiltered = taskCount !== totalTaskCount;
  
  return (
    <div 
      className={`${styles.headerContainer} glass-panel`}
      style={{ '--column-accent-color': column.color }}
    >
      <div className={styles.titleArea}>
        <h3 className={styles.title}>{column.title}</h3>
        <Badge 
          color="#ffffff" 
          bgColor={column.color}
          className={styles.badge}
        >
          {isFiltered ? `${taskCount} of ${totalTaskCount}` : totalTaskCount}
        </Badge>
      </div>
      
      <div className={styles.actionArea}>
        <IconButton 
          icon={Edit2} 
          size={14} 
          onClick={() => onEditColumn(column)}
          title="Edit Column"
        />
        <IconButton 
          icon={Trash2} 
          size={14} 
          variant="danger" 
          onClick={() => onDeleteColumn(column.id)}
          title="Delete Column"
        />
      </div>
    </div>
  );
}
