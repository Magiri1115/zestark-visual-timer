import React from 'react';
import styles from './VisualBar.module.css';
import { calcSegments } from '../../lib/calcSegments';

interface VisualBarProps {
  remainingSeconds: number;
  totalMinutes: number;
}

const VisualBar: React.FC<VisualBarProps> = ({ remainingSeconds, totalMinutes }) => {
  const activeSegments = calcSegments(remainingSeconds, totalMinutes);
  
  return (
    <div className={styles.barContainer}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i} 
          className={`${styles.segment} ${i >= 30 - activeSegments ? styles.active : ''}`}
        />
      ))}
    </div>
  );
};

export default VisualBar;
