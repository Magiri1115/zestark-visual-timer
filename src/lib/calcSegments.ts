export const calcSegments = (remainingSec: number, totalMinutes: number): number => {
  if (totalMinutes === 0) return 30;
  const totalSec = totalMinutes * 60;
  const elapsedSec = totalSec - remainingSec;
  const segmentDuration = totalSec / 30;
  
  // 経過時間に応じて右から点灯（00:00で全点灯）
  // 30セグメント固定
  const segments = Math.floor(elapsedSec / segmentDuration);
  return Math.min(Math.max(segments, 0), 30);
};
