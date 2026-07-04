import React from 'react';
import styles from './IconButton.module.css';

export default function IconButton({ 
  icon: Icon, 
  size = 18, 
  variant = 'ghost', 
  onClick, 
  disabled = false,
  className = '',
  title = '',
  ...props 
}) {
  const btnClass = `${styles.iconBtn} ${styles[variant]} ${className}`;
  
  return (
    <button
      type="button"
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      {...props}
    >
      <Icon size={size} />
    </button>
  );
}
