const { Router } = require("express");
const tourController = require("../controllers/tourController");
const uploadMiddleware = require("../middleware/upload");

const router = Router();

router.post(
  "/add-tour-details",
  uploadMiddleware.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "websiteBanner", maxCount: 1 },
  ]),
  tourController.createGroupTour
);
router.get("/view-group-tour", tourController.listGroupTours);
router.get("/view-draft-group-tour", tourController.listDraftGroupTours);
router.get("/view-tailor-made", tourController.listTailorMadeTours);
router.get("/view-custom-tour", tourController.listCustomTours);
router.get("/tour-type-list", tourController.listTourTypes);
router.get("/city-list", tourController.listCities);
router.get("/destination-list", tourController.listDestinations);
router.get("/vehicle-listing", tourController.listVehicles);
router.get("/meal-plan-list", tourController.listMealPlans);
router.get("/meal-type-list", tourController.listMealTypes);
router.get("/kitchen-list", tourController.listKitchens);
router.get("/departure-type-list", tourController.listDepartureTypes);
router.get("/country", tourController.listCountries);
router.get("/edit-data-gt", tourController.getGroupTourDetails);

module.exports = router;
