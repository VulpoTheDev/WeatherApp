import React from 'react';
import { ForecastEntry } from '../typings';
import { celsiusToFahrenheit, getWeatherIcon } from '../utils';

export default function WeatherForecast({ entry }: { entry: ForecastEntry }) {
  return (
    <div className="min-w-[180px] p-4 bg-white bg-opacity-10 rounded-lg shadow-lg flex-shrink-0">
      <p className="text-lg font-bold">{new Date(entry.dt * 1000).toLocaleDateString()}</p>
      {getWeatherIcon(entry.weather[0]?.main || "")}
      <p className="text-2xl font-bold mt-2">
        {celsiusToFahrenheit(parseInt(entry.main?.temp.toPrecision(1)))}°F
      </p>
      <p className="text-sm capitalize">{entry.weather[0]?.description}</p>
      <p className="text-sm">Humidity: {entry.main?.humidity}%</p>
      <p className="text-sm">Wind: {entry.wind?.speed || 0} m/s</p>
    </div>
  );
}
