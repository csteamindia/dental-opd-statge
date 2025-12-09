// mobileDetect.js

export const detectMobile = (req) => {

  const userAgent = req.headers['user-agent'];
  // Check if the User-Agent contains a mobile device pattern
  const isMobile = /Dart|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  return isMobile;
};
