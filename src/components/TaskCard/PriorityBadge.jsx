import React from 'react';
import Badge from '../common/Badge';
import { PRIORITIES, PRIORITY_DETAILS } from '../../utils/constants';
import styles from './PriorityBadge.module.css';

export default function PriorityBadge({ priority }) {
  const details = PRIORITY_DETAILS[priority] || PRIORITY_DETAILS[PRIORITIES.LOW];
  const isHigh = priority === PRIORITIES.HIGH;
  
  return (
    <Badge
      color={details.color}
      bgColor={details.bgColor}
      className={`${styles.priorityBadge} ${isHigh ? 'animate-pulse-high' : ''}`}
    >
      <span className={styles.dot} style={{ backgroundColor: details.color }} />
      {details.label}
    </Badge>
  );
}
