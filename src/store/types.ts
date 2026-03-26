export type TimerStatus = 'S1' | 'S2' | 'S3' | 'S4'; // S1: Not started, S2: Running, S3: Paused, S4: Alarm
export type TimerMode = 'focus' | 'break';

export interface Settings {
  /*
  * defaultFocusMinutes: number; // 初期値：集中（分）
  * defaultBreakSeconds: number; // 初期値：休憩（秒）
  * breakIncludeZero: boolean;   // 0秒を選択肢に含める
  * breakIncludeMax: boolean;    // 15分(900秒)を選択肢に含める
  */
  defaultFocusMinutes: number;
  defaultBreakSeconds: number;
  breakIncludeZero: boolean;
  breakIncludeMax: boolean;
}
 
export interface TimerState {
  /*
  * phase: TimerMode;           // 現在実行中のフェーズ（S2/S3/S4で参照）
  * focusMinutes: number;       // 集中タイマー設定値
  * breakMinutes: number;       // 休憩タイマー設定値
  * totalMinutes: number;       // focusMinutes + breakMinutes（バー計算用）
  */
  status: TimerStatus;
  phase: TimerMode;
  focusMinutes: number;
  breakMinutes: number;
  totalMinutes: number;
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
  | { type: 'SET_FOCUS_TIME'; minutes: number }
  | { type: 'SET_BREAK_TIME'; minutes: number }
  | { type: 'SET_TIMEZONE'; timezone: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> };