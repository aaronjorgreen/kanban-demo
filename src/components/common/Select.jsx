import React from 'react';
import styles from './Select.module.css';

export default function Select({ 
  label, 
  error, 
  id, 
  options = [], 
  className = '', 
  ...props 
}) {
  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <select
        id={id}
        className={`${styles.selectField} ${error ? styles.selectError : ''}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
