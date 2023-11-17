import { component$ } from "@builder.io/qwik";
import { WeatherConditionIcon } from "./weather-condition-icon";
import type { HourlyWeatherForecast } from "../data/types";

interface HourlyForecastSmallProps {
  forecast: HourlyWeatherForecast;
}

export const HourlyForecastSmall = component$<HourlyForecastSmallProps>(
  (props) => {
    const { forecast } = props;
    return (
      <div class="hourly-forecast-small">
        <WeatherConditionIcon condition={forecast.condition} />
        <div class="temp">{forecast.temperature}&deg;</div>
      </div>
    );
  }
);
