import { invoke } from '@tauri-apps/api/core';

export const useAlarm = () => {
  const playAlarm = async () => {
    try {
      await invoke('play_alarm');
      await invoke('show_notification', {
        title: 'タイマー終了',
        body: '設定した時間が経過しました。',
      });
    } catch (e) {
      console.error('Failed to play alarm', e);
    }
  };

  const stopAlarm = async () => {
    await invoke('stop_alarm');
  };

  return { playAlarm, stopAlarm };
};
