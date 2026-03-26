import React from 'react';
import styles from './Clock.module.css';
import { useClock } from '../../hooks/useClock';
import { timezones } from '../../lib/timezones';

interface ClockProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  onSettingsOpen: () => void;
  status: 'S1' | 'S2' | 'S3' | 'S4';
}

const Clock: React.FC<ClockProps> = ({ timezone, onTimezoneChange, onSettingsOpen, status }) => {
  const { timeStr, timezoneName } = useClock(timezone);

  return (
    <div className={`${styles.clockContainer} ${status === 'S1' ? styles.top : styles.bottom}`}>
      <div className={styles.time} data-testid="current-time">{timeStr}</div>
      <div className={styles.timezoneInfo}>
        {status === 'S1' ? (
          <div className={styles.tzRow}>
            <select
              className={styles.timezoneSelect}
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <button className={styles.settingsBtn} onClick={onSettingsOpen} title="設定">
              ⚙
            </button>
          </div>
        ) : (
          <span className={styles.timezoneLabel}>{timezoneName}</span>
        )}
      </div>
    </div>
  );
};

export default Clock;