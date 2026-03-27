import React from 'react';
import styles from './TimeDisplay.module.css';
import { formatTime } from '../../lib/formatTime';
import { TimerMode } from '../../store/types';
import { getBreakSteps, formatBreakLabel, stepBreak } from '../../lib/breakSteps';

interface TimeDisplayProps {
  remainingSeconds: number;
  status: 'S1' | 'S2' | 'S3' | 'S4';
  focusMinutes: number;
  breakSeconds: number;
  phase: TimerMode;
  breakIncludeZero: boolean;
  breakIncludeMax: boolean;
  onFocusTimeChange: (minutes: number) => void;
  onBreakTimeChange: (seconds: number) => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  remainingSeconds,
  status,
  focusMinutes,
  breakSeconds,
  phase,
  breakIncludeZero,
  breakIncludeMax,
  onFocusTimeChange,
  onBreakTimeChange,
}) => {
  const timeStr = formatTime(remainingSeconds);
  const phaseLabel = phase === 'focus' ? '集中' : '休憩';

  const breakSteps = getBreakSteps(breakIncludeZero, breakIncludeMax);
  const atBreakMin = breakSeconds <= breakSteps[0];
  const atBreakMax = breakSeconds >= breakSteps[breakSteps.length - 1];

  return (
    <div className={styles.container}>
      {status === 'S1' ? (
        <div className={styles.modeRow}>

          {/* 集中ブロック */}
          <div className={`${styles.modeBlock} ${styles.focusBlock}`}>
            <span className={`${styles.modeLabel} ${styles.focusLabel}`}>
              集中
            </span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => onFocusTimeChange(focusMinutes - 1)}
                disabled={focusMinutes <= 1}
              >－</button>
              <span className={styles.spinVal}>{focusMinutes}分</span>
              <button
                className={`${styles.spinBtn} ${styles.focusPlus}`}
                onClick={() => onFocusTimeChange(focusMinutes + 1)}
                disabled={focusMinutes >= 90}
              >＋</button>
            </div>
          </div>

          {/* 休憩ブロック */}
          <div className={`${styles.modeBlock} ${styles.breakBlock}`}>
            <span className={`${styles.modeLabel} ${styles.breakLabel}`}>
              休憩
            </span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => onBreakTimeChange(stepBreak(breakSeconds, -1, breakSteps))}
                disabled={atBreakMin}
              >－</button>
              <span className={styles.spinVal}>{formatBreakLabel(breakSeconds)}</span>
              <button
                className={`${styles.spinBtn} ${styles.breakPlus}`}
                onClick={() => onBreakTimeChange(stepBreak(breakSeconds, 1, breakSteps))}
                disabled={atBreakMax}
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