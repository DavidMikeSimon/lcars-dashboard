export interface HourlyWeatherForecast {
  temperature: number;
  condition: string;
  date_time: Date;
}

export interface DataStore {
  date_time: string;
  forecast_hourly_forecast: HourlyWeatherForecast[];
  forecast_hourly_state: string;
  forecast_hourly_temperature: string;
}
