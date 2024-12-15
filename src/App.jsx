import React from "react";
import CurrentInfo from "./components/CurrentInfo";
import CurrentWeather from "./components/CurrentWeather";
const App = () => {
  return (
    <div className="bg-[url(https://images.pexels.com/photos/27230218/pexels-photo-27230218/free-photo-of-a-view-of-the-ocean-and-a-mountain-in-the-distance.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load)] bg-no-repeat bg-cover bg-center h-screen flex items-center gap-10 flex-col">
      <CurrentInfo />
      <CurrentWeather />
    </div>
  );
};

export default App;
