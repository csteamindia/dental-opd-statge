const IP_API_URL = "https://ipapi.co/json/"
const REQUEST_TIMEOUT = 5000

/* ---------- helpers ---------- */

const fetchWithTimeout = (url, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  return fetch(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  )
}

const getBrowserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || null

const getDeviceInfo = () => ({
  userAgent: navigator.userAgent || null,
  platform: navigator.platform || null,
  language: navigator.language || null,
  languages: navigator.languages || [],
  screen: `${window.screen.width}x${window.screen.height}`,
  cpuCores: navigator.hardwareConcurrency || null,
  memory: navigator.deviceMemory || null,
  cookieEnabled: navigator.cookieEnabled,
})

/* ---------- main ---------- */

export const getClientDetails = async () => {
  try {
    const res = await fetchWithTimeout(IP_API_URL)

    if (!res.ok) throw new Error("IP API failed")

    const data = await res.json()

    return {
      ip: data.ip ?? null,

      location: {
        city: data.city ?? null,
        region: data.region ?? null,
        country: data.country_name ?? null,
        countryCode: data.country_code ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      },

      network: {
        timezone: data.timezone ?? null,
        org: data.org ?? null,
        isp: data.org ?? null,
      },

      browserTimezone: getBrowserTimezone(),
      device: getDeviceInfo(),
      source: "ipapi",
    }
  } catch (error) {
    console.error("getClientDetails error:", error)

    return {
      ip: null,
      location: null,
      network: null,
      browserTimezone: getBrowserTimezone(),
      device: getDeviceInfo(),
      source: "fallback",
    }
  }
}
