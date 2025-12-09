import httpStatus from "http-status";
import * as response from "../middlewares/response-handler.js";
import { updateNotificationService, addWPTService, updateWPTService, getWPTService } from "../services/Notifications.service.js";

const responseHandler = response.default;
const updateNotification = async (req, res) => {
  try {
    const data = await updateNotificationService(req);
    if (!data.success) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send(
          responseHandler(
            [],
            false,
            data.message || data.error || "Failed to update Notification"
          )
        );
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

const wpTemplates = async (req, res) => {
  try {
    const data = await addWPTService(req);
    if (!data.success) {
      return res.status(httpStatus.BAD_REQUEST).send(responseHandler([], false, data.message || data.error || "Failed to update Notification"));
    }
    res.status(httpStatus.OK).send(responseHandler(data.body, true));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

const getWPTemplates = async (req, res) => {
  try {
    const data = await getWPTService(req);
    res.status(httpStatus.OK).send(responseHandler(data.body, true));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

const updateWPTemplates = async (req, res) => {
  try {
    const data = await updateWPTService(req);
    res.status(httpStatus.OK).send(responseHandler(data.body, true));
  } catch (e) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send(responseHandler([], false, e.message));
  }
};

export { updateNotification, wpTemplates, getWPTemplates, updateWPTemplates }