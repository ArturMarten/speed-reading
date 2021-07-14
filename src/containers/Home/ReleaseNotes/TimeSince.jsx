import React, { useCallback, useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const timeUnits = [
  { single: 'a-second', multiple: 'seconds', value: SECOND, max: 50 },
  { single: 'a-minute', multiple: 'minutes', value: MINUTE, max: 50 },
  { single: 'an-hour', multiple: 'hours', value: HOUR, max: 22 },
  { single: 'a-day', multiple: 'days', value: DAY, max: 6 },
  { single: 'a-week', multiple: 'weeks', value: WEEK, max: 3.5 },
  { single: 'a-month', multiple: 'months', value: MONTH, max: 11 },
  { single: 'a-year', multiple: 'years', value: YEAR, max: Infinity },
];

function formatTime(input, translate) {
  if (input < 10 * SECOND) {
    return translate('time-since.few-moments-ago');
  }
  for (let index = 0; index < timeUnits.length; index++) {
    const timeUnit = timeUnits[index];
    if (input <= timeUnit.max * timeUnit.value) {
      const time = Math.floor(input / timeUnit.value);
      const single = translate(`time-since.${timeUnit.single}`);
      const multiple = translate(`time-since.${timeUnit.multiple}`);
      const ago = translate('time-since.ago');
      return time <= 1 ? `${single} ${ago}` : `${time} ${multiple} ${ago}`;
    }
  }
  return input;
}

function TimeSince({ date, translate }) {
  const [time, setTime] = useState('');

  const updateTime = useCallback(() => {
    const sinceDate = new Date(date);
    const time = new Date().getTime() - sinceDate.getTime();
    const formattedTime = formatTime(time, translate);
    setTime(formattedTime);
  }, [date, translate]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(() => {
      updateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTime]);
  return <>{time}</>;
}

export default TimeSince;
