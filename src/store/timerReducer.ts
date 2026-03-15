import { TimerState, TimerAction } from './types';

export const initialState: TimerState = {
  status: 'S1',
  totalMinutes: 30,
  remainingSeconds: 1800,
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
      return { ...state, status: 'S1', remainingSeconds: state.totalMinutes * 60 };
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
    default:
      return state;
  }
};
