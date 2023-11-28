import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

import _ from "lodash";
import { DateTime, Interval } from "luxon";

import type { CalendarEvent, HourlyWeatherForecast } from "../data/types";
import { HourlyForecastSmall } from "./hourly-forecast-small";

interface TimelineProps {
  dateTime: string;
  forecasts: HourlyWeatherForecast[];
  workCalendar: CalendarEvent[];
}

const HOUR_WIDTH_REM = 3.5;
const TIME_ZONE = "America/New_York";

export const Timeline = component$<TimelineProps>((props) => {
  const { dateTime, forecasts, workCalendar } = props;
  const timelineElem = useSignal<Element>();

  const now = DateTime.fromISO(dateTime, { zone: TIME_ZONE });
  const start = now.startOf("day");
  const interval = Interval.fromDateTimes(start, start.plus({ days: 1 }));
  const nowHours = now.diff(start, "hours").as("hours");
  const forecastsByHour: { [key: number]: HourlyWeatherForecast } = _.fromPairs(
    forecasts.map((forecast) => [
      DateTime.fromJSDate(forecast.date_time).diff(start).as("hours"),
      forecast,
    ])
  );

  useVisibleTask$(({ track }) => {
    track(() => props.dateTime);
    if (timelineElem.value) {
      const pixels =
        (nowHours - 2) *
        HOUR_WIDTH_REM *
        parseFloat(getComputedStyle(document.documentElement).fontSize);
      timelineElem.value.scrollTo(pixels, 0);
    }
  });

  return (
    <div class="timeline" ref={timelineElem}>
      <div class="hours">
        {_.range(0, 24).map((hour) => {
          const forecast = forecastsByHour[
            hour
          ] as HourlyWeatherForecast | null;
          const t = start.plus({ hours: hour });
          return (
            <div class="hour-column" key={hour}>
              <div class="forecast">
                {forecast && <HourlyForecastSmall forecast={forecast} />}
              </div>
              <div class="column-label">
                <span class="hour">{t.toFormat("h")}</span>
                <span class="am-pm">{t.toFormat("a").charAt(0)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div class="events">
        <div class="events-row">
          {workCalendar.map((event) => {
            const eventInterval = Interval.fromDateTimes(
              event.start_time,
              event.end_time
            );
            if (!interval.engulfs(eventInterval)) {
              return null;
            }
            const eventStartHours = DateTime.fromJSDate(event.start_time)
              .diff(start)
              .as("hours");
            const eventIntervalHours = eventInterval.length("hours");
            return (
              <div
                key={event.uid}
                class="event"
                style={{
                  left: `${eventStartHours * HOUR_WIDTH_REM}rem`,
                  width: `${eventIntervalHours * HOUR_WIDTH_REM}rem`,
                  maxWidth: `${eventIntervalHours * HOUR_WIDTH_REM}rem`,
                }}
              >
                {event.summary}
              </div>
            );
          })}
        </div>
      </div>
      <div
        class="now-line"
        style={{ left: `${nowHours * HOUR_WIDTH_REM}rem` }}
      />
    </div>
  );
});
