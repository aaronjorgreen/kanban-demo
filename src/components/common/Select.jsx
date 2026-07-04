import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './Select.module.css';

export default function Select({ 
  label, 
  error, 
  id, 
  options = [], 
  value, 
  onChange, 
  className = '', 
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const optionsRef = useRef([]);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation when open
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        handleSelect(options[focusedIndex].value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, options]);

  // Focus highlighted option
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: 'nearest'
      });
    }
  }, [focusedIndex]);

  const handleSelect = (val) => {
    if (onChange) {
      onChange({
        target: {
          value: val,
          id: id,
          name: props.name
        }
      });
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Pre-select current value index in list focus
      const currentIndex = options.findIndex(opt => opt.value === value);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  };

  return (
    <div className={`${styles.fieldContainer} ${className}`} ref={containerRef}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      
      <div className={styles.selectWrapper}>
        <button
          type="button"
          id={id}
          className={`${styles.selectTrigger} ${error ? styles.selectError : ''} ${isOpen ? styles.selectTriggerActive : ''}`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...props}
        >
          <span className={styles.triggerValue}>
            {selectedOption ? selectedOption.label : 'Select option...'}
          </span>
          <ChevronDown 
            size={16} 
            className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconRotated : ''}`} 
          />
        </button>

        {isOpen && (
          <div className={`${styles.optionsList} glass-panel animate-modal-open`} role="listbox">
            {options.map((opt, index) => {
              const isSelected = opt.value === value;
              const isFocused = index === focusedIndex;
              
              return (
                <div
                  key={opt.value}
                  ref={el => optionsRef.current[index] = el}
                  className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''} ${isFocused ? styles.optionFocused : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  {isSelected && (
                    <Check size={14} className={styles.checkIcon} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
