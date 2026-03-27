import React, { useReducer, useEffect, useState } from 'react';
import './styles/global.css';
import './styles/reset.css';
import styles from './App.module.css';
import Clock from './components/Clock';
import Timer from './components/Timer';
import Settings from './components/Settings/Settings';
import { timerReducer, initialState } from './store/timerReducer';
import { useTimer } from './hooks/useTimer';
import { useAlarm } from './hooks/useAlarm';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { startTimer, stopTimer, resetTimer } = useTimer(dispatch);
  const { playAlarm, stopAlarm } = useAlarm();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
            onSettingsOpen={() => setSettingsOpen(true)}
          />
        </div>
        <div className={styles.timerWrapper}>
          <Timer
            status={state.status}
            phase={state.phase}
            remainingSeconds={state.remainingSeconds}
            focusMinutes={state.focusMinutes}
            breakSeconds={state.breakSeconds}
            breakIncludeZero={state.settings.breakIncludeZero}
            breakIncludeMax={state.settings.breakIncludeMax}
            dispatch={dispatch}
            onStart={() => startTimer(state.remainingSeconds)}
            onPause={stopTimer}
            onReset={resetTimer}
            onStopAlarm={handleStopAlarm}
          />
        </div>
      </div>

      {settingsOpen && (
        <Settings
          settings={state.settings}
          onUpdate={(s) => dispatch({ type: 'UPDATE_SETTINGS', settings: s })}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;