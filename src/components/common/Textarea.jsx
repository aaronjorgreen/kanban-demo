import React from 'react';
import styles from './Textarea.module.css';

export default function Textarea({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <textarea
        id={id}
        className={`${styles.textareaField} ${error ? styles.textareaError : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
