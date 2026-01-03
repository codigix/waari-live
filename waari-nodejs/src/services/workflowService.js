const pool = require("../../database/pool");

const TOUR_TYPES = ["GROUP", "CUSTOM"];
const TOUR_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const ENQUIRY_STATUSES = ["NEW", "FOLLOW_UP", "CONFIRMED", "LOST"];
const ENQUIRY_STAGES = {
  NEW: "ENQUIRY",
  FOLLOW_UP: "FOLLOW_UP",
  CONFIRMED: "CONFIRMED",
  LOST: "LOST",
};
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const toPositiveInt = (value, fallback = null) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const toSafeString = (value) => (value === null || value === undefined ? "" : String(value)).trim();

const toNullableDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString().slice(0, 10);
};

const normalizeEnum = (value, allowed, fallback) => {
  const token = toSafeString(value).toUpperCase();
  if (!token) {
    return fallback;
  }
  return allowed.includes(token) ? token : fallback;
};

const mapEnquiryStage = (status) => ENQUIRY_STAGES[status] || "ENQUIRY";

const generateCode = (prefix) => `${prefix}-${Date.now()}`;

const getTourById = async (tourId) => {
  const [[row]] = await pool.query(
    `SELECT * FROM tours WHERE tourId = ? LIMIT 1`,
    [tourId]
  );
  return row || null;
};

const createTour = async (payload = {}) => {
  const name = toSafeString(payload.tourName);
  if (!name) {
    const error = new Error("tourName is required");
    error.status = 400;
    throw error;
  }
  const type = normalizeEnum(payload.tourType, TOUR_TYPES, "GROUP");
  const status = normalizeEnum(payload.status, TOUR_STATUSES, "DRAFT");
  const startDate = toNullableDate(payload.startDate);
  const endDate = toNullableDate(payload.endDate);
  const capacity = toPositiveInt(payload.capacity, null);
  const basePrice = payload.basePrice !== undefined ? Number(payload.basePrice) : null;
  const publishedAt = status === "PUBLISHED" ? new Date() : null;
  const code = toSafeString(payload.tourCode) || generateCode(type === "GROUP" ? "GT" : "CT");
  const [result] = await pool.query(
    `INSERT INTO tours (
      tourCode,
      tourName,
      tourType,
      status,
      startDate,
      endDate,
      basePrice,
      capacity,
      publishedAt
    ) VALUES (?,?,?,?,?,?,?,?,?)`,
    [code, name, type, status, startDate, endDate, basePrice, capacity, publishedAt]
  );
  return getTourById(result.insertId);
};

const listTours = async (filters = {}) => {
  const conditions = [];
  const values = [];
  if (filters.tourType) {
    conditions.push("tourType = ?");
    values.push(normalizeEnum(filters.tourType, TOUR_TYPES, "GROUP"));
  }
  if (filters.status) {
    conditions.push("status = ?");
    values.push(normalizeEnum(filters.status, TOUR_STATUSES, "PUBLISHED"));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(`SELECT * FROM tours ${where} ORDER BY createdAt DESC`, values);
  return rows;
};

const getEnquiryById = async (enquiryId) => {
  const [[row]] = await pool.query(
    `SELECT e.*, t.tourName, t.tourType, t.tourCode
       FROM enquiries e
       LEFT JOIN tours t ON t.tourId = e.tourId
      WHERE e.enquiryId = ?
      LIMIT 1`,
    [enquiryId]
  );
  return row || null;
};

const createEnquiry = async (payload = {}) => {
  const customerName = toSafeString(payload.customerName);
  if (!customerName) {
    const error = new Error("customerName is required");
    error.status = 400;
    throw error;
  }
  const tourId = toPositiveInt(payload.tourId, null);
  let resolvedTour = null;
  if (tourId) {
    resolvedTour = await getTourById(tourId);
    if (!resolvedTour) {
      const error = new Error("tour not found");
      error.status = 404;
      throw error;
    }
  }
  const enquiryType = tourId ? resolvedTour.tourType : normalizeEnum(payload.enquiryType, TOUR_TYPES, "CUSTOM");
  const contact = toSafeString(payload.contact);
  const email = toSafeString(payload.email);
  const noOfGuests = toPositiveInt(payload.noOfGuests, null);
  const travelDate = toNullableDate(payload.travelDate);
  const assignedUserId = toPositiveInt(payload.assignedUserId, null);
  const sourcePage = toSafeString(payload.sourcePage) || "Website";
  const status = normalizeEnum(payload.status, ENQUIRY_STATUSES, "NEW");
  const stage = mapEnquiryStage(status);
  const notes = toSafeString(payload.notes);
  const code = toSafeString(payload.enquiryCode) || generateCode("ENQ");
  const [result] = await pool.query(
    `INSERT INTO enquiries (
      enquiryCode,
      tourId,
      enquiryType,
      customerName,
      contact,
      email,
      noOfGuests,
      travelDate,
      status,
      workflowStage,
      assignedUserId,
      sourcePage,
      notes
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      code,
      tourId,
      enquiryType,
      customerName,
      contact,
      email,
      noOfGuests,
      travelDate,
      status,
      stage,
      assignedUserId,
      sourcePage,
      notes,
    ]
  );
  return getEnquiryById(result.insertId);
};

const listEnquiries = async (filters = {}) => {
  const conditions = [];
  const values = [];
  if (filters.status) {
    conditions.push("e.status = ?");
    values.push(normalizeEnum(filters.status, ENQUIRY_STATUSES, "NEW"));
  }
  if (filters.workflowStage) {
    conditions.push("e.workflowStage = ?");
    values.push(toSafeString(filters.workflowStage).toUpperCase());
  }
  if (filters.tourId) {
    conditions.push("e.tourId = ?");
    values.push(toPositiveInt(filters.tourId));
  }
  if (filters.enquiryType) {
    conditions.push("e.enquiryType = ?");
    values.push(normalizeEnum(filters.enquiryType, TOUR_TYPES, "GROUP"));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT e.*, t.tourName, t.tourCode
       FROM enquiries e
       LEFT JOIN tours t ON t.tourId = e.tourId
      ${where}
      ORDER BY e.createdAt DESC`,
    values
  );
  return rows;
};

const updateEnquiryStatus = async ({ enquiryId, status, remarks, nextActionDate, actionBy }) => {
  const id = toPositiveInt(enquiryId, null);
  if (!id) {
    const error = new Error("enquiryId is required");
    error.status = 400;
    throw error;
  }
  const normalizedStatus = normalizeEnum(status, ENQUIRY_STATUSES, null);
  if (!normalizedStatus) {
    const error = new Error("invalid status");
    error.status = 400;
    throw error;
  }
  const enquiry = await getEnquiryById(id);
  if (!enquiry) {
    const error = new Error("enquiry not found");
    error.status = 404;
    throw error;
  }
  const stage = mapEnquiryStage(normalizedStatus);
  const nextFollowUpAt = toNullableDate(nextActionDate);
  await pool.query(
    `UPDATE enquiries
        SET status = ?,
            workflowStage = ?,
            lastFollowUpAt = NOW(),
            nextFollowUpAt = ?,
            updatedAt = NOW()
      WHERE enquiryId = ?`,
    [normalizedStatus, stage, nextFollowUpAt, id]
  );
  await pool.query(
    `INSERT INTO enquiry_followups (
      enquiryId,
      previousStatus,
      newStatus,
      remarks,
      nextActionDate,
      actionBy
    ) VALUES (?,?,?,?,?,?)`,
    [id, enquiry.status, normalizedStatus, toSafeString(remarks), nextFollowUpAt, toPositiveInt(actionBy, null)]
  );
  return getEnquiryById(id);
};

const getBookingById = async (bookingId) => {
  const [[row]] = await pool.query(
    `SELECT b.*, e.enquiryCode, e.customerName, t.tourName
       FROM bookings b
       LEFT JOIN enquiries e ON e.enquiryId = b.enquiryId
       LEFT JOIN tours t ON t.tourId = b.tourId
      WHERE b.bookingId = ?
      LIMIT 1`,
    [bookingId]
  );
  return row || null;
};

const createBookingFromEnquiry = async (payload = {}) => {
  const enquiryId = toPositiveInt(payload.enquiryId, null);
  if (!enquiryId) {
    const error = new Error("enquiryId is required");
    error.status = 400;
    throw error;
  }
  const enquiry = await getEnquiryById(enquiryId);
  if (!enquiry) {
    const error = new Error("enquiry not found");
    error.status = 404;
    throw error;
  }
  if (enquiry.status !== "CONFIRMED") {
    const error = new Error("enquiry must be confirmed");
    error.status = 400;
    throw error;
  }
  const bookingCode = toSafeString(payload.bookingCode) || generateCode("BKG");
  const bookingDate = toNullableDate(payload.bookingDate) || toNullableDate(new Date());
  const totalAmount = payload.totalAmount !== undefined ? Number(payload.totalAmount) : null;
  const amountPaid = payload.amountPaid !== undefined ? Number(payload.amountPaid) : null;
  const status = normalizeEnum(payload.status, BOOKING_STATUSES, "PENDING");
  const notes = toSafeString(payload.notes);
  const [result] = await pool.query(
    `INSERT INTO bookings (
      bookingCode,
      enquiryId,
      tourId,
      bookingDate,
      totalAmount,
      amountPaid,
      status,
      notes
    ) VALUES (?,?,?,?,?,?,?,?)`,
    [bookingCode, enquiryId, enquiry.tourId, bookingDate, totalAmount, amountPaid, status, notes]
  );
  await pool.query(
    `UPDATE enquiries SET workflowStage = 'BOOKED' WHERE enquiryId = ?`,
    [enquiryId]
  );
  return getBookingById(result.insertId);
};

const listBookings = async (filters = {}) => {
  const conditions = [];
  const values = [];
  if (filters.status) {
    conditions.push("b.status = ?");
    values.push(normalizeEnum(filters.status, BOOKING_STATUSES, "PENDING"));
  }
  if (filters.tourId) {
    conditions.push("b.tourId = ?");
    values.push(toPositiveInt(filters.tourId));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT b.*, e.enquiryCode, e.customerName, t.tourName
       FROM bookings b
       LEFT JOIN enquiries e ON e.enquiryId = b.enquiryId
       LEFT JOIN tours t ON t.tourId = b.tourId
      ${where}
      ORDER BY b.createdAt DESC`,
    values
  );
  return rows;
};

module.exports = {
  createTour,
  listTours,
  createEnquiry,
  listEnquiries,
  updateEnquiryStatus,
  createBookingFromEnquiry,
  listBookings,
};
