import React, { useState, useEffect } from "react";

const Forecaster = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        // Default city if none provided
        const city = "London"; // Add city as prop or env variable as needed

        // Validate API key exists
        const apiKey = import.meta.env.VITE_APP_ID;
        if (!apiKey) {
          throw new Error("Missing API key in environment variables");
        }

        const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${encodeURIComponent(
          city,
        )}&appid=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch forecast data");
        }
        const data = await response.json();

        // Validate data structure
        if (!data.list || !Array.isArray(data.list)) {
          throw new Error("Invalid forecast data structure");
        }

        // Transform API response to match expected format
        const processedForecast = data.list.slice(0, 7).map((item, index) => {
          const date = new Date();
          date.setDate(date.getDate() + index);
          return {
            day: date.toLocaleDateString("en-US", { weekday: "long" }),
            temp: Math.round(((item.main.temp - 273.15) * 9) / 5 + 32), // Convert Kelvin to Fahrenheit
            condition: item.weather[0]?.main || "Unknown",
          };
        });

        setForecast(processedForecast);
        setLoading(false);
      } catch (err) {
        console.error("Forecast fetch error:", err);
        setError(err.message || "Failed to fetch forecast data");
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading)
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
        <div className="h-8 w-64 mx-auto mb-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-6 
                       shadow-lg border border-gray-200
                       flex flex-col items-center">
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-gray-800">
        Weekly Weather Forecast
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="backdrop-blur-md bg-white/30 rounded-lg sm:rounded-xl p-3 sm:p-6 
                     shadow-lg border border-white/20 
                     hover:transform hover:scale-105 transition-all
                     flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
              {day.day}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {day.temp}°F
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              {day.condition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecaster;
