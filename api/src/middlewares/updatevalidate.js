import * as response from "../middlewares/response-handler.js";
const responseHandler = response.default;

export const validateUnis = (req, res, next) => {
  if (req.method === "PUT") {
    const cols = req.body;
    const allowed = ["n_value", "n_status"];
    const keys = Object.keys(cols);
    if (keys.length === 0 || keys.every((key) => !allowed.includes(key))) {
      return responseHandler.unauthorized(res, "Unauthorized");
    }
    if (keys.some((key) => !allowed.includes(key))) {
      return responseHandler.unauthorized(res, "Unauthorized");
    }
    req.body = cols;
  }
  next();
};
