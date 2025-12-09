import cookieHelper from "helpers/getCookieData"

export default function authHeader() {
  const obj = JSON.parse(cookieHelper.getCookie("authUser"))

  if (obj && obj.accessToken) {
    return { Authorization: obj.accessToken }
  } else {
    return {}
  }
}
