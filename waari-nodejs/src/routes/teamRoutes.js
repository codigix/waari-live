const { Router } = require("express");
const teamController = require("../controllers/teamController");

const router = Router();

router.get("/lead-sales", teamController.listLeadSales);

module.exports = router;
