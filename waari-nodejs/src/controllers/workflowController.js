const workflowService = require("../services/workflowService");

const createTour = async (req, res, next) => {
  try {
    const tour = await workflowService.createTour(req.body || {});
    res.status(201).json({ data: tour, message: "Tour saved" });
  } catch (error) {
    next(error);
  }
};

const listTours = async (req, res, next) => {
  try {
    const tours = await workflowService.listTours(req.query || {});
    res.json({ data: tours });
  } catch (error) {
    next(error);
  }
};

const createEnquiry = async (req, res, next) => {
  try {
    const enquiry = await workflowService.createEnquiry(req.body || {});
    res.status(201).json({ data: enquiry, message: "Enquiry captured" });
  } catch (error) {
    next(error);
  }
};

const listEnquiries = async (req, res, next) => {
  try {
    const enquiries = await workflowService.listEnquiries(req.query || {});
    res.json({ data: enquiries });
  } catch (error) {
    next(error);
  }
};

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const enquiryId = req.params.enquiryId || req.body.enquiryId;
    const payload = { ...req.body, enquiryId };
    const enquiry = await workflowService.updateEnquiryStatus(payload);
    res.json({ data: enquiry, message: "Enquiry updated" });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const booking = await workflowService.createBookingFromEnquiry(req.body || {});
    res.status(201).json({ data: booking, message: "Booking created" });
  } catch (error) {
    next(error);
  }
};

const listBookings = async (req, res, next) => {
  try {
    const bookings = await workflowService.listBookings(req.query || {});
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTour,
  listTours,
  createEnquiry,
  listEnquiries,
  updateEnquiryStatus,
  createBooking,
  listBookings,
};
