import React, { useEffect, useState } from "react";

const CurrentWeather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
    import.meta.env.VITE_APP_ID
  }&units=imperial`;

  useEffect(() => {
    // Get current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
                import.meta.env.VITE_APP_ID
              }&units=imperial`,
            );
            const result = await response.json();
            if (response.ok) {
              setWeatherData(result);
              setCity(result.name);
              setError(null);
            }
            else {
              setError(result.message);
            }
          } catch (err) {
            setError("Something went wrong");
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("Unable to get location");
          setCity("London");
          search("London");
        },
      );
    }
    else {
      setCity("London");
      search("London");
    }
  }, []);

  useEffect(() => {
    if (city) {
      search(city);
    }
  }, [city]);

  const search = async (searchCity) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setWeatherData(result);
        setError(null);
      }
      else {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    search(city);
  };

  return (
    <div className="weather-widget bg-white/30 backdrop-blur-md rounded-3xl shadow-lg p-8 w-full max-w-[800px] mx-auto border border-white/20 ">
      <div className="search-container flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Enter city name..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Search
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {loading ? (
        <>
          <div className="weather-main flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="temp-container text-center md:text-left">
              <div className="h-24 w-48 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>

            <div className="weather-info flex flex-col gap-6">
              <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-8 w-36 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>

          <div className="weather-details grid grid-cols-1 sm:grid-cols-3 gap-8 bg-white/20 rounded-2xl p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="detail-item flex flex-col items-center">
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        weatherData && (
          <>
            <div className="weather-main flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
              <div className="temp-container text-center md:text-left">
                <h1 className="temperature text-7xl md:text-8xl font-bold text-gray-800">
                  {Math.round(weatherData.main.temp)}°F
                </h1>
                <span className="feels-like text-gray-600 text-lg">
                  Feels like {Math.round(weatherData.main.feels_like)}°F
                </span>
              </div>

              <div className="weather-info flex flex-col gap-6">
                <div className="condition flex items-center gap-3">
                  <i className="weather-icon fas fa-sun text-yellow-500 text-4xl"></i>
                  <span className="text-gray-700 text-2xl">
                    {weatherData.weather[0].main}
                  </span>
                </div>
                <div className="location flex items-center gap-3">
                  <i className="fas fa-map-marker-alt text-red-500 text-2xl"></i>
                  <span className="text-gray-700 text-xl">
                    {weatherData.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="weather-details grid grid-cols-1 sm:grid-cols-3 gap-8 bg-white/20 rounded-2xl p-6">
              <div className="detail-item flex flex-col items-center">
                <span className="label text-gray-600 mb-2 text-lg">
                  Humidity
                </span>
                <span className="value text-2xl font-semibold text-gray-800">
                  {weatherData.main.humidity}%
                </span>
              </div>
              <div className="detail-item flex flex-col items-center">
                <span className="label text-gray-600 mb-2 text-lg">Wind</span>
                <span className="value text-2xl font-semibold text-gray-800">
                  {Math.round(weatherData.wind.speed)} mph
                </span>
              </div>
              <div className="detail-item flex flex-col items-center">
                <span className="label text-gray-600 mb-2 text-lg">
                  Pressure
                </span>
                <span className="value text-2xl font-semibold text-gray-800">
                  {weatherData.main.pressure} hPa
                </span>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default CurrentWeather;
