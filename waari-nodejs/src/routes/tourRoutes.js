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
router.post("/add-group-tour-info", tourController.addGroupTourInfo);
router.post("/add-skeleton-details", tourController.addSkeletonDetails);
router.post("/add-group-tour-price", tourController.addGroupTourPrice);
router.post("/add-travel-details", tourController.addTravelDetails);
router.post("/add-detail-itinerary", tourController.addDetailItinerary);
router.get("/group-tour-dropdown", tourController.listGroupTourDropdown);
router.get("/priority-list", tourController.listPriorityList);
router.get("/enqGroup-details", tourController.getGroupEnquiryDetails);
router.get("/family-head-data", tourController.listFamilyHeadData);
router.get("/view-payment-bill-gt", tourController.getGroupPaymentBill);
router.get("/group-tour-completion-status", tourController.getGroupTourCompletionStatus);
router.get("/total-call-count-gt", tourController.getGroupTotalCallCount);
router.get("/dropdown-call-status", tourController.listCallStatusDropdown);
router.get("/call-follow-history-gt", tourController.listCallFollowHistory);
router.get("/confirm-group-tour-list", tourController.listConfirmGroupTours);
router.get("/all-confirm-group-tour-list", tourController.listAllConfirmGroupTours);
router.get("/confirm-custom-list", tourController.listConfirmCustomTours);
router.get("/all-confirm-custom-list", tourController.listAllConfirmCustomTours);
router.get("/guest-detail-gt-list", tourController.listGroupGuestDetails);
router.get("/all-guest-detail-gt-list", tourController.listAllGroupGuestDetails);
router.get("/guest-detail-ct-list", tourController.listCustomGuestDetails);
router.get("/all-guest-detail-ct-list", tourController.listAllCustomGuestDetails);
router.get("/dd-prefix", tourController.listPrefixDropdown);
router.get("/dropdown-guest-refId", tourController.listGuestReferenceDropdown);
router.get("/enquiry-reference-list", tourController.listEnquiryReferenceDropdown);
router.get("/list-group-tour", tourController.listMyGroupFollowUps);
router.get("/expired-list-group-tour", tourController.listMyExpiredGroupFollowUps);
router.get("/upcoming-list-group-tour", tourController.listMyUpcomingGroupFollowUps);
router.get("/all-enquiry-today-list-gt", tourController.listAllGroupTodayFollowUps);
router.get("/all-enquiry-expired-list-gt", tourController.listAllGroupExpiredFollowUps);
router.get("/all-enquiry-upcoming-list-gt", tourController.listAllGroupUpcomingFollowUps);
router.get("/billing/enquiry-follow-custom", tourController.listMyCustomFollowUps);
router.get("/expired-enquiry-follow-CT", tourController.listMyExpiredCustomFollowUps);
router.get("/upcoming-enquiry-follow-CT", tourController.listMyUpcomingCustomFollowUps);
router.get("/assigned-custom-tour-list", tourController.listAssignedCustomTodayFollowUps);
router.get("/assigned-expired-custom-tour-list", tourController.listAssignedCustomExpiredFollowUps);
router.get("/assigned-upcoming-custom-tour-list", tourController.listAssignedCustomUpcomingFollowUps);
router.get("/assigned-all-custom-tour-list", tourController.listAssignedAllCustomTodayFollowUps);
router.get("/assigned-all-expired-custom-tour-list", tourController.listAssignedAllCustomExpiredFollowUps);
router.get("/assigned-all-upcoming-custom-tour-list", tourController.listAssignedAllCustomUpcomingFollowUps);
router.get("/all-enq-today-ct", tourController.listAllCustomTodayFollowUps);
router.get("/all-enq-expired-ct", tourController.listAllCustomExpiredFollowUps);
router.get("/all-enq-upcoming-ct", tourController.listAllCustomUpcomingFollowUps);
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
router.get("/enquiry-ct", tourController.getCustomizedEnquiryDetails);
router.get("/get-enquiry-ct", tourController.getCustomizedEnquiryDetails);
router.get("/package-list", tourController.listCustomizedPackages);
router.get("/guests-group-tour", tourController.listGroupTourGuests);
router.get("/view-details-group-tour", tourController.getGroupTourViewDetails);
router.get("/view-details-tailor-made", tourController.getTailorMadeTourViewDetails);
router.get("/get-edit-tailor-made", tourController.getTailorMadeTourDetails);
router.post("/update-tailor-made-list", tourController.updateTailorMadeTour);
router.get("/edit-data-gt", tourController.getGroupTourDetails);

module.exports = router;
