const bcrypt = require("bcrypt");
const pool = require("../../database/pool");

const toNumber = (value, { allowNull = true, fallback = null } = {}) => {
  if (typeof value === "undefined") {
    return allowNull ? undefined : fallback;
  }
  if (value === null || value === "") {
    return allowNull ? null : fallback;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
};

let ensureTablePromise;

const ensureInfluencerAffiliateTable = () => {
  if (!ensureTablePromise) {
    ensureTablePromise = pool.query(`
      CREATE TABLE IF NOT EXISTS influencer_affiliates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(120) NOT NULL,
        lastName VARCHAR(120) NOT NULL,
        address VARCHAR(255) NOT NULL,
        email VARCHAR(150) NOT NULL,
        password VARCHAR(255),
        phoneNo VARCHAR(20),
        role TINYINT NOT NULL,
        status TINYINT NOT NULL DEFAULT 1,
        commissionType TINYINT DEFAULT 1,
        commissionValue DECIMAL(10,2) DEFAULT 0,
        maxCommission DECIMAL(10,2),
        accName VARCHAR(150),
        accNo VARCHAR(40),
        bankName VARCHAR(120),
        branch VARCHAR(120),
        ifsc VARCHAR(20),
        cheque VARCHAR(255),
        couponName VARCHAR(150),
        fromDate DATE,
        toDate DATE,
        discountType TINYINT,
        discountValue DECIMAL(10,2),
        maxDiscount DECIMAL(10,2),
        isType TINYINT DEFAULT 1,
        fbLink VARCHAR(255),
        instagramLink VARCHAR(255),
        twitterLink VARCHAR(255),
        otherLink VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_influencer_affiliate_email (email)
      )
    `);
  }
  return ensureTablePromise;
};

const toInt = (value, { allowNull = true, fallback = null } = {}) => {
  if (typeof value === "undefined") {
    return allowNull ? undefined : fallback;
  }
  if (value === null || value === "") {
    return allowNull ? null : fallback;
  }
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
};

const toTinyInt = (value, fallback = 0) => {
  const parsed = toInt(value, { allowNull: false, fallback });
  if (parsed === null || typeof parsed === "undefined") {
    return fallback;
  }
  return parsed ? 1 : 0;
};

const toText = (value) => {
  if (typeof value === "undefined") {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  const text = String(value).trim();
  return text.length ? text : null;
};

const toDateValue = (value) => {
  if (typeof value === "undefined") {
    return undefined;
  }
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

const listInfluencerAffiliates = async ({ page, perPage }) => {
  await ensureInfluencerAffiliateTable();
  const limit = perPage;
  const offset = (page - 1) * perPage;

  const [rows] = await pool.query(
    `SELECT id, firstName, lastName, role, phoneNo, email, address
       FROM influencer_affiliates
      ORDER BY id DESC
      LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[countRow]] = await pool.query("SELECT COUNT(1) AS total FROM influencer_affiliates");
  const total = countRow.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: rows,
    total,
    page,
    perPage,
    lastPage,
  };
};

const createInfluencerAffiliate = async (payload) => {
  await ensureInfluencerAffiliateTable();
  const hashedPassword = payload.password ? await bcrypt.hash(String(payload.password), 10) : null;

  const [result] = await pool.query(
    `INSERT INTO influencer_affiliates (
        firstName,
        lastName,
        address,
        email,
        password,
        phoneNo,
        role,
        status,
        commissionType,
        commissionValue,
        maxCommission,
        accName,
        accNo,
        bankName,
        branch,
        ifsc,
        cheque,
        couponName,
        fromDate,
        toDate,
        discountType,
        discountValue,
        maxDiscount,
        isType,
        fbLink,
        instagramLink,
        twitterLink,
        otherLink
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      toText(payload.firstName) ?? "",
      toText(payload.lastName) ?? "",
      toText(payload.address) ?? "",
      toText(payload.email) ?? "",
      hashedPassword,
      toText(payload.phoneNo) ?? "",
      toInt(payload.role, { allowNull: false, fallback: 1 }) || 1,
      toTinyInt(payload.status, 1),
      toInt(payload.commissionType, { allowNull: false, fallback: 1 }) || 1,
      toNumber(payload.commissionValue, { allowNull: false, fallback: 0 }) || 0,
      toNumber(payload.maxCommission),
      toText(payload.accName) ?? null,
      toText(payload.accNo) ?? null,
      toText(payload.bankName) ?? null,
      toText(payload.branch) ?? null,
      toText(payload.ifsc) ?? null,
      toText(payload.cheque) ?? null,
      toText(payload.couponName) ?? null,
      toDateValue(payload.fromDate) ?? null,
      toDateValue(payload.toDate) ?? null,
      toInt(payload.discountType, { allowNull: false, fallback: 1 }) || 1,
      toNumber(payload.discountValue, { allowNull: false, fallback: 0 }) || 0,
      toNumber(payload.maxDiscount),
      toInt(payload.isType, { allowNull: false, fallback: 1 }) || 1,
      toText(payload.fbLink) ?? null,
      toText(payload.instagramLink) ?? null,
      toText(payload.twitterLink) ?? null,
      toText(payload.otherLink) ?? null,
    ]
  );

  return { id: result.insertId };
};

const buildUpdateFields = async (payload) => {
  const fields = {};

  const assignIfPresent = (key, value) => {
    if (typeof value !== "undefined") {
      fields[key] = value;
    }
  };

  assignIfPresent("firstName", toText(payload.firstName));
  assignIfPresent("lastName", toText(payload.lastName));
  assignIfPresent("address", toText(payload.address));
  assignIfPresent("email", toText(payload.email));
  assignIfPresent("phoneNo", toText(payload.phoneNo));
  assignIfPresent("role", toInt(payload.role));
  assignIfPresent("status", typeof payload.status === "undefined" ? undefined : toTinyInt(payload.status, 1));
  assignIfPresent("commissionType", toInt(payload.commissionType));
  assignIfPresent("commissionValue", toNumber(payload.commissionValue));
  assignIfPresent("maxCommission", toNumber(payload.maxCommission));
  assignIfPresent("accName", toText(payload.accName));
  assignIfPresent("accNo", toText(payload.accNo));
  assignIfPresent("bankName", toText(payload.bankName));
  assignIfPresent("branch", toText(payload.branch));
  assignIfPresent("ifsc", toText(payload.ifsc));
  assignIfPresent("cheque", toText(payload.cheque));
  assignIfPresent("couponName", toText(payload.couponName));
  assignIfPresent("fromDate", toDateValue(payload.fromDate));
  assignIfPresent("toDate", toDateValue(payload.toDate));
  assignIfPresent("discountType", toInt(payload.discountType));
  assignIfPresent("discountValue", toNumber(payload.discountValue));
  assignIfPresent("maxDiscount", toNumber(payload.maxDiscount));
  assignIfPresent("isType", toInt(payload.isType));
  assignIfPresent("fbLink", toText(payload.fbLink));
  assignIfPresent("instagramLink", toText(payload.instagramLink));
  assignIfPresent("twitterLink", toText(payload.twitterLink));
  assignIfPresent("otherLink", toText(payload.otherLink));

  if (payload.password) {
    fields.password = await bcrypt.hash(String(payload.password), 10);
  }

  return fields;
};

const updateInfluencerAffiliate = async (payload) => {
  const id = toInt(payload.id, { allowNull: false });
  if (!id) {
    throw new Error("id is required");
  }

  await ensureInfluencerAffiliateTable();

  const fields = await buildUpdateFields(payload);
  const entries = Object.entries(fields);
  if (!entries.length) {
    return getInfluencerAffiliateById(id);
  }

  const columns = entries.map(([column]) => `${column} = ?`);
  const values = entries.map(([, value]) => value);

  columns.push("updatedAt = CURRENT_TIMESTAMP");

  values.push(id);

  await pool.query(
    `UPDATE influencer_affiliates
        SET ${columns.join(", ")}
      WHERE id = ?`,
    values
  );

  return getInfluencerAffiliateById(id);
};

const getInfluencerAffiliateById = async (id) => {
  await ensureInfluencerAffiliateTable();
  const [[row]] = await pool.query(
    `SELECT *
       FROM influencer_affiliates
      WHERE id = ?
      LIMIT 1`,
    [id]
  );

  return row || null;
};

const deleteInfluencerAffiliate = async (id) => {
  await ensureInfluencerAffiliateTable();
  const [result] = await pool.query("DELETE FROM influencer_affiliates WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listInfluencerAffiliates,
  createInfluencerAffiliate,
  getInfluencerAffiliateById,
  updateInfluencerAffiliate,
  deleteInfluencerAffiliate,
};
