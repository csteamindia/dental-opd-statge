import db from "../models/index.js";
const { User, Doctors, Clinics} = db;

export const getDocCodeByClientId = async (ClientId) => {
  const a = await Doctors.findOne({
    attributes: ["code"],
    include: [
      {
        model: User,
        as: "clientbymobile",
        where: {
          user_id: ClientId,
        },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    ],
  });
  return a?.code;
}

export const getClient_dByClinicId = async (clinicId) => {
  const a = await Clinics.findOne({
    attributes: ["client_id"],
    where: { id: clinicId }
  });

  return a?.client_id;
}

export const getAllClinicsByClinicClientIdUseingClinicId = async (clinicId) => {
  const a = await Clinics.findOne({
    attributes: ["client_id"],
    where: { id: clinicId }
  });

  const ClientID =  a?.client_id;

  const clinics = await Clinics.findAll({
    attributes: ["id"],
    where: { client_id: ClientID }
  });
  const clinicIds = JSON.parse(JSON.stringify(clinics))
  return clinicIds?.map(v => v.id);
}
