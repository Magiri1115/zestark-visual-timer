export interface SegmentInfo {
  activeSegments: number;
  focusSegments: number;
}

export const calcSegments = (
  remainingSec: number,
  focusMinutes: number,
  breakMinutes: number,
): SegmentInfo => {
  const totalMinutes = focusMinutes + breakMinutes;
  if (totalMinutes === 0) return { activeSegments: 0, focusSegments: 0 };

  const totalSec = totalMinutes * 60;
  const elapsedSec = totalSec - remainingSec;
  const segmentDuration = totalSec / 30;

  const activeSegments = Math.min(Math.max(Math.floor(elapsedSec / segmentDuration), 0), 30);

  const focusSegments = Math.floor((focusMinutes / totalMinutes) * 30);

  return { activeSegments, focusSegments };
};