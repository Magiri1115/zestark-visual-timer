import { useState, useEffect } from 'react';

export const useClock = (timezone: string) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: false,
    }).format(time);
  };

  const getTimezoneName = () => {
    // 簡易的に表示名を返す
    return timezone.split('/').pop()?.replace('_', ' ') || timezone;
  };

  return {
    timeStr: formatTime(),
    timezoneName: getTimezoneName(),
  };
};
