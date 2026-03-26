import React, { useState } from 'react';
import styles from './Settings.module.css';
import { Settings as SettingsType } from '../store/types';
import { formatBreakLabel, getBreakSteps, stepBreak } from '../lib/breakSteps';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (settings: Partial<SettingsType>) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onClose }) => {

  const [focusMin, setFocusMin] = useState(settings.defaultFocusMinutes);
  const [breakSec, setBreakSec] = useState(settings.defaultBreakSeconds);
  const [includeZero, setIncludeZero] = useState(settings.breakIncludeZero);
  const [includeMax, setIncludeMax] = useState(settings.breakIncludeMax);

  const breakSteps = getBreakSteps(includeZero, includeMax);

  const handleIncludeZero = (checked: boolean) => {
    setIncludeZero(checked);
    if (!checked && breakSec === 0) setBreakSec(10);
  };

  const handleIncludeMax = (checked: boolean) => {
    setIncludeMax(checked);
    if (!checked && breakSec === 900) setBreakSec(600);
  };

  const handleApply = () => {
    onUpdate({
      defaultFocusMinutes: focusMin,
      defaultBreakSeconds: breakSec,
      breakIncludeZero: includeZero,
      breakIncludeMax: includeMax,
    });
    onClose();
  };

  const atBreakMin = breakSec <= breakSteps[0];
  const atBreakMax = breakSec >= breakSteps[breakSteps.length - 1];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>設定</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>

          <div className={styles.row}>
            <span className={styles.rowLabel}>集中 初期値</span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => setFocusMin((v) => Math.max(v - 1, 1))}
                disabled={focusMin <= 1}
              >－</button>
              <span className={styles.spinVal}>{focusMin}分</span>
              <button
                className={`${styles.spinBtn} ${styles.focusPlus}`}
                onClick={() => setFocusMin((v) => Math.min(v + 1, 90))}
                disabled={focusMin >= 90}
              >＋</button>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>休憩 初期値</span>
            <div className={styles.spinnerRow}>
              <button
                className={`${styles.spinBtn} ${styles.spinMinus}`}
                onClick={() => setBreakSec(stepBreak(breakSec, -1, breakSteps))}
                disabled={atBreakMin}
              >－</button>
              <span className={styles.spinVal}>{formatBreakLabel(breakSec)}</span>
              <button
                className={`${styles.spinBtn} ${styles.breakPlus}`}
                onClick={() => setBreakSec(stepBreak(breakSec, 1, breakSteps))}
                disabled={atBreakMax}
              >＋</button>
            </div>
          </div>

          <div className={styles.divider} />

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={includeZero}
              onChange={(e) => handleIncludeZero(e.target.checked)}
            />
            <span>休憩 0秒 を選択肢に含める</span>
          </label>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={includeMax}
              onChange={(e) => handleIncludeMax(e.target.checked)}
            />
            <span>休憩 15分 を選択肢に含める</span>
          </label>

        </div>

        <div className={styles.footer}>
          <button className={styles.applyBtn} onClick={handleApply}>適用</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;