const bcrypt = require("bcrypt");
const pool = require("../../database/pool");

const sanitizeBoolean = (value) => (value ? 1 : 0);

const toNullableInt = (value) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return null;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toNullableText = (value) => {
  if (value === null || typeof value === "undefined") {
    return null;
  }
  const text = String(value).trim();
  return text.length ? text : null;
};

const formatUserRow = (row) => {
  const status = sanitizeBoolean(row.status);
  return {
    userId: row.userId,
    userName: row.userName || `${row.firstName || ""} ${row.lastName || ""}`.trim(),
    roleName: row.roleName || "",
    contact: row.contact || "",
    email: row.email || "",
    status,
    userstatus: { userId: row.userId, status },
    updateuserstatus: { userId: row.userId, status },
  };
};

const listUsers = async ({ page, perPage }) => {
  const limit = perPage;
  const offset = (page - 1) * perPage;

  const [rows] = await pool.query(
    `SELECT u.userId, u.firstName, u.lastName, u.userName, u.email, u.contact, u.status, u.roleId,
            r.roleName
       FROM users u
       LEFT JOIN roles r ON r.roleId = u.roleId
      ORDER BY u.userId DESC
      LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[countRow]] = await pool.query("SELECT COUNT(1) AS total FROM users");
  const total = countRow.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: rows.map(formatUserRow),
    total,
    page,
    perPage,
    lastPage,
  };
};

const deleteUser = async (userId) => {
  await pool.query("DELETE FROM users WHERE userId = ?", [userId]);
};

const updateUserStatus = async ({ userId, status }) => {
  await pool.query("UPDATE users SET status = ? WHERE userId = ?", [sanitizeBoolean(status), userId]);
};

const createUser = async (payload) => {
  const hashedPassword = payload.password
    ? await bcrypt.hash(String(payload.password), 10)
    : null;

  const [result] = await pool.query(
    `INSERT INTO users (
        firstName,
        lastName,
        userName,
        email,
        password,
        contact,
        roleId,
        departmentId,
        positionId,
        sectorId,
        address,
        status,
        establishmentName,
        establishmentTypeId,
        adharNo,
        adharCard,
        panNo,
        pan,
        city,
        pincode,
        state,
        alternatePhone,
        shopAct,
        accName,
        accNo,
        bankName,
        branch,
        ifsc,
        cheque,
        logo,
        gender
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      toNullableText(payload.firstName) || "NA",
      toNullableText(payload.lastName) || "NA",
      toNullableText(payload.userName) || "",
      toNullableText(payload.email),
      hashedPassword,
      toNullableText(payload.contact),
      toNullableInt(payload.roleId),
      toNullableInt(payload.departmentId),
      toNullableInt(payload.positionId),
      toNullableInt(payload.sectorId),
      toNullableText(payload.address),
      sanitizeBoolean(payload.status ?? 1),
      toNullableText(payload.establishmentName),
      toNullableInt(payload.establishmentTypeId),
      toNullableText(payload.adharNo),
      toNullableText(payload.adharCard),
      toNullableText(payload.panNo),
      toNullableText(payload.pan),
      toNullableText(payload.city),
      toNullableText(payload.pincode),
      toNullableText(payload.state),
      toNullableText(payload.alternatePhone),
      toNullableText(payload.shopAct),
      toNullableText(payload.accName),
      toNullableText(payload.accNo),
      toNullableText(payload.bankName),
      toNullableText(payload.branch),
      toNullableText(payload.ifsc),
      toNullableText(payload.cheque),
      toNullableText(payload.logo),
      toNullableText(payload.gender),
    ]
  );

  return { userId: result.insertId };
};

const getUserById = async (userId) => {
  const [[row]] = await pool.query(
    `SELECT u.*, r.roleName
       FROM users u
       LEFT JOIN roles r ON r.roleId = u.roleId
      WHERE u.userId = ?
      LIMIT 1`,
    [userId]
  );

  if (!row) {
    return null;
  }

  return { ...row, status: sanitizeBoolean(row.status) };
};

const updateUser = async (payload) => {
  const userId = toNullableInt(payload.userId);
  if (!userId) {
    throw new Error("userId is required");
  }

  const hashedPassword = payload.password
    ? await bcrypt.hash(String(payload.password), 10)
    : null;

  const fields = {
    userName: toNullableText(payload.userName),
    email: toNullableText(payload.email),
    contact: toNullableText(payload.contact),
    roleId: toNullableInt(payload.roleId),
    departmentId: toNullableInt(payload.departmentId),
    positionId: toNullableInt(payload.positionId),
    sectorId: toNullableInt(payload.sectorId),
    address: toNullableText(payload.address),
    status: sanitizeBoolean(payload.status ?? 1),
    establishmentName: toNullableText(payload.establishmentName),
    establishmentTypeId: toNullableInt(payload.establishmentTypeId),
    adharNo: toNullableText(payload.adharNo),
    adharCard: toNullableText(payload.adharCard),
    panNo: toNullableText(payload.panNo),
    pan: toNullableText(payload.pan),
    city: toNullableText(payload.city),
    pincode: toNullableText(payload.pincode),
    state: toNullableText(payload.state),
    alternatePhone: toNullableText(payload.alternatePhone),
    shopAct: toNullableText(payload.shopAct),
    accName: toNullableText(payload.accName),
    accNo: toNullableText(payload.accNo),
    bankName: toNullableText(payload.bankName),
    branch: toNullableText(payload.branch),
    ifsc: toNullableText(payload.ifsc),
    cheque: toNullableText(payload.cheque),
    logo: toNullableText(payload.logo),
    gender: toNullableText(payload.gender),
  };

  const columns = [];
  const values = [];

  Object.entries(fields).forEach(([column, value]) => {
    columns.push(`${column} = ?`);
    values.push(value);
  });

  if (hashedPassword) {
    columns.push("password = ?");
    values.push(hashedPassword);
  }

  columns.push("updatedAt = CURRENT_TIMESTAMP");

  values.push(userId);

  await pool.query(`UPDATE users SET ${columns.join(", ")} WHERE userId = ?`, values);

  return getUserById(userId);
};

module.exports = {
  listUsers,
  deleteUser,
  updateUserStatus,
  createUser,
  getUserById,
  updateUser,
};
