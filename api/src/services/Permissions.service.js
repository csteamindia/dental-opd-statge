import db from "../models/index.js";
const { Permission, Clinics, Role, User } = db;

// Create new Permission
const createPermissionService = async (req) => {
  try {
    const { body } = req;
    const result = await Permission.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get all Permissions

const getAllPermissionsService = async (req) => {
  try {
    const {
      clinic_id,
      client_id,
      role_id,
      page = 1,
      isconfig = 0,
      limit = 10
    } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = { status: 0 };
    if (clinic_id) where.clinic_id = clinic_id;
    if (client_id) where.client_id = client_id;
    if (role_id) where.role_id = role_id;

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: true,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: Role,
          as: "role",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["permission_id", "DESC"]],
    };

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Permission.findAndCountAll(condition);

    if(isconfig){
      const p = {
        clinic_id,
        client_id,
        role_id,
        modules: {
          'Accounts': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Allergies': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Appointment': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Banks': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Chairs': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Clinics': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Communication-Gr': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Dentalchart': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'DentalChartTooth': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Doctor-Timings': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Doctors': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Examinations': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'feedback-quation': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'feedbacks': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Files': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Health': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Investigations':{is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Mediciens': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'patient-follow-u': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'patient-notes': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Patient-Tags': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'patients': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Permissions': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Prescriptions': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'reference-types': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'reports': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Roles': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'RX-Templates': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1},
          'Tretments': {is_accessable: 0, is_creatable: 0, is_readable: 0, is_writable: 0, is_deletable: 0, is_creatable_checkbox: 1, is_readable_checkbox: 1, is_writable_checkbox: 1, is_deletable_checkbox: 1}
        }
      }
      return result.rows.length ? result.rows : p;
    }
3
    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error("Error fetching Permissions:", error);
    throw error;
  }
};

// Get single Permission by ID
const getPermissionByIdService = async (req) => {
  try {
    const { permission_id } = req.params;
    const result = await Permission.findOne({
      where: {
        permission_id,
        status: 0,
      },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update Permission
const updatePermissionService = async (req) => {
  try {
    const { permission_id } = req.params;
    const { body } = req;
    const result = await Permission.update(body, {
      where: {
        permission_id,
        status: 0,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete Permission (soft delete)
const deletePermissionService = async (req) => {
  try {
    const { permission_id } = req.params;
    const { sts } = req.query;
    const result = await Permission.update(
      { status: sts },
      {
        where: {
          permission_id,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  createPermissionService,
  getAllPermissionsService,
  getPermissionByIdService,
  updatePermissionService,
  deletePermissionService,
};
