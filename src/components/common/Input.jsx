import React from 'react';
import styles from './Input.module.css';

export default function Input({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        id={id}
        className={`${styles.inputField} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
