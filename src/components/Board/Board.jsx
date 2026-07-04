import React, { useState, useRef, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  useSensor, 
  useSensors, 
  PointerSensor 
} from '@dnd-kit/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBoardContext } from '../../context/BoardContext';
import { useBoardActions } from '../../hooks/useBoardActions';
import Column from '../Column/Column';
import TaskCard from '../TaskCard/TaskCard';
import styles from './Board.module.css';

export default function Board({ 
  onAddTask, 
  onEditTask,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  renderTaskCard
}) {
  const { state } = useBoardContext();
  const { moveTask } = useBoardActions();
  
  // Drag states
  const [activeDragTask, setActiveDragTask] = useState(null);
  
  // Scroll states for chevrons
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const boardWrapperRef = useRef(null);

  // Sensors configuration with 8px pointer movement constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Scroll detection
  const checkScroll = () => {
    if (boardWrapperRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = boardWrapperRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const wrapper = boardWrapperRef.current;
    if (!wrapper) return;

    wrapper.addEventListener('scroll', checkScroll);
    checkScroll();

    // Check again when window resizes or columns change
    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(wrapper);

    // Initial delay check to allow rendering
    const timer = setTimeout(checkScroll, 100);

    return () => {
      wrapper.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [state.columns]);

  const handleScroll = (direction) => {
    if (boardWrapperRef.current) {
      const scrollAmount = 320;
      boardWrapperRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  // Drag handlers
  const handleDragStart = (event) => {
    const { active } = event;
    const task = state.tasks.find(t => t.id === active.id);
    setActiveDragTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = state.tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if over element is a column
    const isOverAColumn = state.columns.some(col => col.id === overId);

    let overColumnId = '';
    let overIndex = 0;

    if (isOverAColumn) {
      overColumnId = overId;
      const destTasks = state.tasks.filter(t => t.columnId === overColumnId);
      overIndex = destTasks.length;
    } else {
      const overTask = state.tasks.find(t => t.id === overId);
      if (!overTask) return;
      overColumnId = overTask.columnId;
      overIndex = overTask.order;
    }

    if (activeTask.columnId !== overColumnId) {
      // Optimistically move column in state to trigger re-render
      moveTask(activeId, overColumnId, overIndex);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const originalColumnId = activeDragTask?.columnId;
    setActiveDragTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = state.tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const isOverAColumn = state.columns.some(col => col.id === overId);

    let overColumnId = '';
    let overIndex = 0;

    if (isOverAColumn) {
      overColumnId = overId;
      const destTasks = state.tasks.filter(t => t.columnId === overColumnId);
      overIndex = destTasks.length;
    } else {
      const overTask = state.tasks.find(t => t.id === overId);
      if (!overTask) return;
      overColumnId = overTask.columnId;
      overIndex = overTask.order;
    }

    moveTask(activeId, overColumnId, overIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDragTask(null)}
    >
      <div className={styles.boardOuterContainer}>
        {/* Left Gradient Overlay & Chevron */}
        <div className={`${styles.navOverlay} ${styles.navOverlayLeft} ${canScrollLeft ? styles.navOverlayVisible : ''}`}>
          <button 
            type="button" 
            className={styles.navButton}
            onClick={() => handleScroll('left')}
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Right Gradient Overlay & Chevron */}
        <div className={`${styles.navOverlay} ${styles.navOverlayRight} ${canScrollRight ? styles.navOverlayVisible : ''}`}>
          <button 
            type="button" 
            className={styles.navButton}
            onClick={() => handleScroll('right')}
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div ref={boardWrapperRef} className={styles.boardWrapper}>
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
                    onEditColumn={onEditColumn}
                    onDeleteColumn={onDeleteColumn}
                    onAddTask={onAddTask}
                    onEditTask={onEditTask}
                    renderTaskCard={renderTaskCard}
                  />
                );
              })}
              
            {/* Add Column Button */}
            <div 
              className={`${styles.addColumnPlaceholder} glass-panel glass-panel-hover`}
              onClick={onAddColumn}
            >
              <span>+ Add Column</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay Ghost copy */}
      <DragOverlay>
        {activeDragTask ? (
          <TaskCard 
            task={activeDragTask} 
            isOverlay={true} 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
