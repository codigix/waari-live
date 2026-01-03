const pool = require("../../database/pool");

let ensureUserSalesTargetsPromise;

const ensureUserSalesTargetsTable = () => {
  if (!ensureUserSalesTargetsPromise) {
    ensureUserSalesTargetsPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS user_sales_targets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        yearId INT NOT NULL,
        monthId TINYINT NOT NULL,
        tourType TINYINT NOT NULL,
        target DECIMAL(12,2) NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_user_year_month_type (userId, yearId, monthId, tourType),
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);
  }
  return ensureUserSalesTargetsPromise;
};

const buildName = (row) => {
  if (row.userName && row.userName.trim()) {
    return row.userName.trim();
  }
  const first = row.firstName || "";
  const last = row.lastName || "";
  return `${first} ${last}`.trim();
};

const listSalesGuests = async ({ page, perPage, guestName }) => {
  const limit = perPage;
  const offset = (page - 1) * perPage;

  const filters = [];
  const values = [];

  if (guestName && guestName.trim()) {
    const search = `%${guestName.trim()}%`;
    filters.push("(u.userName LIKE ? OR u.firstName LIKE ? OR u.lastName LIKE ?)");
    values.push(search, search, search);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT u.userId, u.userName, u.firstName, u.lastName, u.contact, u.address
       FROM users u
       ${whereClause}
      ORDER BY u.userId DESC
      LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(1) AS total
       FROM users u
       ${whereClause}`,
    values
  );

  const total = countRow.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: rows.map((row) => ({
      userId: row.userId,
      userName: buildName(row) || "NA",
      contact: row.contact || "",
      address: row.address || "",
    })),
    total,
    page,
    perPage,
    lastPage,
  };
};

const toMonthId = (value) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1 || parsed > 12) {
    return null;
  }
  return parsed;
};

const toTargetValue = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeTargetArray = (targets = []) =>
  targets
    .map((item) => {
      const monthId = toMonthId(item.monthId);
      if (!monthId) {
        return null;
      }
      return { monthId, target: toTargetValue(item.target) };
    })
    .filter(Boolean);

const saveSalesTargets = async ({ userId, yearId, tourType, targetArray }) => {
  await ensureUserSalesTargetsTable();
  const normalizedTargets = normalizeTargetArray(targetArray);
  if (!normalizedTargets.length) {
    return { affectedRows: 0 };
  }

  const values = normalizedTargets.map((target) => [
    userId,
    yearId,
    target.monthId,
    tourType,
    target.target,
  ]);

  const placeholders = values.map(() => "(?,?,?,?,?)").join(", ");
  const flatValues = values.flat();

  await pool.query(
    `INSERT INTO user_sales_targets (userId, yearId, monthId, tourType, target)
     VALUES ${placeholders}
     ON DUPLICATE KEY UPDATE target = VALUES(target), updatedAt = CURRENT_TIMESTAMP`,
    flatValues
  );

  return { affectedRows: values.length };
};

const buildMonthlyTargets = (rows, tourType) => {
  const map = new Map();
  rows
    .filter((row) => Number(row.tourType) === tourType)
    .forEach((row) => {
      map.set(row.monthId, Number(row.target) || 0);
    });

  const result = [];
  for (let month = 1; month <= 12; month += 1) {
    result.push({ monthId: month, target: map.get(month) || 0 });
  }
  return result;
};

const getSalesTargets = async ({ userId, yearId }) => {
  await ensureUserSalesTargetsTable();
  const [rows] = await pool.query(
    `SELECT monthId, tourType, target
       FROM user_sales_targets
      WHERE userId = ? AND yearId = ?
      ORDER BY monthId ASC`,
    [userId, yearId]
  );

  return {
    salesDataGt: buildMonthlyTargets(rows, 1),
    salesDataCt: buildMonthlyTargets(rows, 2),
  };
};

module.exports = {
  listSalesGuests,
  saveSalesTargets,
  getSalesTargets,
};
