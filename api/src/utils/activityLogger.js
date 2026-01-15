import db from "../models/index.js"

const { ActivityLog } = db

/**
 * Generic activity logger
 */
const logActivity = async ({
  entityType,
  entityId = null,
  action,
  description = null,
  oldData = null,
  newData = null,
  performedBy = "SYSTEM",
  ipAddress = null,
  userAgent = null,
}) => {
  try {
    return await ActivityLog.create({
      entity_type: entityType,
      entity_id: entityId,
      action,
      description,
      old_data: oldData,
      new_data: newData,
      performed_by: performedBy,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
  } catch (err) {
    // logging must NEVER break main flow
    console.error("Activity log failed:", err)
    return null
  }
}

export default logActivity
