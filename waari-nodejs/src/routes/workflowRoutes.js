const { Router } = require("express");
const workflowController = require("../controllers/workflowController");

const router = Router();

router.post("/workflow/tours", workflowController.createTour);
router.get("/workflow/tours", workflowController.listTours);
router.post("/workflow/enquiries", workflowController.createEnquiry);
router.get("/workflow/enquiries", workflowController.listEnquiries);
router.post("/workflow/enquiries/:enquiryId/status", workflowController.updateEnquiryStatus);
router.post("/workflow/bookings", workflowController.createBooking);
router.get("/workflow/bookings", workflowController.listBookings);

module.exports = router;
