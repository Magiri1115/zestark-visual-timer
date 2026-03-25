import { TimerState, TimerAction } from './types';

export const initialState: TimerState = {
  status: 'S1',
  mode: 'focus',
  totalMinutes: 25,
  remainingSeconds: 1500,
  selectedTimezone: 'Asia/Tokyo',
};

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'S2' };
    case 'PAUSE':
      return { ...state, status: 'S3' };
    case 'RESUME':
      return { ...state, status: 'S2' };
    case 'RESET':
      if (state.status === 'S2' || state.status === 'S3') {
        return {
          ...state,
          status: 'S1',
          remainingSeconds: state.totalMinutes * 60,
        };
      }

      if (state.status === 'S4') {
        const nextMode = state.mode === 'focus' ? 'break' : 'focus';
        const nextMinutes = nextMode === 'focus' ? 25 : 5;
        return {
          ...state,
          status: 'S1',
          mode: nextMode,
          totalMinutes: nextMinutes,
          remainingSeconds: nextMinutes * 60,
        };
      }
      return {
        ...state,
        status: 'S1',
        remainingSeconds: state.totalMinutes * 60,
      };
    case 'TICK':
      return { ...state, remainingSeconds: action.remaining };
    case 'FINISHED':
      return { ...state, status: 'S4', remainingSeconds: 0 };
    case 'SET_TIME':
      return {
        ...state,
        totalMinutes: action.minutes,
        remainingSeconds: action.minutes * 60,
      };
    case 'SET_TIMEZONE':
      return { ...state, selectedTimezone: action.timezone };
        case 'SWITCH_MODE':
      if (state.status !== 'S1') return state;
      const newMode = state.mode === 'focus' ? 'break' : 'focus';
      const newMinutes = newMode === 'focus' ? 25 : 5;
      return {
        ...state,
        mode: newMode,
        totalMinutes: newMinutes,
        remainingSeconds: newMinutes * 60,
      };
    default:
      return state;
  }
};
