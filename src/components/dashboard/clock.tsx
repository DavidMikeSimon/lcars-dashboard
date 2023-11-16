import { component$ } from "@builder.io/qwik";

interface ClockProps {
  dateTime: string;
}

export const Clock = component$<ClockProps>((props) => {
  const { dateTime } = props;
  const now = new Date(dateTime);
  const hour = (now.getHours() % 12).toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");

  return (
    <div class="clock">
      <span class="number">{hour.charAt(0)}</span>
      <span class="number">{hour.charAt(1)}</span>
      <span class="divider">:</span>
      <span class="number">{minute.charAt(0)}</span>
      <span class="number">{minute.charAt(1)}</span>
      <span class="am-pm">{now.getHours() < 12 ? "AM" : "PM"}</span>
    </div>
  );
});
