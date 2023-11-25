import { component$ } from "@builder.io/qwik";
import { DateTime } from "luxon";

interface ClockProps {
  dateTime: string;
}

export const Clock = component$<ClockProps>((props) => {
  const { dateTime } = props;
  const now = DateTime.fromISO(dateTime);
  const hour = now.toFormat("hh");
  const minute = now.toFormat("mm");
  const amPm = now.toFormat("a");

  return (
    <div class="clock">
      <span class="number">{hour.charAt(0)}</span>
      <span class="number">{hour.charAt(1)}</span>
      <span class="divider">:</span>
      <span class="number">{minute.charAt(0)}</span>
      <span class="number">{minute.charAt(1)}</span>
      <span class="am-pm">{amPm}</span>
    </div>
  );
});
