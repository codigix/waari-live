const { Router } = require("express");
const lookupController = require("../controllers/lookupController");

const router = Router();

router.get("/dropdown-roles", lookupController.getRoles);
router.get("/dropdown-positions", lookupController.getPositions);
router.get("/dropdown-department", lookupController.getDepartments);
router.get("/dropdown-sector", lookupController.getSectors);
router.get("/dropdown-establishment-type", lookupController.getEstablishmentTypes);

module.exports = router;
