import moment from "moment-timezone"

// Get timezone from geoInfo or default UTC
const geoInfo = JSON.parse(localStorage.getItem("geoInfo")) || null
const timezone = geoInfo?.network?.timezone || "Asia/Kolkata"

/**
 * Format a date/time string in user's timezone
 * Supports: full datetime, date only, time only
 */
export const getZoneDateTime = (dateString = false) => {
  let input = dateString

  if (!input) {
    // No input → now
    return moment().tz(timezone)
  }

  // Check if input is only time (HH:mm:ss)
  const timeOnlyPattern = /^\d{2}:\d{2}:\d{2}$/
  if (timeOnlyPattern.test(input)) {
    const today = moment().format("YYYY-MM-DD")
    input = `${today} ${input}`
  }

  // Check if input is date only (YYYY-MM-DD)
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
  if (dateOnlyPattern.test(input)) {
    input = `${input} 00:00:00`
  }

  // Now safe to parse
  return moment(input).tz(timezone)
  //   return moment.tz(input, "YYYY-MM-DD HH:mm:ss", timezone)
}

/**
 * Simple helper to format date (YYYY-MM-DD)
 */
const Timezone = dateString => {
  return getZoneDateTime(dateString).format("YYYY-MM-DD")
}

export default Timezone
