const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminController");
const upload = require("../middleware/uploads");
router.post("/admin-login", adminController.adminLogin);
router.post("/add-office-details", ...adminController.addOfficeDetails);
router.post("/delete-office-details", ...adminController.deleteOfficeDetails);
router.post("/edit-office-details", ...adminController.editOfficeDetails);
router.post("/update-office-details", ...adminController.updateOfficeDetails);
router.get("/dashboard", ...adminController.adminDashboard);
router.post(
  "/add-country",
  upload.single("image"), // middleware to handle image upload
  adminController.addCountry
);
// Upload multiple images
router.post("/image-upload", upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Map uploaded files to URLs
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    return res.status(200).json({ image_urls: imageUrls }); // returns array
  } catch (err) {
    console.error("Error uploading images:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
});

// Add state

// ----- State -----
router.post("/add-state", upload.single("image"), adminController.addState);

// ----- City -----
router.post("/add-city", upload.single("image"), adminController.addCity);

// Upload image for state
router.get(
  "/continent-country-state-list",
  adminController.getContinentCountryStateList
);
router.get("/continent-country-list", adminController.continentCountryList);
router.post("/add-sector", ...adminController.addSectors);
router.post("/add-tour-type", ...adminController.addTourType);
router.post("/get-edit-tour-type", ...adminController.getEditTourType);
router.post("/edit-tour-type", ...adminController.editTourType);
router.post("/delete-tour-type", ...adminController.deleteTourType);

///////////////////////////////////////////////////////
router.get("/plan-enq-users-list-gt", adminController.planEnqUsersListGt);

router.get("/plan-enq-users-list-ct", adminController.planEnqUsersListCt);

// ✅ Get assign-to users list
router.get("/get-assign-to-users-list", adminController.getAssignToUsersList);

// ✅ View plan enquiry (Group Tour)
router.get(
  "/view-plan-enq-users-data-gt",
  adminController.viewPlanEnqUsersDataGt
);

module.exports = router;
