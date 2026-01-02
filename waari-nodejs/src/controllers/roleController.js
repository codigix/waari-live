const roleService = require("../services/roleService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const sanitizePermissionsPayload = (permissions = []) =>
  permissions
    .map((item) => {
      const catId = toPositiveInt(item.catId, null);
      if (!catId) {
        return null;
      }
      const listIds = Array.isArray(item.listIds)
        ? item.listIds
            .map((id) => {
              const parsed = parseInt(id, 10);
              return Number.isNaN(parsed) ? null : parsed;
            })
            .filter((id) => id !== null)
        : [];
      return { catId, listIds };
    })
    .filter(Boolean);

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

const getRoleData = async (req, res, next) => {
  try {
    const roleId = toPositiveInt(req.query.roleId, null);
    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }
    const data = await roleService.getRoleData(roleId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const updateRoleData = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const roleId = toPositiveInt(payload.roleId, null);
    const roleName = typeof payload.roleName === "string" ? payload.roleName.trim() : "";
    if (!roleId || !roleName) {
      return res.status(400).json({ message: "roleId and roleName are required" });
    }
    const rawStatus =
      typeof payload.isActive === "number" ? payload.isActive : Number(payload.isActive);
    const isActive = Number.isNaN(rawStatus) ? 1 : rawStatus;
    const permissions = sanitizePermissionsPayload(payload.permissions || []);
    await roleService.updateRoleData({ roleId, roleName, isActive, permissions });
    res.json({ message: "Role updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listRoles,
  getPermissionCategories,
  getPermissionLists,
  getRolePermissions,
  getRoleData,
  updateRoleData,
};
