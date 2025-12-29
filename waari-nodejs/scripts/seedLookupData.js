const pool = require("../database/pool");

const roles = [
  { roleName: "Admin", description: "Full access" },
  { roleName: "Sales", description: "Sales team" },
  { roleName: "Operator", description: "Operations" },
];

const permissions = [
  { permissionName: "View Users", permissionCode: "USER_VIEW", componentId: 127 },
  { permissionName: "Add Users", permissionCode: "USER_ADD", componentId: 127 },
  { permissionName: "Edit Users", permissionCode: "USER_EDIT", componentId: 129 },
  { permissionName: "Delete Users", permissionCode: "USER_DELETE", componentId: 131 },
  { permissionName: "Update User Status", permissionCode: "USER_STATUS", componentId: 130 },
  { permissionName: "View Roles", permissionCode: "ROLE_VIEW", componentId: 150 },
];

const rolePermissionMap = [
  { roleName: "Admin", permissionCodes: permissions.map((p) => p.permissionCode) },
  { roleName: "Sales", permissionCodes: ["USER_VIEW", "USER_ADD", "USER_STATUS"] },
  { roleName: "Operator", permissionCodes: ["USER_VIEW", "USER_EDIT"] },
];

const departments = [
  "Sales",
  "Operations",
  "Finance",
  "Human Resources",
];

const positions = [
  "Manager",
  "Executive",
  "Team Lead",
  "Associate",
];

const sectors = [
  "Domestic",
  "International",
  "B2B",
  "B2C",
];

const establishmentTypes = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Pvt. Ltd.",
];

const ensureRow = async ({ table, selectColumn, whereClause, params, insertColumns, insertValues }) => {
  const [rows] = await pool.query(
    `SELECT ${selectColumn} AS id FROM ${table} WHERE ${whereClause} LIMIT 1`,
    params
  );
  if (rows.length) {
    return rows[0].id;
  }
  const placeholders = insertColumns.map(() => "?").join(", ");
  const [result] = await pool.query(
    `INSERT INTO ${table} (${insertColumns.join(", ")}) VALUES (${placeholders})`,
    insertValues
  );
  return result.insertId;
};

const ensureRole = (role) =>
  ensureRow({
    table: "roles",
    selectColumn: "roleId",
    whereClause: "roleName = ?",
    params: [role.roleName],
    insertColumns: ["roleName", "description"],
    insertValues: [role.roleName, role.description || null],
  });

const ensurePermission = (permission) =>
  ensureRow({
    table: "permissions",
    selectColumn: "permissionId",
    whereClause: "permissionCode = ?",
    params: [permission.permissionCode],
    insertColumns: ["permissionName", "permissionCode", "componentId"],
    insertValues: [permission.permissionName, permission.permissionCode, permission.componentId || null],
  });

const ensureSimpleLookup = (table, idColumn, nameColumn, value) =>
  ensureRow({
    table,
    selectColumn: idColumn,
    whereClause: `${nameColumn} = ?`,
    params: [value],
    insertColumns: [nameColumn],
    insertValues: [value],
  });

const ensureRolePermission = async (roleId, permissionId) => {
  const [rows] = await pool.query(
    `SELECT rolePermissionId AS id FROM role_permissions WHERE roleId = ? AND permissionId = ? LIMIT 1`,
    [roleId, permissionId]
  );
  if (rows.length) {
    return rows[0].id;
  }
  const [result] = await pool.query(
    `INSERT INTO role_permissions (roleId, permissionId) VALUES (?, ?)`,
    [roleId, permissionId]
  );
  return result.insertId;
};

(async () => {
  try {
    console.log("Seeding lookup data...");

    const roleIdMap = {};
    for (const role of roles) {
      roleIdMap[role.roleName] = await ensureRole(role);
    }

    const permissionIdMap = {};
    for (const permission of permissions) {
      permissionIdMap[permission.permissionCode] = await ensurePermission(permission);
    }

    for (const { roleName, permissionCodes } of rolePermissionMap) {
      const roleId = roleIdMap[roleName];
      for (const code of permissionCodes) {
        const permissionId = permissionIdMap[code];
        if (roleId && permissionId) {
          await ensureRolePermission(roleId, permissionId);
        }
      }
    }

    for (const name of departments) {
      await ensureSimpleLookup("departments", "departmentId", "departmentName", name);
    }

    for (const name of positions) {
      await ensureSimpleLookup("positions", "positionId", "positionName", name);
    }

    for (const name of sectors) {
      await ensureSimpleLookup("sectors", "sectorId", "sectorName", name);
    }

    for (const name of establishmentTypes) {
      await ensureSimpleLookup(
        "establishment_types",
        "establishmentTypeId",
        "establishmentTypeName",
        name
      );
    }

    console.log("Lookup data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
