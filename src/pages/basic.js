import cookieHelper from "helpers/getCookieData";
export const getConfigData = () => cookieHelper.getCookie('authUser') ? JSON.parse(cookieHelper.getCookie('authUser')) : null;