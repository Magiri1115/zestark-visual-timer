export interface SegmentInfo {
  activeSegments: number;
  focusSegments: number;
}

export const calcSegments = (
  remainingSec: number,
  totalMinutes: number,
  mode: 'focus' | 'break'
): SegmentInfo => {
  if (totalMinutes === 0) return { activeSegments: 30, focusSegments: 0 };

  const totalSec = totalMinutes * 60;
  const elapsedSec = totalSec - remainingSec;
  const segmentDuration = totalSec / 30;

  const activeSegments = Math.min(Math.max(Math.floor(elapsedSec / segmentDuration), 0), 30);

  const focusSegments = mode === 'focus' ? activeSegments : 25;

  return { activeSegments, focusSegments };
};