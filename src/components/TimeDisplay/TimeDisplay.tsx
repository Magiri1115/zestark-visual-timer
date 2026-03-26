import React from 'react';
import styles from './TimeDisplay.module.css';
import { formatTime } from '../../lib/formatTime';
import { TimerMode } from '../../store/types';

interface TimeDisplayProps {
  remainingSeconds: number;
  status: 'S1' | 'S2' | 'S3' | 'S4';
  focusMinutes: number;
  breakMinutes: number;
  phase: TimerMode;
  onFocusTimeChange: (minutes: number) => void;
  onBreakTimeChange: (minutes: number) => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  remainingSeconds,
  status,
  focusMinutes,
  breakMinutes,
  phase,
  onFocusTimeChange,
  onBreakTimeChange,
}) => {
  const timeStr = formatTime(remainingSeconds);
  const phaseLabel = phase === 'focus' ? '集中' : '休憩';

  return (
    <div className={styles.container}>
      {status === 'S1' ? (
        <div className={styles.modeRow}>

          <div className={`${styles.modeBlock} ${styles.focusBlock}`}>
            <span className={`${styles.modeLabel} ${styles.focusLabel}`}>
              <span className={`${styles.modeDot} ${styles.focusDot}`} />
              集中
            </span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => onFocusTimeChange(focusMinutes - 1)}
              >－</button>
              <span className={styles.spinVal}>{focusMinutes}分</span>
              <button
                className={`${styles.spinBtn} ${styles.focusPlus}`}
                onClick={() => onFocusTimeChange(focusMinutes + 1)}
              >＋</button>
            </div>
          </div>

          <div className={`${styles.modeBlock} ${styles.breakBlock}`}>
            <span className={`${styles.modeLabel} ${styles.breakLabel}`}>
              <span className={`${styles.modeDot} ${styles.breakDot}`} />
              休憩
            </span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => onBreakTimeChange(breakMinutes - 1)}
              >－</button>
              <span className={styles.spinVal}>{breakMinutes}分</span>
              <button
                className={`${styles.spinBtn} ${styles.breakPlus}`}
                onClick={() => onBreakTimeChange(breakMinutes + 1)}
              >＋</button>
            </div>
          </div>

        </div>
      ) : (
        <div className={styles.display}>
          <div className={styles.phaseLabel}>{phaseLabel}</div>
          <span className={styles.timeText} data-testid="timer-value">{timeStr}</span>
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;