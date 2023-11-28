import { component$, useContext } from "@builder.io/qwik";

import { Clock } from "./clock";
import { WeatherConditionIcon } from "./weather-condition-icon";
import { Timeline } from "./timeline";
import { StreamedDataStoreContext } from "../data/stream";

export const Dashboard = component$(() => {
  const { data } = useContext(StreamedDataStoreContext);

  return (
    <>
      <div class="dashboard-row">
        <Clock dateTime={data.date_time} />
        <div style={{ fontSize: "1.5rem" }}>
          Cond: <WeatherConditionIcon condition={data.weather_condition} />
          <br />
          Temp: {data.weather_temperature}&deg;
        </div>
      </div>
      <div>
        <Timeline
          dateTime={data.date_time}
          forecasts={data.weather_forecast_hourly}
          workCalendar={data.calendar_color}
        />
      </div>
    </>
  );
});
