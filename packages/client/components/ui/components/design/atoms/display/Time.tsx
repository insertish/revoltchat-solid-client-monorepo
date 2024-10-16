import { dayjs } from '@revolt/i18n';
import { createSignal, onCleanup } from 'solid-js';

interface Props {
  value: number | Date | string;
  format:
    | 'calendar'
    | 'datetime'
    | 'date'
    | 'dateNormal'
    | 'dateAmerican'
    | 'iso8601'
    | 'relative'
    | 'time'
    | 'time24'
    | 'time12';
  referenceTime?: number | Date | string;
}

/**
 * Format a given date
 */
export function formatTime(options: Props): string {
  switch (options.format) {
    case 'calendar':
      return dayjs(options.value).calendar(options.referenceTime);
    case 'datetime':
      return `${formatTime({
        format: 'date',
        value: options.value,
      })} ${formatTime({ format: 'time', value: options.value })}`;
    case 'date':
    case 'dateNormal':
      return dayjs(options.value).format('DD/MM/YYYY');
    case 'dateAmerican':
      return dayjs(options.value).format('MM/DD/YYYY');
    case 'iso8601':
      return dayjs(options.value).format('YYYY-MM-DD');
    case 'relative':
      return dayjs(options.value).fromNow();
    case 'time12':
      return dayjs(options.value).format('h:mm A');
    case 'time24':
    default:
      return dayjs(options.value).format('HH:mm');
  }
}

export function Time(props: Props) {
  const [time, setTime] = createSignal(formatTime(props));

  const timer = setInterval(() => {
    const value = formatTime(props);
    if (value !== time()) {
      setTime(value);
    }
  }, 1000);

  onCleanup(() => clearInterval(timer));

  return <>{time}</>;
}
