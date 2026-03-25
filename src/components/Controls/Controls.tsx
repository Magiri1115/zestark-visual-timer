import React from 'react';
import styles from './Controls.module.css';

interface ControlsProps {
  status: 'S1' | 'S2' | 'S3' | 'S4';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStopAlarm: () => void;
}

const Controls: React.FC<ControlsProps> = ({ status, onStart, onPause, onReset, onStopAlarm }) => {
  if (status === 'S4') {
    return (
      <div className={styles.alarmContainer}>
        <button className={styles.stopAlarmBtn} onClick={onStopAlarm}>
          アラーム停止
        </button>
      </div>
    );
  }

  return (
    <div className={styles.controls}>
      {status === 'S1' && (
        <button className={styles.startBtn} onClick={onStart}>開始</button>
      )}
      {status === 'S2' && (
        <button className={styles.pauseBtn} onClick={onPause}>停止</button>
      )}
      {status === 'S3' && (
        <button className={styles.resumeBtn} onClick={onStart}>再開</button>
      )}
      <button className={styles.resetBtn} onClick={onReset}>リセット</button>
    </div>
  );
};

export default Controls;
