import React, { useEffect, useState } from "react"
const geoInfo = JSON.parse(localStorage.getItem("geoInfo")) || null
const timezone = geoInfo?.network?.timezone || "UTC"

const LiveClock = () => {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer) // cleanup
  }, [])

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  })

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone,
  })

  return (
    <div className="text-end">
      <p className="text-md">
        {formattedDate} | {formattedTime}
      </p>
    </div>
  )
}

export default LiveClock
