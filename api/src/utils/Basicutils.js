import db from "../models/index.js"
const { User, Doctors, Clinics } = db

export const getDocCodeByClientId = async ClientId => {
  try {
    if (!ClientId) return null

    const doctor = await Doctors.findOne({
      attributes: ["code"],
      include: [
        {
          model: User,
          as: "clientbymobile",
          where: { user_id: ClientId },
          attributes: [],
          required: true,
        },
      ],
    })

    return doctor?.code || null
  } catch (error) {
    console.error("getDocCodeByClientId error:", {
      ClientId,
      message: error.message,
    })
    throw error // bubble up – don’t hide real bugs
  }
}

export const getClient_dByClinicId = async clinicId => {
  const a = await Clinics.findOne({
    attributes: ["client_id"],
    where: { id: clinicId },
  })

  return a?.client_id
}

export const getAllClinicsByClinicClientIdUseingClinicId = async clinicId => {
  const a = await Clinics.findOne({
    attributes: ["client_id"],
    where: { id: clinicId },
  })

  const ClientID = a?.client_id

  const clinics = await Clinics.findAll({
    attributes: ["id"],
    where: { client_id: ClientID },
  })
  const clinicIds = JSON.parse(JSON.stringify(clinics))
  return clinicIds?.map(v => v.id)
}
