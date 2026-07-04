import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ 
  children, 
  color, 
  bgColor, 
  className = '',
  ...props 
}) {
  const badgeStyle = {
    color: color,
    backgroundColor: bgColor
  };

  return (
    <span 
      className={`${styles.badge} ${className}`} 
      style={badgeStyle}
      {...props}
    >
      {children}
    </span>
  );
}
