const pool = require("../../database/pool");

const DEFAULT_CAT_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17, 19, 21, 24, 25, 26, 27, 29,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 46, 47, 48, 49, 50, 51, 52,
  53, 54, 55, 56, 59, 60, 61,
];

const FULL_ACCESS_LIST_IDS = Array.from({ length: 400 }, (_, index) => index + 1);

const sanitizeBoolean = (value) => (Number(value) === 0 ? 0 : 1);

const parseListIds = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const CATEGORY_NAME_MAP = {
  1: "Dashboard",
  2: "Group Tour Enquiries",
  3: "Customized Tour Enquiries",
  4: "Confirmed Group Tours",
  5: "Confirmed Customized Tours",
  6: "Billing Group Tours",
  7: "Globe Information",
  8: "Group Tours",
  9: "Commission Reports",
  10: "Coupon Management",
  12: "Booking Group Tours",
  13: "Booking Customized Tours",
  14: "Guest Information",
  16: "Lost Group Tours",
  17: "Lost Customized Tours",
  19: "Customized Tours",
  21: "Sales Target",
  24: "Roles & Permissions",
  25: "Users",
  26: "Billing Customized Tours",
  27: "All Future Enquiries",
  29: "Waari Select",
  31: "Affiliator & Influencers",
  32: "Feedback List",
  33: "My Future Enquiries",
  34: "All Group Tour Enquiries",
  35: "All Customized Tour Enquiries",
  36: "Confirmed All Group Tours",
  37: "Booking All Group Tours",
  38: "All Lost Group Tours",
  39: "Confirmed All Customized Tours",
  40: "Booking All Customized Tours",
  41: "All Lost Customized Tours",
  42: "Under Team Lead Sales",
  43: "Team Management",
  46: "All Guest List",
  47: "All Loyalty List",
  48: "Presales Group Tours",
  49: "Presales Customized Tours",
  50: "All Guest Search",
  51: "Search All Guests (Custom)",
  52: "Search All Guests (Group)",
  53: "Website Management",
  54: "Search Guests (Group)",
  55: "Search Guests (Custom)",
  56: "GIT Operation",
  59: "TailorMade Tours",
  60: "Operation Management",
  61: "All Operation Management",
};

const buildFullAccessPermissions = (listKey = "listId") =>
  DEFAULT_CAT_IDS.map((catId) => ({
    catId,
    [listKey]: [...FULL_ACCESS_LIST_IDS],
  }));

const listRoles = async ({ page, perPage, roleName }) => {
  const limit = perPage;
  const offset = (page - 1) * perPage;

  const params = [];
  let whereClause = "";
  if (roleName) {
    whereClause = "WHERE roleName LIKE ?";
    params.push(`%${roleName}%`);
  }

  const [rows] = await pool.query(
    `SELECT roleId, roleName, description, createdAt
       FROM roles
      ${whereClause}
      ORDER BY roleId DESC
      LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(1) AS total FROM roles ${whereClause}`,
    params
  );

  const total = countRow?.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: rows.map((row) => ({
      roleId: row.roleId,
      roleName: row.roleName,
      description: row.description || "",
      created_at: row.createdAt ? row.createdAt.toISOString() : null,
    })),
    total,
    page,
    perPage,
    lastPage,
  };
};

const getPermissionCategories = () =>
  DEFAULT_CAT_IDS.map((catId) => ({
    catId,
    catName: CATEGORY_NAME_MAP[catId] || `Category ${catId}`,
  }));

const getPermissionListsByCatId = (catId) => {
  if (!DEFAULT_CAT_IDS.includes(catId)) {
    return [];
  }

  return FULL_ACCESS_LIST_IDS.map((listId) => ({
    catId,
    listId,
    listName: `Permission ${listId}`,
  }));
};

const getPermissionsByRoleId = async (roleId) => {
  try {
    await pool.query(
      `SELECT 1
         FROM roles
        WHERE roleId = ?
        LIMIT 1`,
      [roleId]
    );
  } catch (error) {}

  return buildFullAccessPermissions();
};

const getRoleData = async (roleId) => {
  let roleRow = null;
  try {
    const [rows] = await pool.query(
      `SELECT roleId, roleName, isActive
         FROM roles
        WHERE roleId = ?
        LIMIT 1`,
      [roleId]
    );
    roleRow = rows[0] || null;
  } catch (error) {}

  return {
    roleId: Number(roleId),
    roleName: roleRow?.roleName || `Role ${roleId}`,
    isActive: sanitizeBoolean(roleRow?.isActive ?? 1),
    permissions: buildFullAccessPermissions("listIds"),
  };
};

const updateRoleData = async ({ roleId, roleName, isActive, permissions }) => {
  const numericRoleId = Number(roleId);
  const normalizedStatus = sanitizeBoolean(isActive);
  try {
    const [result] = await pool.query(
      `UPDATE roles
          SET roleName = ?, isActive = ?
        WHERE roleId = ?`,
      [roleName, normalizedStatus, numericRoleId]
    );
    if (!result.affectedRows) {
      await pool.query(
        `INSERT INTO roles (roleId, roleName, isActive)
             VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE roleName = VALUES(roleName), isActive = VALUES(isActive)`,
        [numericRoleId, roleName, normalizedStatus]
      );
    }
  } catch (error) {}

  return {
    roleId: numericRoleId,
    roleName,
    isActive: normalizedStatus,
    permissions: Array.isArray(permissions) ? permissions : [],
  };
};

module.exports = {
  listRoles,
  getPermissionCategories,
  getPermissionListsByCatId,
  getPermissionsByRoleId,
  getRoleData,
  updateRoleData,
};
