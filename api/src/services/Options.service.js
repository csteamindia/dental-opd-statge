/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
import db from '../models/index.js';
const { Allergies, Mediciens, TretmentTypes, Patients, Doctors, Chairs, Tags, CommunicationGroup, Language, Role, ReferenceTypes, Patient_Follow_Up, Sequelize } = db;
import { getDocCodeByClientId, getAllClinicsByClinicClientIdUseingClinicId } from '../utils/Basicutils.js';

// options patient (soft delete)
const patientsOptionsService = async (req) => {
  try {
    const { clinic_id } = req.query;

    const result = await Patients.findAll(
      {
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
        ],
        where: {
          clinic_id: clinic_id,
          status: 0
        }
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const dynamicPatientOptionsService = async (req) => {
  try {
    let { query: { client_id, clinic_id }, tokendata } = req;

    const where = { status: 0 }
    if(clinic_id){
      where.clinic_id = {
        [Sequelize.Op.or]: [clinic_id, null]
      }
    }

    if(tokendata?.role == 'admin'){
      where.client_id = {
          [Sequelize.Op.or]: [client_id, null]
      };
    }
    
    const [tags_res, communicationGroup_res, language_res, allergies_res] = await Promise.all([
      Tags.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where
      }),
      CommunicationGroup.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where
      }),
      Language.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where
      }),
      Allergies.findAll({
        attributes: [
          [Sequelize.literal('id'), 'value'],
          [Sequelize.literal('title'), 'label']
        ],
        where
      }),
    ]);

    return { 
      tags: tags_res,
      communicationGroup: communicationGroup_res,
      language: language_res,
      allergies: allergies_res
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const dynamicOptionsService = async req => {
  try {
    let { query: { client_id, clinic_id, _type, search, optionType = false }, tokendata } = req;

    client_id = client_id ? client_id : tokendata?.client_id;


    const docCode = await getDocCodeByClientId(client_id || tokendata?.user_id);
    
    const where = { status: 0 }

    if(clinic_id){
      where.clinic_id = {
        [Sequelize.Op.or]: [clinic_id, null]
      }
    }

    if(client_id){
      where.client_id = {
        [Sequelize.Op.or]: [client_id, null]
      } 
    }

    switch (_type) {
      case 'mediciens':
        return await Mediciens.findAll({
          attributes: [[Sequelize.literal('id'), 'value'], [Sequelize.literal("name"), 'label'], "molucule", 'dose', 'frequent', "duration",],
          where: where
        });
      case 'patient':
      case 'patients': {
        let _where = { clinic_id, status: 0 };
        if (search) {
          _where.first_name = { [Sequelize.Op.like]: `%${search}%` };
        }
        return await Patients.findAll({
          attributes: [
            ['id', 'value'],
            [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
          ],
          where: _where,
        });
      }
      case 'doctors': {
        let base = { client_id: client_id, status: 0 };
        let condition = base;
        if (!optionType) {
          if (search) {
            condition = {
              ...base,
              [Sequelize.Op.or]: [
                { name: { [Sequelize.Op.like]: `%${search}%` } },
                { code: { [Sequelize.Op.like]: `%${search}%` } }
              ]
            };
          } else if (docCode) {
            condition = { ...base, code: docCode };
          }
        }

        return await Doctors.findAll({
          attributes: [
            [Sequelize.literal('id'), 'id'],
            [Sequelize.literal('code'), 'value'],
            [Sequelize.literal('name'), 'label']
          ],
          where: condition,
          raw: true,
        });
      }
      case 'referenceType':
        return await ReferenceTypes.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'followUp':
        return await Patient_Follow_Up.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'communicationGroup':
        return await CommunicationGroup.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'treatment':
        return await TretmentTypes.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'chair':
        return await Chairs.findAll({
          attributes: [
            [Sequelize.literal('id'), 'value'],
            [Sequelize.literal('title'), 'label']
          ],
          where: where
        });
      case 'role':
        return await Role.findAll({
          attributes: [
            [Sequelize.literal('role_id'), 'value'],
            [Sequelize.literal('name'), 'label']
          ],
          where: where
        });
      default:
        const [patients_res, doctors_res, treatments_res, chairs_res, role_res, referenceType_res, Patient_Follow_Up_res, communicationGroup_res] = await Promise.all([
          Patients.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal("CONCAT(first_name, ' ', last_name)"), 'label']
            ],
            where: { clinic_id, status: 0 }
          }),
          Doctors.findAll({
            attributes: [
              [Sequelize.literal('id'), 'id'],
              [Sequelize.literal('code'), 'value'],
              [Sequelize.literal('name'), 'label']
            ],
            where: {
              [Sequelize.Op.or]: [
                { client_id },
                { code: docCode }
              ],
              status: 0
            }
          }),
          TretmentTypes.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          }),
          Chairs.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          }),
          Role.findAll({
            attributes: [
              ['role_id', 'value'],
              ['name', 'label']
            ],
            where: where
          }),
          ReferenceTypes.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          }),
          Patient_Follow_Up.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('added_by'), 'label']
            ],
            where: where
          }),
          CommunicationGroup.findAll({
            attributes: [
              [Sequelize.literal('id'), 'value'],
              [Sequelize.literal('title'), 'label']
            ],
            where: where
          }),
        ]);

        return {
          patients: patients_res,
          doctors: doctors_res,
          treatments: treatments_res,
          chairs: chairs_res,
          role: role_res,
          referenceType: referenceType_res,
          Patient_Follow_Up: Patient_Follow_Up_res,
          communicationGroup: communicationGroup_res
        };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  patientsOptionsService,
  dynamicPatientOptionsService,
  dynamicOptionsService
};
