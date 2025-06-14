import React from 'react';
import styles from './Overlay.module.css';

const Overlay = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className={styles.overlay} 
      onClick={onClose}
      onTouchStart={onClose}
    >
      <div 
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Overlay;
