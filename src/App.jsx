import React, { useState, useEffect } from "react";
import CurrentInfo from "./components/CurrentInfo";
import CurrentWeather from "./components/CurrentWeather";
import Forecaster from "./components/Forecaster";
import Loading from "./components/Loading";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[url(https://images.pexels.com/photos/27230218/pexels-photo-27230218/free-photo-of-a-view-of-the-ocean-and-a-mountain-in-the-distance.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load)] bg-no-repeat bg-cover bg-center h-full w-full md:h-screen md:w-screen flex items-center gap-10 flex-col bg-fixed">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <CurrentInfo />
          <CurrentWeather />
          <Forecaster />
        </>
      )}
    </div>
  );
};

export default App;
