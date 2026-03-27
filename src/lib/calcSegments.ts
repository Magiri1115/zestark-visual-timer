export interface SegmentInfo {
  activeSegments: number;
  focusSegments: number;
}

export const calcSegments = (
  remainingSeconds: number,
  focusMinutes: number,
  breakSeconds: number,
): SegmentInfo => {
  const totalSeconds = focusMinutes * 60 + breakSeconds;
  if (totalSeconds === 0) return { activeSegments: 0, focusSegments: 0 };

  const elapsed = totalSeconds - remainingSeconds;
  const segmentDuration = totalSeconds / 30;

  const activeSegments = Math.min(Math.max(Math.floor(elapsed / segmentDuration), 0), 30);

  const focusSegments = Math.round((focusMinutes * 60) / totalSeconds * 30);

  return { activeSegments, focusSegments };
};