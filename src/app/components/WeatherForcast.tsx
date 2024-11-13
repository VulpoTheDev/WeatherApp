import React from 'react';
import { ForecastEntry } from '../typings';
import { celsiusToFahrenheit, getWeatherIcon, groupForecastByDate } from '../utils';

export function DailyForecast({ forecast }: { forecast: { list: ForecastEntry[] } | null }) {
    if(!forecast) return null;
    const dailyEntries = groupForecastByDate(forecast.list);
    return (
        forecast && forecast.list && (
            <section className="mt-12">
                <h2 className="text-3xl font-bold mb-6 text-center">5-Day Forecast</h2>
                <div className="flex space-x-4 overflow-x-auto py-4 justify-center">
                    {dailyEntries.map((entry: ForecastEntry, index: number) => (
                        <WeatherForecast entry={entry} key={index} />
                    ))}
                </div>
            </section>
        )
    );
}

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
