import React from 'react';
import { Kanban, Search, X, Plus } from 'lucide-react';
import { useBoardContext } from '../../context/BoardContext';
import { useBoardActions } from '../../hooks/useBoardActions';
import { getUniqueAssignees } from '../../utils/helpers';
import Button from '../common/Button';
import styles from './Header.module.css';

export default function Header({ onAddColumnClick }) {
  const { state } = useBoardContext();
  const { 
    setSearchQuery, 
    setPriorityFilter, 
    setAssigneeFilter, 
    clearFilters 
  } = useBoardActions();

  const uniqueAssignees = getUniqueAssignees(state.tasks);
  const hasActiveFilters = !!(state.searchQuery || state.filterPriority || state.filterAssignee);

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    ...uniqueAssignees.map(name => ({ value: name, label: name }))
  ];

  return (
    <header className={`${styles.headerContainer} glass-header`}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Kanban size={26} strokeWidth={2.5} />
        </div>
        <h1 className={styles.logoText}>KanBan</h1>
      </div>

      <div className={styles.toolbar}>
        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className={styles.searchInput}
          />
          {state.searchQuery && (
            <button 
              type="button" 
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              title="Clear Search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <select
          value={state.filterPriority || ''}
          onChange={(e) => setPriorityFilter(e.target.value || null)}
          className={styles.selectFilter}
        >
          {priorityOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          value={state.filterAssignee || ''}
          onChange={(e) => setAssigneeFilter(e.target.value || null)}
          className={styles.selectFilter}
        >
          {assigneeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className={styles.clearFiltersBtn}
          >
            Clear Filters
          </Button>
        )}

        <div className={styles.divider} />

        {/* Add Column Button */}
        <Button 
          size="sm" 
          onClick={onAddColumnClick}
          className={styles.addColumnBtn}
        >
          <Plus size={16} />
          New Column
        </Button>
      </div>
    </header>
  );
}
