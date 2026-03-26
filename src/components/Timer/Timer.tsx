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
  breakMinutes: number;
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
  breakMinutes,
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
        breakMinutes={breakMinutes}
      />
      <TimeDisplay
        remainingSeconds={remainingSeconds}
        status={status}
        focusMinutes={focusMinutes}
        breakMinutes={breakMinutes}
        phase={phase}
        onFocusTimeChange={(minutes) => dispatch({ type: 'SET_FOCUS_TIME', minutes })}
        onBreakTimeChange={(minutes) => dispatch({ type: 'SET_BREAK_TIME', minutes })}
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