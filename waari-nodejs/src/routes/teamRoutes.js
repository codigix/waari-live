const { Router } = require("express");
const teamController = require("../controllers/teamController");

const router = Router();

router.get("/lead-sales", teamController.listLeadSales);
router.get("/sales-team-lead-listing", teamController.listSalesTeamLeadListing);
router.get("/sales-list-team-lead", teamController.listSalesTeamLeadMembers);
router.get("/dd-all-users", teamController.listAllUsersDropdown);
router.get("/sales-under-team-lead", teamController.listSalesUnderTeamLead);
router.get("/view-lead-data", teamController.viewLeadData);
router.post("/add-team-lead", teamController.addTeamLead);
router.post("/update-lead-data", teamController.updateTeamLead);
router.get("/enq-list-gt-sales", teamController.listGroupSalesEnquiries);
router.get("/enq-list-ct-sales", teamController.listCustomSalesEnquiries);
router.get("/sales-stage-two-workflow", teamController.getSalesStageTwoWorkflow);
router.post("/assign-to-gt", teamController.assignGroupEnquiry);
router.post("/assign-to-ct", teamController.assignCustomEnquiry);

module.exports = router;
