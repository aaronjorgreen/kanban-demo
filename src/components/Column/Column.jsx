import React from 'react';
import { Plus } from 'lucide-react';
import ColumnHeader from './ColumnHeader';
import Button from '../common/Button';
import styles from './Column.module.css';

export default function Column({
  column,
  tasks = [],
  allTasksCount = 0,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  renderTaskCard // helper prop to render task cards from parent
}) {
  return (
    <div className={styles.columnContainer}>
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        totalTaskCount={allTasksCount}
        onEditColumn={onEditColumn}
        onDeleteColumn={onDeleteColumn}
      />
      
      <div className={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            renderTaskCard ? (
              renderTaskCard(task)
            ) : (
              <div 
                key={task.id} 
                className={`${styles.placeholderCard} glass-card`}
                onClick={() => onEditTask(task)}
              >
                {task.title}
              </div>
            )
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>Drop tasks here</p>
          </div>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        className={styles.addTaskBtn}
        onClick={() => onAddTask(column.id)}
      >
        <Plus size={16} />
        Add Task
      </Button>
    </div>
  );
}
