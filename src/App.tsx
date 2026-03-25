import React, { useReducer, useEffect } from 'react';
import './styles/global.css';
import './styles/reset.css';
import styles from './App.module.css';
import Clock from './components/Clock';
import Timer from './components/Timer';
import { timerReducer, initialState } from './store/timerReducer';
import { useTimer } from './hooks/useTimer';
import { useAlarm } from './hooks/useAlarm';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { startTimer, stopTimer, resetTimer } = useTimer(dispatch);
  const { playAlarm, stopAlarm } = useAlarm();

  useEffect(() => {
    if (state.status === 'S4') {
      playAlarm();
    }
  }, [state.status, playAlarm]);

  const handleStopAlarm = async () => {
    await stopAlarm();
    dispatch({ type: 'RESET' });
  };

  return (
    <div className={styles.appContainer}>
      <div className={`${styles.content} ${state.status === 'S1' ? styles.s1 : styles.s2}`}>
        <div className={styles.clockWrapper}>
          <Clock 
            status={state.status} 
            timezone={state.selectedTimezone} 
            onTimezoneChange={(tz) => dispatch({ type: 'SET_TIMEZONE', timezone: tz })}
          />
        </div>
        <div className={styles.timerWrapper}>
          <Timer 
            status={state.status}
            mode={state.mode}
            remainingSeconds={state.remainingSeconds}
            totalMinutes={state.totalMinutes}
            dispatch={dispatch}
            onStart={() => startTimer(state.remainingSeconds)}
            onPause={stopTimer}
            onReset={resetTimer}
            onStopAlarm={handleStopAlarm}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
