import { dayjs } from "@revolt/i18n";
import { createSignal, onCleanup } from "solid-js";

interface Props {
  value: number | Date;
  format: "calendar" | "time";
  referenceTime?: number | Date;
}

export function formatTime(props: Props) {
  switch (props.format) {
    case "calendar":
      return dayjs(props.value).calendar(props.referenceTime);
    default:
      return dayjs(props.value).format("HH:mm");
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
