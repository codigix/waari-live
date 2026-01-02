const { Router } = require("express");
const couponController = require("../controllers/couponController");

const router = Router();

router.get("/coupons-list", couponController.listCoupons);
router.post("/add-coupons", couponController.addCoupon);
router.post("/update-status-coupon", couponController.updateCouponStatus);

module.exports = router;
