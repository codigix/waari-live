const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/Admin/roleController");

// route to list roles
router.get("/lists-user", RoleController.listsRole);
router.get("/dropdown-department", RoleController.dropdownDepartment);
router.get("/dropdown-positions", RoleController.dropdownPositions);
router.get("/dropdown-roles", RoleController.dropdownRoles);
router.get("/view-users-data/:id", RoleController.viewUsersData);
// router.get(
//   "/enquiry-follow-custom",
//   RoleController.enquiryFollowCustomTourList
// );
router.get("/expired-enquiry-follow-CT", RoleController.expiredenquiryFollowCT);
router.get(
  "/upcoming-enquiry-follow-CT",
  RoleController.upcomingenquiryFollowCT
);
router.get("/dropdown-sector", RoleController.dropdownSector);
router.get("/dropdown-hotel-cat", RoleController.ddHotelCat);
router.get("/state-list", RoleController.stateListWeb);
router.get("/country", RoleController.country);
router.get("/all-enquiry-today-list-gt", RoleController.allEnquiryTodayListGt);
router.get(
  "/all-enquiry-expired-list-gt",
  RoleController.allEnquiryExpiredListGt
);
router.get(
  "/all-enquiry-upcoming-list-gt",
  RoleController.allEnquiryUpcomingListGt
);
router.get("/all-enq-today-ct", RoleController.allEnqTodayCt);
router.get("/all-enq-expired-ct", RoleController.allEnqExpiredCt);
router.get("/all-enq-upcoming-ct", RoleController.allEnqUpcomingCt);
router.get(
  "/assigned-all-custom-tour-list",
  RoleController.assignedCustomTourList
);
//router.get("/assigned-all-expired-custom-tour-list", RoleController.assignedExpiredCustomTourList);
router.get(
  "/assigned-all-upcoming-custom-tour-list",
  RoleController.assignedUpcomingCustomTourList
);

//******************************************* */
router.get("/assigned-custom-tour-list", RoleController.assignedCustomTourList);
// Assigned Expired Custom Tour List
router.get(
  "/assigned-expired-custom-tour-list",
  RoleController.assignedExpiredCustomTourList
);
// Assigned Upcoming Custom Tour List
router.get(
  "/assigned-upcoming-custom-tour-list",
  RoleController.assignedUpcomingCustomTourList
);
// router.get("/assigned-upcoming-custom-tour-list", RoleController.assignedUpcomingCustomTour);
router.get(
  "/assigned-all-expired-custom-tour-list",
  RoleController.assignedAllExpiredCustomTourList
);

//******************************************* */
router.get("/contact-us-list", RoleController.contactUsList);
router.get("/get-home-page-journey", RoleController.getHomePageJourney);
router.get("/group-tour-list-dropdown", RoleController.groupTourListDropdown);
// Correct: POST route
router.post("/add-home-page-journey", RoleController.addHomePageJourney);
router.get(
  "/topfivegroupjourney-list",
  RoleController.topFiveGroupJourneysList
);
router.get("/review-list", RoleController.reviewList);
router.get("/list-office-details", RoleController.listOfficeDetails);
router.get("/edit-office-details", RoleController.editOfficeDetails);
// POST route for updating office details
router.post("/update-office-details", RoleController.updateOfficeDetails);

router.get("/feedbacks-list", RoleController.feedbackList);
// ✅ Coupons list (GET request)
router.get("/coupons-list", RoleController.couponsList);
// ✅ Dropdown continents (GET)
router.get("/dropdown-continents", RoleController.dropdownContinents);
// ✅ All Country List
router.get("/all-country-list", RoleController.allCountryList);
// ✅ State list route
router.get("/all-state-list", RoleController.allStateList);
router.get("/all-city-list", RoleController.allCityList);
router.post("/edit-city", RoleController.editCity);
// Sectors list route
router.post("/update-sectors", RoleController.updateSector);
router.get("/sectors-list", RoleController.sectorsList);
router.get("/delete-country", RoleController.deleteCountry);
router.post("/edit-country", RoleController.editCountry);
router.post("/edit-state", RoleController.editState);
router.get("/delete-city", RoleController.deleteCity);
router.post("/add-sectors", RoleController.addSector);
router.get("/delete-state", RoleController.deleteState);
router.get("/delete-sector", RoleController.deleteSector);
// Sales listing route
router.get("/sales-listing", RoleController.salesListing);
// Sales target POST route
router.post("/sales-target", RoleController.salesTarget);
// View sales target route
router.get("/view-sales-target", RoleController.viewSalesTarget);

router.get("/list-roles", RoleController.listRoles);
// Categories
router.get("/get-cats", RoleController.getCategories);
// Lists under category
router.get("/get-lists", RoleController.getListsByCatId);
//Add Role API
router.post("/add-roles", RoleController.addRoles);
// GET role data by roleId
router.get("/get-role-data", RoleController.getRoleData);
router.post("/update-role-data", RoleController.updateRoleData);
// Influencer & Affiliate routes
router.get(
  "/list-influencer-affiliate",
  RoleController.listInfluencerAffiliate
);
// GET - view influencer affiliate by ID
router.get(
  "/view-influencer-affiliate",
  RoleController.viewInfluencerAffiliate
);
// Update influencer
router.post(
  "/update-info-influencer-affiliate",
  RoleController.updateInfoInfluencerAffiliate
);

// GET Commission Report
router.get("/get-commission-report", RoleController.getCommissionReport);
// ✅ Commission Report API
router.get("/waari-select-report", RoleController.waariSelectReport);
module.exports = router;
