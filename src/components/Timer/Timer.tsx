import React from 'react';
import styles from './Timer.module.css';
import VisualBar from '../VisualBar';
import TimeDisplay from '../TimeDisplay';
import Controls from '../Controls';
import { TimerStatus, TimerAction } from '../../store/types';

interface TimerProps {
  status: TimerStatus;
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
      />
      <TimeDisplay 
        remainingSeconds={remainingSeconds} 
        status={status} 
        totalMinutes={totalMinutes}
        onTimeChange={(minutes) => dispatch({ type: 'SET_TIME', minutes })}
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
