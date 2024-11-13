'use client';

import { useEffect, useState } from "react";
import { ForecastData, ForecastEntry, Location, WeatherData } from "../typings";
import { celsiusToFahrenheit, fetchLocationSuggestions, fetchCurrentWeather, fetchWeatherForecast, getWeatherIcon, getActivities } from "../utils";
import WeatherForecast from "../components/WeatherForcast";
import LocationSuggestion from "../components/LocationSuggestion";

export default function Home() {
  const [query, setQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState("");

  const handleSelectLocation = async (location: Location) => {
    setQuery("");
    setLocationSuggestions([]);
    try {
      const currentWeather = await fetchCurrentWeather(location.lat, location.lon);
      const forecastData = await fetchWeatherForecast(location.lat, location.lon);

      if (currentWeather && forecastData) {
        setWeatherData(currentWeather);
        setForecast(forecastData);
        setError("");
      } else {
        throw new Error("Weather data not available.");
      }
    } catch (err) {
      setError(`Unable to fetch weather data. ${err}`);
      setWeatherData(null);
      setForecast(null);
    }
  };

  useEffect(() => {
    if (query.length >= 3) {
      const fetchSuggestions = async () => {
        try {
          const suggestions = await fetchLocationSuggestions(query);
          setLocationSuggestions(suggestions);
        } catch {
          setError("Failed to fetch location suggestions.");
        }
      };
      fetchSuggestions();
    } else {
      setLocationSuggestions([]);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
      <div className="container mx-auto p-6 space-y-12">
        <h1 className="text-center text-5xl font-bold">Weather App</h1>

        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for a location..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="w-full p-4 rounded-lg shadow-md text-gray-800 bg-gray-50 focus:ring-2 focus:ring-indigo-400 transition duration-300"
          />
          {locationSuggestions.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-white text-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {locationSuggestions.map((location, index) => (
                <LocationSuggestion location={location} selectFunc={handleSelectLocation} key={index} />
              ))}
            </ul>
          )}
        </div>

        {weatherData && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white bg-opacity-10 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold">{weatherData.name}</h2>
              <p className="text-xl capitalize">{weatherData.weather[0]?.description}</p>
              <div className="flex items-center mt-6">
                {getWeatherIcon(weatherData.weather[0]?.main || "")}
                <h1 className="text-6xl font-bold ml-4">
                  {celsiusToFahrenheit(weatherData.main?.temp || 0).toFixed(1)}°F
                </h1>
              </div>
              <div className="mt-6 space-y-2">
                <p>Feels Like: {celsiusToFahrenheit(weatherData.main?.feels_like || 0).toFixed(1)}°F</p>
                <p>Humidity: {weatherData.main?.humidity}%</p>
                <p>Wind: {weatherData.wind?.speed} m/s</p>
                <p>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>

            <div className="p-6 bg-white bg-opacity-10 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6">Recommended Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getActivities(weatherData.weather[0]?.main || "").map((activity, index) => (
                  <div key={index} className="p-4 bg-white bg-opacity-20 rounded-lg shadow-md flex items-center">
                    {activity.icon}
                    <p className="ml-4 text-lg">{activity.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {forecast && forecast.list && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center">5-Day Forecast</h2>
            <div className="flex space-x-4 overflow-x-auto py-4">
              {forecast.list.slice(0, 40).map((entry: ForecastEntry, index: number) => (
                <WeatherForecast entry={entry} key={index} />
              ))}
            </div>
          </section>
        )}

        {error && (
          <p className="text-center text-red-400 mt-6">{error}</p>
        )}
      </div>
    </div>
  );
}
