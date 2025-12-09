import db from "../models/index.js";
const { Role, Clinics, User, Sequelize } = db;

// Create new Role
// console.log("ROLE", Role)
const createRoleService = async req => {
  try {
    const { body } = req;
    const result = await Role.create(body);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllRolesService = async req => {
  try {
    const { clinic_id, client_id, page = 1, limit = 10, query } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = limit === "all" ? null : parseInt(limit, 10) || 10;
    const offset = parsedLimit ? (parsedPage - 1) * parsedLimit : null;

    const where = {};
    if (clinic_id) {
        where.clinic_id = {
            [Sequelize.Op.or]: [null, clinic_id]
        }
    }

    if (client_id) {
        where.client_id = {
            [Sequelize.Op.or]: [null, client_id]
        };
    }

    const condition = {
      where,
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: Clinics,
          as: "clinic",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
        {
          model: User,
          as: "client",
          required: false,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      order: [["role_id", "DESC"]],
    };
    if (query?.clinic_id) {
      condition.where = [
        {
          clinic_id: query?.clinic_id,
        },
      ];
    }

    if (parsedLimit) {
      condition.limit = parsedLimit;
      condition.offset = offset;
    }

    const result = await Role.findAndCountAll(condition);

    return {
      totalItems: result.count,
      totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
      currentPage: parsedPage,
      items: result.rows,
    };
  } catch (error) {
    console.error("Error fetching Roles:", error);
    throw error;
  }
};

// Get single Role by ID
const getRoleByIdService = async req => {
  try {
    const { role_id } = req.params;
    const result = await Role.findOne({
      where: {
        role_id,
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

// Update Role
const updateRoleService = async req => {
  try {
    const { role_id } = req.params;
    const { body } = req;
    const result = await Role.update(body, {
      where: {
        role_id,
        status: 0,
      },
    });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete Role (soft delete)
const deleteRoleService = async req => {
  try {
    const { role_id } = req.params;
    const { sts } = req.query;
    const result = await Role.update(
      { status: sts },
      {
        where: {
          role_id,
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
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService,
};
