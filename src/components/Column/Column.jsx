import React from 'react';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
  renderTaskCard
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id
  });

  return (
    <div className={styles.columnContainer}>
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        totalTaskCount={allTasksCount}
        onEditColumn={onEditColumn}
        onDeleteColumn={onDeleteColumn}
      />
      
      <SortableContext 
        items={tasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div 
          ref={setNodeRef} 
          className={`${styles.taskList} ${isOver ? styles.taskListActive : ''}`}
        >
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
      </SortableContext>
      
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
