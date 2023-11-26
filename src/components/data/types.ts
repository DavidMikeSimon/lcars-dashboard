export type WeatherCondition =
  | "clear-night"
  | "cloudy"
  | "fog"
  | "hail"
  | "lightning"
  | "lightning-rainy"
  | "partlycloudy"
  | "pouring"
  | "rainy"
  | "snowy"
  | "snowy-rainy"
  | "sunny"
  | "windy"
  | "windy-variant"
  | "exceptional";

export interface HourlyWeatherForecast {
  temperature: number;
  condition: WeatherCondition;
  date_time: Date;
}

export interface DataStore {
  date_time: string;
  weather_forecast_hourly: HourlyWeatherForecast[];
  weather_condition: WeatherCondition;
  weather_temperature: string;
}

export enum StreamStatus {
  INIT = "init",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  REFRESHING = "refreshing",
}
