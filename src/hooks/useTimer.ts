import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { TimerAction } from '../store/types';

export const useTimer = (dispatch: React.Dispatch<TimerAction>) => {
  useEffect(() => {
    const unlistenTick = listen<{ remaining_sec: number }>('timer_tick', (event) => {
      dispatch({ type: 'TICK', remaining: event.payload.remaining_sec });
    });

    const unlistenFinished = listen('timer_finished', () => {
      dispatch({ type: 'FINISHED' });
    });

    return () => {
      unlistenTick.then((f) => f());
      unlistenFinished.then((f) => f());
    };
  }, [dispatch]);

  const startTimer = async (minutes: number) => {
    await invoke('start_timer', { minutes });
    dispatch({ type: 'START' });
  };

  const stopTimer = async () => {
    await invoke('stop_timer');
    dispatch({ type: 'PAUSE' });
  };

  const resetTimer = async () => {
    await invoke('stop_timer');
    dispatch({ type: 'RESET' });
  };

  return { startTimer, stopTimer, resetTimer };
};
