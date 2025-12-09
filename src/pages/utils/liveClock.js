import React, { useEffect, useState } from "react";

const LiveClock = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
        setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // cleanup
    }, []);

    const formattedDate = dateTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Africa/Dar_es_Salaam",
    });

    const formattedTime = dateTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Africa/Dar_es_Salaam",
    });

    return (
        <div className="text-end">
            <p className="text-md">{formattedDate} | {formattedTime}</p>
        </div>
    );
};

export default LiveClock;
