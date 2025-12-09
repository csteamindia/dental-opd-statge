import db from "../models/index.js";
const { Notifications, User, Clinics } = db;
// console.log("Notifications", Notifications);
const updateNotificationService = async (req) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const [updated] = await Notifications.update(body, {
      where: {
        id,
        n_status: 0,
      },
    });

    if (!updated) {
      return {
        success: false,
        body: null,
        message: "Notification not found or not updated",
      };
    }

    const updatedNotification = await Notifications.findByPk(id);
    return { success: true, body: updatedNotification };
  } catch (error) {
    console.error("Error updating Notification:", error);
    return { success: false, body: null, error: error.message };
  }
};

const addWPTService = async (data) => {
  try {
    const newWPT = await WPT.create(data);
    return { success: true, data: newWPT };
  } catch (error) {
    console.error("Error adding WPT:", error);
    return { success: false, message: error.message };
  }
};

const getWPTService = async ({ id, ...filters } = {}) => {
  try {
    if (id) {
      const wpt = await WPT.findByPk(id);
      if (!wpt) return { success: false, message: "WPT not found" };
      return { success: true, data: wpt };
    }

    const wpts = await WPT.findAll({ where: filters });
    return { success: true, data: wpts };
  } catch (error) {
    console.error("Error fetching WPT(s):", error);
    return { success: false, message: error.message };
  }
};

const updateWPTService = async (id, updateData) => {
  try {
    const [updatedCount] = await WPT.update(updateData, { where: { id } });

    if (updatedCount === 0) {
      return { success: false, message: "No record updated. WPT may not exist." };
    }

    const updatedWPT = await WPT.findByPk(id);
    return { success: true, data: updatedWPT };
  } catch (error) {
    console.error("Error updating WPT:", error);
    return { success: false, message: error.message };
  }
};



export {updateNotificationService, addWPTService, updateWPTService, getWPTService}