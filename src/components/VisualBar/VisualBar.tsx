import React from 'react';
import styles from './VisualBar.module.css';
import { calcSegments } from '../../lib/calcSegments';

interface VisualBarProps {
  remainingSeconds: number;
  focusMinutes: number;
  breakMinutes: number;
}

const VisualBar: React.FC<VisualBarProps> = ({ remainingSeconds, focusMinutes, breakMinutes }) => {
  const { activeSegments, focusSegments } = calcSegments(remainingSeconds, focusMinutes, breakMinutes);

  return (
    <div className={styles.barContainer}>
      {Array.from({ length: 30 }).map((_, i) => {
        const segmentIndex = 30 - i - 1;
        const isActive = segmentIndex < activeSegments;
        const isFocus  = segmentIndex < focusSegments;

        return (
          <div
            key={i}
            className={`${styles.segment} ${isActive ? (isFocus ? styles.focus : styles.break) : ''}`}
            data-testid="segment"
          />
        );
      })}
    </div>
  );
};

export default VisualBar;