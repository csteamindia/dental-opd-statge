import React, { useState, useEffect } from "react";

const LiveTimer = ({ ism = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeUnit = (unit) => (unit < 10 ? `0${unit}` : unit);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = formatTimeUnit(date.getMinutes());
    const seconds = formatTimeUnit(date.getSeconds());
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12 in 12-hour format
    hours = formatTimeUnit(hours);

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="text-center mt-2 pt-1 rounded shadow-md w-64 mx-auto">
      <h2 className={`text-${ism ? 'black' : 'white'} font-bold`}>{formatTime(time)}</h2>
    </div>
  );
};

export default LiveTimer;
