import React from 'react';
import styles from './Timer.module.css';
import VisualBar from '../VisualBar';
import TimeDisplay from '../TimeDisplay';
import Controls from '../Controls';
import { TimerStatus, TimerAction, TimerMode } from '../../store/types';

interface TimerProps {
  status: TimerStatus;
  phase: TimerMode;
  remainingSeconds: number;
  focusMinutes: number;
  breakSeconds: number;
  breakIncludeZero: boolean;
  breakIncludeMax: boolean;
  dispatch: React.Dispatch<TimerAction>;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStopAlarm: () => void;
}

const Timer: React.FC<TimerProps> = ({
  status,
  phase,
  remainingSeconds,
  focusMinutes,
  breakSeconds,
  breakIncludeZero,
  breakIncludeMax,
  dispatch,
  onStart,
  onPause,
  onReset,
  onStopAlarm,
}) => {
  return (
    <div className={`${styles.timerContainer} ${status === 'S1' ? styles.bottom : styles.top}`}>
      <VisualBar
        remainingSeconds={remainingSeconds}
        focusMinutes={focusMinutes}
        breakSeconds={breakSeconds}
      />
      <TimeDisplay
        remainingSeconds={remainingSeconds}
        status={status}
        focusMinutes={focusMinutes}
        breakSeconds={breakSeconds}
        phase={phase}
        breakIncludeZero={breakIncludeZero}
        breakIncludeMax={breakIncludeMax}
        onFocusTimeChange={(minutes) => dispatch({ type: 'SET_FOCUS_MINUTES', minutes })}
        onBreakTimeChange={(seconds) => dispatch({ type: 'SET_BREAK_SECONDS', seconds })}
      />
      <Controls
        status={status}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
        onStopAlarm={onStopAlarm}
      />
    </div>
  );
};

export default Timer;