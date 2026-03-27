export type TimerStatus = 'S1' | 'S2' | 'S3' | 'S4';
export type TimerMode = 'focus' | 'break';

export interface Settings {
  defaultFocusMinutes: number;
  defaultBreakSeconds: number;
  breakIncludeZero: boolean;
  breakIncludeMax: boolean;
}

export interface TimerState {
  status: TimerStatus;
  phase: TimerMode;
  focusMinutes: number;
  breakSeconds: number;
  totalSeconds: number;
  remainingSeconds: number;
  selectedTimezone: string;
  settings: Settings;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK'; remaining: number }
  | { type: 'FINISHED' }
  | { type: 'SET_FOCUS_MINUTES'; minutes: number }
  | { type: 'SET_BREAK_SECONDS'; seconds: number }
  | { type: 'SET_TIMEZONE'; timezone: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> };