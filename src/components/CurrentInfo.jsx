import React, { useState, useEffect } from "react";
// CurrentInfo component displays current time, date and location information
const CurrentInfo = () => {
  // State for tracking current time
  const [currentTime, setCurrentTime] = useState(new Date());
  // State for storing latitude/longitude coordinates
  const [location, setLocation] = useState("");
  // State for storing city name based on coordinates
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    // Set up timer to update time every second for live clock display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user's geolocation if browser supports it
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Extract latitude and longitude from position object
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);

          try {
            // Call OpenWeatherMap API to get city name from coordinates
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${
                import.meta.env.VITE_APP_ID
              }`,
            );
            const data = await response.json();
            // Update city name state with API response
            setCityName(data[0].name);
          } catch (error) {
            console.error("Error fetching city name:", error);
            setCityName(city); // Fallback to imported city if API call fails
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setCityName(city); // Fallback to imported city if geolocation fails
        },
      );
    }
    else {
      setCityName(city); // Fallback to imported city if geolocation not supported
    }

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount

  // Helper function to return appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Render component UI with time, date and location information
  return (
    <div className="backdrop-blur-xl rounded-xl shadow-2xl p-8 max-w-md mx-auto mt-12 border-2 border-white/30 transition-all duration-300">
      <h2 className="text-4xl font-bold text-gray-900 mb-6 backdrop-blur-sm tracking-tight">
        {getGreeting()}!
      </h2>
      <div className="text-3xl font-semibold text-blue-700 mb-4 backdrop-blur-sm tracking-wide">
        {currentTime.toLocaleTimeString()}
      </div>
      <div className="text-lg text-gray-700 mb-6 backdrop-blur-sm font-medium">
        {currentTime.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className="text-gray-800 backdrop-blur-sm text-lg">
        {cityName ? (
          <div className="flex items-center hover:text-blue-600 transition-colors duration-200">
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {cityName}
          </div>
        ) : (
          <div className="flex items-center">Location: loading....</div>
        )}
      </div>
    </div>
  );
};

export default CurrentInfo;
