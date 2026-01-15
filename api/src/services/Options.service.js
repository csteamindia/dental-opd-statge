/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
import db from "../models/index.js"
const {
  Allergies,
  Mediciens,
  TretmentTypes,
  Patients,
  Doctors,
  Chairs,
  Tags,
  CommunicationGroup,
  Language,
  Role,
  ReferenceTypes,
  Patient_Follow_Up,
  Sequelize,
} = db
import {
  getDocCodeByClientId,
  getAllClinicsByClinicClientIdUseingClinicId,
} from "../utils/Basicutils.js"

// options patient (soft delete)
const patientsOptionsService = async req => {
  try {
    const { clinic_id } = req.query

    const result = await Patients.findAll({
      attributes: [
        [Sequelize.literal("id"), "value"],
        [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), "label"],
      ],
      where: {
        clinic_id: clinic_id,
        status: 0,
      },
    })
    return result
  } catch (error) {
    console.error(error)
    throw error
  }
}

const dynamicPatientOptionsService = async req => {
  try {
    let {
      query: { client_id, clinic_id },
      tokendata,
    } = req

    const where = { status: 0 }
    if (clinic_id) {
      where.clinic_id = {
        [Sequelize.Op.or]: [clinic_id, null],
      }
    }

    if (tokendata?.role == "admin") {
      where.client_id = {
        [Sequelize.Op.or]: [client_id, null],
      }
    }

    const [tags_res, communicationGroup_res, language_res, allergies_res] =
      await Promise.all([
        Tags.findAll({
          attributes: [
            [Sequelize.literal("id"), "value"],
            [Sequelize.literal("title"), "label"],
          ],
          where,
        }),
        CommunicationGroup.findAll({
          attributes: [
            [Sequelize.literal("id"), "value"],
            [Sequelize.literal("title"), "label"],
          ],
          where,
        }),
        Language.findAll({
          attributes: [
            [Sequelize.literal("id"), "value"],
            [Sequelize.literal("title"), "label"],
          ],
          where,
        }),
        Allergies.findAll({
          attributes: [
            [Sequelize.literal("id"), "value"],
            [Sequelize.literal("title"), "label"],
          ],
          where,
        }),
      ])

    return {
      tags: tags_res,
      communicationGroup: communicationGroup_res,
      language: language_res,
      allergies: allergies_res,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const dynamicOptionsService = async req => {
  try {
    const {
      query: { client_id, clinic_id, _type, search, optionType = false },
      tokendata,
    } = req

    const resolvedClientId = client_id || tokendata?.client_id
    const docCode = await getDocCodeByClientId(
      resolvedClientId || tokendata?.user_id
    )

    const baseWhere = { status: 0 }

    if (clinic_id) {
      baseWhere.clinic_id = { [Sequelize.Op.or]: [clinic_id, null] }
    }

    if (resolvedClientId) {
      baseWhere.client_id = { [Sequelize.Op.or]: [resolvedClientId, null] }
    }

    switch (_type) {
      case "mediciens":
        return Mediciens.findAll({
          attributes: [
            "id",
            "name",
            "molucule",
            "dose",
            "frequent",
            "duration",
          ],
          where: baseWhere,
        }).then(rows =>
          rows.map(r => ({
            value: r.id,
            label: r.name,
            molucule: r.molucule,
            dose: r.dose,
            frequent: r.frequent,
            duration: r.duration,
          }))
        )

      case "patient":
      case "patients": {
        const where = { clinic_id, status: 0 }
        if (search) {
          where.first_name = { [Sequelize.Op.like]: `%${search}%` }
        }

        return Patients.findAll({
          attributes: ["id", "first_name", "last_name"],
          where,
        }).then(rows =>
          rows.map(p => ({
            value: p.id,
            label: `${p.first_name} ${p.last_name}`,
          }))
        )
      }

      case "doctors": {
        let where = { client_id: resolvedClientId, status: 0 }

        if (!optionType) {
          if (search) {
            where = {
              ...where,
              [Sequelize.Op.or]: [
                { name: { [Sequelize.Op.like]: `%${search}%` } },
                { code: { [Sequelize.Op.like]: `%${search}%` } },
              ],
            }
          } else if (docCode) {
            where.code = docCode
          }
        }

        return Doctors.findAll({
          attributes: ["id", "code", "name", "doc_chair"],
          where,
        }).then(rows =>
          rows.map(d => ({
            id: d.id,
            value: d.code,
            label: d.name,
            doc_chair: d.doc_chair,
          }))
        )
      }

      case "referenceType":
        return ReferenceTypes.findAll({
          attributes: ["id", "title"],
          where: baseWhere,
        }).then(r => r.map(x => ({ value: x.id, label: x.title })))

      // case "followUp":
      //   return Patient_Follow_Up.findAll({
      //     attributes: ["id", "title"],
      //     where: baseWhere,
      //   }).then(r => r.map(x => ({ value: x.id, label: x.title })))

      case "communicationGroup":
        return CommunicationGroup.findAll({
          attributes: ["id", "title"],
          where: baseWhere,
        }).then(r => r.map(x => ({ value: x.id, label: x.title })))

      case "treatment":
        return TretmentTypes.findAll({
          attributes: ["id", "title"],
          where: baseWhere,
        }).then(r => r.map(x => ({ value: x.id, label: x.title })))

      case "chair":
        return Chairs.findAll({
          attributes: ["id", "title"],
          where: baseWhere,
        }).then(r => r.map(x => ({ value: x.id, label: x.title })))

      case "role":
        return Role.findAll({
          attributes: ["role_id", "name"],
          where: baseWhere,
        }).then(r => r.map(x => ({ value: x.role_id, label: x.name })))

      /** Legacy fallback (no _type) */
      default: {
        const [
          patients,
          doctors,
          treatments,
          chairs,
          roles,
          referenceTypes,
          // followUps,
          communicationGroups,
        ] = await Promise.all([
          Patients.findAll({
            attributes: ["id", "first_name", "last_name"],
            where: { clinic_id, status: 0 },
          }),
          Doctors.findAll({
            attributes: ["id", "code", "name", "doc_chair"],
            where: {
              status: 0,
              [Sequelize.Op.or]: [
                { client_id: resolvedClientId },
                { code: docCode },
              ],
            },
          }),
          TretmentTypes.findAll({
            attributes: ["id", "title"],
            where: baseWhere,
          }),
          Chairs.findAll({ attributes: ["id", "title"], where: baseWhere }),
          Role.findAll({ attributes: ["role_id", "name"], where: baseWhere }),
          ReferenceTypes.findAll({
            attributes: ["id", "title"],
            where: baseWhere,
          }),
          // Patient_Follow_Up.findAll({
          //   attributes: ["id", "title"],
          //   where: baseWhere,
          // }),
          CommunicationGroup.findAll({
            attributes: ["id", "title"],
            where: baseWhere,
          }),
        ])

        return {
          patients: patients.map(p => ({
            value: p.id,
            label: `${p.first_name} ${p.last_name}`,
          })),
          doctors: doctors.map(d => ({
            id: d.id,
            value: d.code,
            label: d.name,
            doc_chair: d.doc_chair,
          })),
          treatments: treatments.map(t => ({ value: t.id, label: t.title })),
          chairs: chairs.map(c => ({ value: c.id, label: c.title })),
          role: roles.map(r => ({ value: r.role_id, label: r.name })),
          referenceType: referenceTypes.map(r => ({
            value: r.id,
            label: r.title,
          })),
          // Patient_Follow_Up: followUps.map(f => ({
          //   value: f.id,
          //   label: f.title,
          // })),
          communicationGroup: communicationGroups.map(c => ({
            value: c.id,
            label: c.title,
          })),
        }
      }
    }
  } catch (error) {
    console.error("dynamicOptionsService error:", error)
    throw error
  }
}

export {
  patientsOptionsService,
  dynamicPatientOptionsService,
  dynamicOptionsService,
}
