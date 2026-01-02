const { Router } = require("express");
const teamController = require("../controllers/teamController");

const router = Router();

router.get("/lead-sales", teamController.listLeadSales);
router.get("/sales-team-lead-listing", teamController.listSalesTeamLeadListing);
router.get("/sales-list-team-lead", teamController.listSalesTeamLeadMembers);

module.exports = router;
