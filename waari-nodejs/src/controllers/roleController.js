const roleService = require("../services/roleService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const listRoles = async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const perPage = toPositiveInt(req.query.perPage, 10);
    const roleName = req.query.roleName ? String(req.query.roleName).trim() : "";

    const result = await roleService.listRoles({ page, perPage, roleName });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPermissionCategories = async (req, res, next) => {
  try {
    const categories = roleService.getPermissionCategories();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const getPermissionLists = async (req, res, next) => {
  try {
    const catId = toPositiveInt(req.query.catId, null);
    if (!catId) {
      return res.status(400).json({ message: "catId is required" });
    }

    const lists = roleService.getPermissionListsByCatId(catId);
    res.json({ data: lists });
  } catch (error) {
    next(error);
  }
};

const getRolePermissions = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }
    const permissions = await roleService.getPermissionsByRoleId(roleId);
    res.json({ roleId: Number(roleId), permissions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listRoles,
  getPermissionCategories,
  getPermissionLists,
  getRolePermissions,
};
