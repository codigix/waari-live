// routes/coupon.js
const express = require("express");
const router = express.Router();

// Import coupon controller
const couponController = require("../controllers/Admin/couponController");

// Public routes
router.post("/coupon-data", couponController.couponData);
router.post("/active-coupon-list", couponController.activeCouponList);

// Protected routes
router.post("/add-coupon", couponController.addCoupon);
router.post("/coupons-list", couponController.couponsList);
router.post("/edit-coupon", couponController.editCouponInfo);
router.post("/update-status", couponController.updateStatusCoupon);

router.post(
  "/users-list-group-tour",
  // couponController.verifyToken([86]),
  couponController.couponUsersListGroupTour
);

router.post(
  "/users-list-custom-tour",
  // couponController.verifyToken([87]),
  couponController.couponUsersListCustomTour
);

module.exports = router;
