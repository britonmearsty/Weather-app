import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-b from-sky-400 to-sky-200 w-screen h-screen fixed top-0 left-0 z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-8 border-t-yellow-400 border-b-white border-l-white border-r-white opacity-90 shadow-lg">
        {/* Represents a spinning sun/cloud loader */}
      </div>
      <div className="animate-bounce mt-8 text-white text-xl font-semibold tracking-wide">
        Loading weather...
      </div>
    </div>
  );
};

export default Loading;
