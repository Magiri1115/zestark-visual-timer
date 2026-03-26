/*
* 休憩時間のステップ配列（秒）を返す。
* 基本: 10, 20, 30, 60, 120, 180, 300, 600
* includeZero=true で先頭に 0 を追加
* includeMax=true  で末尾に 900 を追加
*/
export const getBreakSteps = (includeZero: boolean, includeMax: boolean): number[] => {
  const base = [10, 20, 30, 60, 120, 180, 300, 600];
  const steps = [
    ...(includeZero ? [0] : []),
    ...base,
    ...(includeMax ? [900] : []),
  ];
  return steps;
};

/*
* seconds を "X分" / "X秒" / "X分Y秒" の表示文字列に変換。
*/
export const formatBreakLabel = (seconds: number): string => {
  if (seconds === 0) return '0秒';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}分`;
  if (m === 0) return `${s}秒`;
  return `${m}分${s}秒`;
};

/*
* 現在値から次のステップ / 前のステップのインデックスを返す。
* 範囲外なら先頭/末尾に丸める。
*/
export const stepBreak = (
  current: number,
  direction: 1 | -1,
  steps: number[],
): number => {
  if (steps.length === 0) return current;
  const idx = steps.indexOf(current);
  if (idx === -1) {
    const nearest = steps.reduce((a, b) =>
      Math.abs(b - current) < Math.abs(a - current) ? b : a
    );
    return nearest;
  }
  const next = idx + direction;
  if (next < 0) return steps[0];
  if (next >= steps.length) return steps[steps.length - 1];
  return steps[next];
};