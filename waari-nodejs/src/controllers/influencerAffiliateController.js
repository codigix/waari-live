const influencerAffiliateService = require("../services/influencerAffiliateService");

const toPositiveInt = (value, fallback = null) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const findMissing = (payload, fields) =>
  fields.filter((field) =>
    typeof payload[field] === "undefined" || payload[field] === null || payload[field] === ""
  );

const listInfluencerAffiliates = async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const result = await influencerAffiliateService.listInfluencerAffiliates({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addInfluencerAffiliate = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const required = [
      "firstName",
      "lastName",
      "address",
      "email",
      "phoneNo",
      "role",
      "password",
      "commissionType",
      "commissionValue",
      "accName",
      "accNo",
      "bankName",
      "branch",
      "ifsc",
      "couponName",
      "fromDate",
      "toDate",
      "discountType",
      "discountValue",
    ];

    const missing = findMissing(payload, required);
    if (missing.length) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    }

    const { id } = await influencerAffiliateService.createInfluencerAffiliate(payload);
    res.status(201).json({ message: "Influencer/Affiliate added successfully", id });
  } catch (error) {
    next(error);
  }
};

const viewInfluencerAffiliate = async (req, res, next) => {
  try {
    const id = toPositiveInt(req.query.id, null);
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const data = await influencerAffiliateService.getInfluencerAffiliateById(id);
    if (!data) {
      return res.status(404).json({ message: "Influencer/Affiliate not found" });
    }

    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const updateInfluencerAffiliate = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const id = toPositiveInt(payload.id, null);
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const required = [
      "firstName",
      "lastName",
      "address",
      "email",
      "phoneNo",
      "role",
      "commissionType",
      "commissionValue",
      "accName",
      "accNo",
      "bankName",
      "branch",
      "ifsc",
      "couponName",
      "fromDate",
      "toDate",
      "discountType",
      "discountValue",
    ];

    const missing = findMissing(payload, required);
    if (missing.length) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    }

    const data = await influencerAffiliateService.updateInfluencerAffiliate(payload);
    res.json({ message: "Influencer/Affiliate updated successfully", data });
  } catch (error) {
    next(error);
  }
};

const deleteInfluencerAffiliate = async (req, res, next) => {
  try {
    const id = toPositiveInt(req.query.id, null);
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const deleted = await influencerAffiliateService.deleteInfluencerAffiliate(id);
    if (!deleted) {
      return res.status(404).json({ message: "Influencer/Affiliate not found" });
    }

    res.json({ message: "Influencer/Affiliate deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listInfluencerAffiliates,
  addInfluencerAffiliate,
  viewInfluencerAffiliate,
  updateInfluencerAffiliate,
  deleteInfluencerAffiliate,
};
