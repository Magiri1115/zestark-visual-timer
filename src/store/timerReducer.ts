import { TimerState, TimerAction, Settings } from './types';

const DEFAULT_FOCUS = 25;
const DEFAULT_BREAK = 300;

const calcTotal = (focusMinutes: number, breakSeconds: number) =>
  focusMinutes * 60 + breakSeconds;

export const initialSettings: Settings = {
  defaultFocusMinutes: DEFAULT_FOCUS,
  defaultBreakSeconds: DEFAULT_BREAK,
  breakIncludeZero: false,
  breakIncludeMax: false,
};

export const initialState: TimerState = {
  status: 'S1',
  phase: 'focus',
  focusMinutes: DEFAULT_FOCUS,
  breakSeconds: DEFAULT_BREAK,
  totalSeconds: calcTotal(DEFAULT_FOCUS, DEFAULT_BREAK),
  remainingSeconds: calcTotal(DEFAULT_FOCUS, DEFAULT_BREAK),
  selectedTimezone: 'Asia/Tokyo',
  settings: initialSettings,
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
        remainingSeconds: state.totalSeconds,
      };

    case 'TICK': {
      const focusSec = state.focusMinutes * 60;
      const elapsed = state.totalSeconds - action.remaining;
      const newPhase = elapsed >= focusSec ? 'break' : 'focus';
      return { ...state, remainingSeconds: action.remaining, phase: newPhase };
    }

    case 'FINISHED':
      return { ...state, status: 'S4', remainingSeconds: 0 };

    case 'SET_FOCUS_MINUTES': {
      const focusMinutes = Math.min(Math.max(action.minutes, 1), 90);
      const totalSeconds = calcTotal(focusMinutes, state.breakSeconds);
      return { ...state, focusMinutes, totalSeconds, remainingSeconds: totalSeconds };
    }

    case 'SET_BREAK_SECONDS': {
      const breakSeconds = Math.min(Math.max(action.seconds, 0), 900);
      const totalSeconds = calcTotal(state.focusMinutes, breakSeconds);
      return { ...state, breakSeconds, totalSeconds, remainingSeconds: totalSeconds };
    }

    case 'SET_TIMEZONE':
      return { ...state, selectedTimezone: action.timezone };

    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.settings };
      const focusMinutes = action.settings.defaultFocusMinutes ?? state.focusMinutes;
      const breakSeconds = action.settings.defaultBreakSeconds ?? state.breakSeconds;
      const totalSeconds = calcTotal(focusMinutes, breakSeconds);
      return {
        ...state,
        settings,
        focusMinutes,
        breakSeconds,
        totalSeconds,
        remainingSeconds: totalSeconds,
      };
    }

    default:
      return state;
  }
};