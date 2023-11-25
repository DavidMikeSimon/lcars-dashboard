import { component$ } from "@builder.io/qwik";

import _ from "lodash";
import { DateTime } from "luxon";

import type { HourlyWeatherForecast } from "../data/types";
import { HourlyForecastSmall } from "./hourly-forecast-small";

interface TimelineProps {
  dateTime: string;
  forecasts: HourlyWeatherForecast[];
}

const HOUR_WIDTH_REM = 2.5;
const TIME_ZONE = "America/New_York";

export const Timeline = component$<TimelineProps>((props) => {
  const { dateTime, forecasts } = props;

  const now = DateTime.fromISO(dateTime, { zone: TIME_ZONE });
  const start = now.startOf("day");
  const nowHours = now.diff(start, "hours").as("hours");
  const forecastsByHour: { [key: number]: HourlyWeatherForecast } = _.fromPairs(
    forecasts.map((forecast) => [
      DateTime.fromJSDate(forecast.date_time).diff(start).as("hours"),
      forecast,
    ])
  );

  return (
    <div class="timeline">
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
      <div
        class="now-line"
        style={{ left: `${nowHours * HOUR_WIDTH_REM}rem` }}
      />
    </div>
  );
});
