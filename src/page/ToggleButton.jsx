import { useState } from "react";

const ToggleButton = ({isOn , setIsOn}) => {

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="flex items-center gap-3">
        {/* Switch Text */}
        <span className={`text-lg font-semibold transition-all duration-300 ${isOn ? "text-gray-400" : "text-gray-700"}`}>
          Switch
        </span>

        {/* Toggle Button */}
        <div
          className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
            isOn ? "bg-green-500" : "bg-gray-300"
          }`}
          onClick={() => setIsOn(!isOn)}
        >
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              isOn ? "translate-x-8" : "translate-x-0"
            }`}
          />
        </div>

        {/* Server Text */}
        <span className={`text-lg font-semibold transition-all duration-300 ${isOn ? "text-gray-700" : "text-gray-400"}`}>
          Server
        </span>
      </div>
    </div>
  );
};

export default ToggleButton;
