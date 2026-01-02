const couponService = require("../services/couponService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const listCoupons = (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const result = couponService.listCoupons({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addCoupon = (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.couponName) {
      return res.status(400).json({ message: "couponName is required" });
    }
    if (!payload.fromDate) {
      return res.status(400).json({ message: "fromDate is required" });
    }
    if (!payload.toDate) {
      return res.status(400).json({ message: "toDate is required" });
    }
    const discountValue = Number(payload.discountValue);
    if (Number.isNaN(discountValue)) {
      return res.status(400).json({ message: "discountValue must be numeric" });
    }
    const result = couponService.addCoupon(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateCouponStatus = (req, res, next) => {
  try {
    const payload = req.body || {};
    const couponId = toPositiveInt(payload.couponId, null);
    if (!couponId) {
      return res.status(400).json({ message: "couponId is required" });
    }
    const status = Number(payload.status) === 1 ? 1 : 0;
    const updated = couponService.updateCouponStatus({ couponId, status });
    if (!updated) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon status updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCoupons,
  addCoupon,
  updateCouponStatus,
};
