import { LuBike, LuBook, LuCloud, LuCoffee, LuDroplets, LuSun, LuUmbrella, LuWind } from "react-icons/lu"
import { ForecastEntry } from "./typings"

export const fetchLocationSuggestions = async (query: string) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
    const GEO_ENDPOINT = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    try {
        const response = await fetch(GEO_ENDPOINT)
        if (!response.ok) {
            throw new Error("Location not found")
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching location suggestions:", error)
        return []
    }
}

export const fetchCurrentWeather = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const WEATHER_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(WEATHER_ENDPOINT);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from Current Weather API:", errorData);
            throw new Error(`Current weather data not available: ${errorData.message}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching current weather data:", error);
        return null;
    }
};

export const fetchWeatherForecast = async (lat: number, lon: number) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const FORECAST_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(FORECAST_ENDPOINT);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from Forecast API:", errorData);
            throw new Error(`Forecast data not available: ${errorData.message}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        return null;
    }
};

export const celsiusToFahrenheit = (celsius: number): number => {
    return ((celsius * 9.0) / 5.0) + 32.0;
};


export const getWeatherIcon = (icon: string) => {
    const iconsMap: { [key: string]: JSX.Element } = {
        Clouds: <LuCloud className="h-12 w-12" />,
        Rain: <LuDroplets className="h-12 w-12" />,
        Clear: <LuSun className="h-12 w-12" />,
        Windy: <LuWind className="h-12 w-12" />,
    };
    return iconsMap[icon] || null;
};

export const getActivities = (weather: string) => {
    const activitiesMap: { [key: string]: { icon: JSX.Element; text: string }[] } = {
        Clear: [
            { icon: <LuSun className="h-6 w-6" />, text: "Take a walk in the park." },
            { icon: <LuBike className="h-6 w-6" />, text: "Perfect day for cycling." },
        ],
        Clouds: [
            { icon: <LuCloud className="h-6 w-6" />, text: "Enjoy a coffee and watch the clouds." },
            { icon: <LuBook className="h-6 w-6" />, text: "Read a book by the window." },
        ],
        Rain: [
            { icon: <LuDroplets className="h-6 w-6" />, text: "Stay indoors and enjoy a warm drink." },
            { icon: <LuUmbrella className="h-6 w-6" />, text: "Don't forget your umbrella." },
        ],
        Windy: [
            { icon: <LuWind className="h-6 w-6" />, text: "Fly a kite at the park." },
            { icon: <LuCoffee className="h-6 w-6" />, text: "Relax indoors with a warm coffee." },
        ],
    };

    return activitiesMap[weather] || [{ icon: <LuSun className="h-6 w-6" />, text: "Have a great day!" }];
};


export function groupForecastByDate(forecastList: ForecastEntry[]) {
    const grouped: { [date: string]: ForecastEntry } = {};
    forecastList.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = entry;
      }
    });
    return Object.values(grouped);
  }