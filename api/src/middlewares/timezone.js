export const timezoneMiddleware = (req, res, next) => {
  const timezone = req.headers["x-timezone"] || "UTC" // default UTC if not provided
  req.timezone = timezone
  next()
}
