import React from 'react';
import styles from './Timer.module.css';
import VisualBar from '../VisualBar';
import TimeDisplay from '../TimeDisplay';
import Controls from '../Controls';
import { TimerStatus, TimerAction, TimerMode } from '../../store/types';

interface TimerProps {
  status: TimerStatus;
  mode: TimerMode;
  remainingSeconds: number;
  totalMinutes: number;
  dispatch: React.Dispatch<TimerAction>;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStopAlarm: () => void;
}

const Timer: React.FC<TimerProps> = ({ 
  status,
  mode,
  remainingSeconds, 
  totalMinutes, 
  dispatch,
  onStart,
  onPause,
  onReset,
  onStopAlarm
}) => {
  return (
    <div className={`${styles.timerContainer} ${status === 'S1' ? styles.bottom : styles.top}`}>
      <VisualBar 
        remainingSeconds={remainingSeconds} 
        totalMinutes={totalMinutes}
        mode={mode}
      />
      <TimeDisplay 
        remainingSeconds={remainingSeconds} 
        status={status} 
        totalMinutes={totalMinutes}
        mode={mode}
        onTimeChange={(minutes) => dispatch({ type: 'SET_TIME', minutes })}
        onModeSwitch={() => dispatch({ type: 'SWITCH_MODE' })}
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
