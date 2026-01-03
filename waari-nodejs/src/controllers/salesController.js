const salesService = require("../services/salesService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const listSalesListing = async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const guestName = typeof req.query.guestName === "string" ? req.query.guestName.trim() : "";

    const result = await salesService.listSalesGuests({ page, perPage, guestName });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const saveSalesTarget = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const userId = toPositiveInt(payload.userId, null);
    const yearId = toPositiveInt(payload.yearId, null);
    const tourType = toPositiveInt(payload.tourType, null);
    const targetArray = Array.isArray(payload.targetArray) ? payload.targetArray : [];

    if (!userId || !yearId || !tourType) {
      return res.status(400).json({ message: "userId, yearId, and tourType are required" });
    }

    if (!targetArray.length) {
      return res.status(400).json({ message: "targetArray is required" });
    }

    await salesService.saveSalesTargets({ userId, yearId, tourType, targetArray });
    res.json({ message: "Sales target saved successfully" });
  } catch (error) {
    next(error);
  }
};

const viewSalesTarget = async (req, res, next) => {
  try {
    const userId = toPositiveInt(req.query.userId, null);
    const yearId = toPositiveInt(req.query.yearId, null);

    if (!userId || !yearId) {
      return res.status(400).json({ message: "userId and yearId are required" });
    }

    const data = await salesService.getSalesTargets({ userId, yearId });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSalesListing,
  saveSalesTarget,
  viewSalesTarget,
};
