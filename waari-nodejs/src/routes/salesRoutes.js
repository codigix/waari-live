const { Router } = require("express");
const salesController = require("../controllers/salesController");

const router = Router();

router.get("/sales-listing", salesController.listSalesListing);
router.post("/sales-target", salesController.saveSalesTarget);
router.get("/view-sales-target", salesController.viewSalesTarget);

module.exports = router;
