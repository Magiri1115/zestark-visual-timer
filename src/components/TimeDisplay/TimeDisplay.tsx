import React from 'react';
import styles from './TimeDisplay.module.css';
import { formatTime } from '../../lib/formatTime';

interface TimeDisplayProps {
  remainingSeconds: number;
  status: 'S1' | 'S2' | 'S3' | 'S4';
  totalMinutes: number;
  onTimeChange: (minutes: number) => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ remainingSeconds, status, totalMinutes, onTimeChange }) => {
  const timeStr = formatTime(remainingSeconds);

  const increment = () => {
    if (totalMinutes < 60) onTimeChange(totalMinutes + 1);
  };

  const decrement = () => {
    if (totalMinutes > 1) onTimeChange(totalMinutes - 1);
  };

  return (
    <div className={styles.container}>
      {status === 'S1' ? (
        <div className={styles.config}>
          <button className={styles.btnMinus} onClick={decrement}>－</button>
          <span className={styles.timeValue} data-testid="timer-value">{totalMinutes}分00秒</span>
          <button className={styles.btnPlus} onClick={increment}>＋</button>
        </div>
      ) : (
        <div className={styles.display}>
          <span className={styles.timeText} data-testid="timer-value">{timeStr}</span>
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;
