const { Router } = require("express");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const teamRoutes = require("./teamRoutes");
const lookupRoutes = require("./lookupRoutes");
const uploadRoutes = require("./uploadRoutes");
const influencerAffiliateRoutes = require("./influencerAffiliateRoutes");
const salesRoutes = require("./salesRoutes");
const geoRoutes = require("./geoRoutes");
const tourRoutes = require("./tourRoutes");

const router = Router();

router.use(userRoutes);
router.use(roleRoutes);
router.use(lookupRoutes);
router.use(uploadRoutes);
router.use(influencerAffiliateRoutes);
router.use(salesRoutes);
router.use(geoRoutes);
router.use(tourRoutes);
router.use("/role", roleRoutes);
router.use("/teams", teamRoutes);

module.exports = router;
