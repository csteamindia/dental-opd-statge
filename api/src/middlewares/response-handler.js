/**
 * Generic success response handler
 *
 * @author Praveenkumar Yennam
 *
 * @param {*} body - response that needs to be returned as part of API result
 */ // previous version

const responseHandler = (body, success = true, message = "") => {
  const response = { success, body };
  if (message) {
    response.message = message;
  }
  return response;
};

// Attach additional response helpers
responseHandler.unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    body: null,
    message,
  });
};

export default responseHandler;
