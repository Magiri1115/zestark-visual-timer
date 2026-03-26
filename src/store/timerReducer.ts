import { TimerState, TimerAction } from './types';

export const initialState: TimerState = {
  status: 'S1',
  phase: 'focus',
  focusMinutes: 25,
  breakMinutes: 5,
  totalMinutes: 30,
  remainingSeconds: 30 * 60,
  selectedTimezone: 'Asia/Tokyo',
};

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'S2', phase: 'focus' };

    case 'PAUSE':
      return { ...state, status: 'S3' };

    case 'RESUME':
      return { ...state, status: 'S2' };

    case 'RESET':
      return {
        ...state,
        status: 'S1',
        phase: 'focus',
        remainingSeconds: state.totalMinutes * 60,
      };

    case 'TICK': {
      const focusSec = state.focusMinutes * 60;
      const breakSec = state.breakMinutes * 60;
      const totalSec = focusSec + breakSec;
      const elapsed = totalSec - action.remaining;
      const newPhase = elapsed >= focusSec ? 'break' : 'focus';
      return { ...state, remainingSeconds: action.remaining, phase: newPhase };
    }

    case 'FINISHED':
      return { ...state, status: 'S4', remainingSeconds: 0 };

    case 'SET_FOCUS_TIME': {
      const focusMinutes = Math.min(Math.max(action.minutes, 1), 60);
      const totalMinutes = focusMinutes + state.breakMinutes;
      return {
        ...state,
        focusMinutes,
        totalMinutes,
        remainingSeconds: totalMinutes * 60,
      };
    }

    case 'SET_BREAK_TIME': {
      const breakMinutes = Math.min(Math.max(action.minutes, 1), 60);
      const totalMinutes = state.focusMinutes + breakMinutes;
      return {
        ...state,
        breakMinutes,
        totalMinutes,
        remainingSeconds: totalMinutes * 60,
      };
    }

    case 'SET_TIMEZONE':
      return { ...state, selectedTimezone: action.timezone };

    default:
      return state;
  }
};