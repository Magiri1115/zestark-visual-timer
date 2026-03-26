export type TimerStatus = 'S1' | 'S2' | 'S3' | 'S4'; // S1: Not started, S2: Running, S3: Paused, S4: Alarm
export type TimerMode = 'focus' | 'break';

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  totalMinutes: number;
  remainingSeconds: number;
  selectedTimezone: string;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK'; remaining: number }
  | { type: 'FINISHED' }
  | { type: 'SET_TIME'; minutes: number }
  | { type: 'SET_TIMEZONE'; timezone: string }
  | { type: 'SWITCH_MODE' };
