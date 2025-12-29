const { Router } = require("express");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const teamRoutes = require("./teamRoutes");
const lookupRoutes = require("./lookupRoutes");
const uploadRoutes = require("./uploadRoutes");

const router = Router();

router.use(userRoutes);
router.use(roleRoutes);
router.use(lookupRoutes);
router.use(uploadRoutes);
router.use("/role", roleRoutes);
router.use("/teams", teamRoutes);

module.exports = router;
