const path = require("path");
const { uploadsDir } = require("../../config/storage");
const tourService = require("../services/tourService");

const buildFileUrl = (req, file) => {
  if (!file) {
    return "";
  }
  const relative = path.relative(uploadsDir, file.path).split(path.sep).join("/");
  return `${req.protocol}://${req.get("host")}/uploads/${relative}`;
};

const extractBasicFilters = (query = {}) => ({
  tourName: query.tourName || "",
  tourType: query.tourType || "",
  travelMonth: query.travelMonth || "",
  totalDuration: query.totalDuration || "",
  travelStartDate: query.travelStartDate || "",
  travelEndDate: query.travelEndDate || "",
  departureType: query.departureType || "",
  cityId: query.cityId || "",
  tailorMadeId: query.tailorMadeId || "",
});

const extractCustomFilters = (query = {}) => ({
  groupName: query.groupName || "",
  travelMonth: query.travelMonth || "",
  duration: query.duration || "",
  startDate: query.startDate || "",
  endDate: query.endDate || "",
  cityId: query.cityId || "",
});

const listGroupTours = (req, res, next) => {
  try {
    const page = tourService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = tourService.toPositiveInt(req.query.perPage, 10) || 10;
    const response = tourService.listGroupTours({
      page,
      perPage,
      status: "PUBLISHED",
      category: "GROUP",
      filters: extractBasicFilters(req.query),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listDraftGroupTours = (req, res, next) => {
  try {
    const page = tourService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = tourService.toPositiveInt(req.query.perPage, 10) || 10;
    const response = tourService.listGroupTours({
      page,
      perPage,
      status: "DRAFT",
      category: "GROUP",
      filters: extractBasicFilters(req.query),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listTailorMadeTours = (req, res, next) => {
  try {
    const page = tourService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = tourService.toPositiveInt(req.query.perPage, 10) || 10;
    const response = tourService.listTailorMadeTours({
      page,
      perPage,
      filters: extractBasicFilters(req.query),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomTours = (req, res, next) => {
  try {
    const page = tourService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = tourService.toPositiveInt(req.query.perPage, 10) || 10;
    const response = tourService.listCustomTours({
      page,
      perPage,
      category: "CUSTOMIZED",
      filters: extractCustomFilters(req.query),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listTourTypes = (req, res, next) => {
  try {
    const data = tourService.listTourTypes();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCities = (req, res, next) => {
  try {
    const data = tourService.listCities();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listDestinations = (req, res, next) => {
  try {
    const data = tourService.listDestinations();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listVehicles = (req, res, next) => {
  try {
    const data = tourService.listVehicles();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listMealPlans = (req, res, next) => {
  try {
    const data = tourService.listMealPlans();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listMealTypes = (req, res, next) => {
  try {
    const data = tourService.listMealTypes();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listKitchens = (req, res, next) => {
  try {
    const data = tourService.listKitchens();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listDepartureTypes = (req, res, next) => {
  try {
    const data = tourService.listDepartureTypes({ destinationId: req.query.destinationId });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCountries = (req, res, next) => {
  try {
    const data = tourService.listCountries({ destinationId: req.query.destinationId });
    res.json({ data, message: data });
  } catch (error) {
    next(error);
  }
};

const createGroupTour = (req, res, next) => {
  try {
    const files = req.files || {};
    const data = tourService.createGroupTour({
      ...req.body,
      cityIds: req.body.cityId,
      bgImageUrl: buildFileUrl(req, files.bgImage ? files.bgImage[0] : null),
      websiteBannerUrl: buildFileUrl(req, files.websiteBanner ? files.websiteBanner[0] : null),
    });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const getGroupTourDetails = (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const data = tourService.getGroupTourById(groupTourId);
    if (!data) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listGroupTours,
  listDraftGroupTours,
  listTailorMadeTours,
  listCustomTours,
  listTourTypes,
  listCities,
  listDestinations,
  listVehicles,
  listMealPlans,
  listMealTypes,
  listKitchens,
  listDepartureTypes,
  listCountries,
  createGroupTour,
  getGroupTourDetails,
};
