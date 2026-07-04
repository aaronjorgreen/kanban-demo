import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className={styles.successIcon} />;
      case 'info':
        return <Info size={16} className={styles.infoIcon} />;
      case 'warning':
        return <AlertTriangle size={16} className={styles.warningIcon} />;
      case 'error':
        return <AlertCircle size={16} className={styles.errorIcon} />;
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`${styles.toastItem} glass-panel animate-toast-in ${styles[toast.type]}`}
          >
            <div className={styles.toastContent}>
              {getIcon(toast.type)}
              <span className={styles.toastMessage}>{toast.message}</span>
            </div>
            <button 
              type="button" 
              className={styles.closeBtn}
              onClick={() => removeToast(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
