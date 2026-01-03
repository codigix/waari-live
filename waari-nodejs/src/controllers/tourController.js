const path = require("path");
const { uploadsDir } = require("../../config/storage");
const tourService = require("../services/tourService");
const customEnquiryService = require("../services/customEnquiryService");

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

const extractFollowUpFilters = (query = {}) => ({
  search: query.search || "",
  tourName: query.tourName || "",
  groupName: query.groupName || "",
  guestName: query.guestName || "",
  startDate: query.startDate || "",
  endDate: query.endDate || "",
});

const extractConfirmFilters = (query = {}) => ({
  guestName: query.guestName || "",
  tourName: query.tourName || "",
  startDate: query.startDate || "",
  endDate: query.endDate || "",
});

const extractGuestFilters = (query = {}) => ({
  guestId: query.guestId || "",
});

const extractFutureFilters = (query = {}) => ({
  name: query.name || "",
  email: query.email || "",
  phoneNo: query.phoneNo || "",
});

const parseFollowUpPagination = (query = {}) => ({
  page: tourService.toPositiveInt(query.page, 1) || 1,
  perPage: tourService.toPositiveInt(query.perPage, 10) || 10,
});

const resolveCurrentUserId = (req) => {
  const candidates = [
    req.user && (req.user.userId || req.user.id),
    req.auth && (req.auth.userId || req.auth.id),
    req.query.userId,
    req.query.currentUserId,
  ];
  for (const value of candidates) {
    const parsed = tourService.toPositiveInt(value, null);
    if (parsed) {
      return parsed;
    }
  }
  return null;
};

const handleGroupFollowUps = (req, res, next, options = {}) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      timeframe: options.timeframe || "today",
      scope: options.scope || "all",
      page,
      perPage,
      filters: extractFollowUpFilters(req.query),
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listGroupFollowUps(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const handleCustomFollowUps = (req, res, next, options = {}) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      timeframe: options.timeframe || "today",
      scope: options.scope || "all",
      page,
      perPage,
      filters: extractFollowUpFilters(req.query),
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listCustomFollowUps(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listConfirmGroupTours = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractConfirmFilters(req.query),
      scope: "mine",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listConfirmGroupTours(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllConfirmGroupTours = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractConfirmFilters(req.query),
      scope: "all",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listConfirmGroupTours(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listConfirmCustomTours = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractConfirmFilters(req.query),
      scope: "mine",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listConfirmCustomTours(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllConfirmCustomTours = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractConfirmFilters(req.query),
      scope: "all",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listConfirmCustomTours(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupGuestDetails = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractGuestFilters(req.query),
      scope: "mine",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listGroupGuestDetails(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllGroupGuestDetails = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractGuestFilters(req.query),
      scope: "all",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listGroupGuestDetails(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomGuestDetails = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractGuestFilters(req.query),
      scope: "mine",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listCustomGuestDetails(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllCustomGuestDetails = (req, res, next) => {
  try {
    const { page, perPage } = parseFollowUpPagination(req.query);
    const payload = {
      page,
      perPage,
      filters: extractGuestFilters(req.query),
      scope: "all",
    };
    const currentUserId = resolveCurrentUserId(req);
    if (currentUserId) {
      payload.currentUserId = currentUserId;
    }
    const response = tourService.listCustomGuestDetails(payload);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

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

const listGroupTourDropdown = (req, res, next) => {
  try {
    const data = tourService.listGroupTourDropdown();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listPriorityList = (req, res, next) => {
  try {
    const data = tourService.listPriorityOptions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listHotelCategoryDropdown = (req, res, next) => {
  try {
    const data = tourService.listHotelCategories();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listPrefixDropdown = (req, res, next) => {
  try {
    const data = tourService.listNamePrefixes();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listGuestReferenceDropdown = (req, res, next) => {
  try {
    const data = tourService.listGuestReferenceDropdown();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const searchGuestEmails = (req, res, next) => {
  try {
    const limit = tourService.toPositiveInt(req.query.limit, 10) || 10;
    const data = tourService.searchGuestEmails({
      firstName: req.query.firstName,
      guestName: req.query.guestName,
      search: req.query.search,
      email: req.query.email,
      limit,
    });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listEnquiryReferenceDropdown = (req, res, next) => {
  try {
    const data = tourService.listEnquiryReferences();
    res.json({ data });
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

const addTourType = (req, res, next) => {
  try {
    const response = tourService.addTourType(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getTourType = (req, res, next) => {
  try {
    const response = tourService.getTourType(req.query.tourTypeId);
    if (!response.data) {
      return res.status(response.message === "tourTypeId is required" ? 400 : 404).json(response);
    }
    res.json(response);
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

const getCustomizedEnquiryDetails = (req, res, next) => {
  try {
    const enquiryCustomId = tourService.toPositiveInt(req.query.enquiryCustomId, null);
    if (!enquiryCustomId) {
      return res.status(400).json({ message: "enquiryCustomId is required" });
    }
    const data = tourService.getCustomizedEnquiryDetails(enquiryCustomId);
    if (!data) {
      return res.status(404).json({ message: "Customized enquiry not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const listCustomizedPackages = (req, res, next) => {
  try {
    const enquiryCustomId = tourService.toPositiveInt(req.query.enquiryCustomId, null);
    if (!enquiryCustomId) {
      return res.status(400).json({ message: "enquiryCustomId is required" });
    }
    const response = tourService.listCustomizedPackages(enquiryCustomId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomBillView = (req, res, next) => {
  try {
    const response = tourService.getCustomBillView({
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomNewPayments = (req, res, next) => {
  try {
    const response = tourService.listCustomNewPayments({
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomReceiptView = (req, res, next) => {
  try {
    const response = tourService.getCustomReceiptDetails({
      customPayDetailId: req.query.customPayDetailId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateCustomPaymentStatus = async (req, res, next) => {
  try {
    const payload = await tourService.updateCustomPaymentStatus({
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
      customPayDetailId: req.query.customPayDetailId,
    });
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

const getGroupEnquiryDetails = (req, res, next) => {
  try {
    const enquiryGroupId = tourService.toPositiveInt(req.query.enquiryGroupId, null);
    const response = tourService.getGroupEnquiryDetails(enquiryGroupId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupBookingRecords = (req, res, next) => {
  try {
    const response = tourService.listGroupBookingRecords({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        tourTypeId: req.query.tourTypeId,
        destinationId: req.query.destinationId,
        tourName: req.query.tourName,
        bookingDateFrom: req.query.bookingDateFrom,
        bookingDateTo: req.query.bookingDateTo,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllGroupBookingRecords = (req, res, next) => {
  try {
    const response = tourService.listAllGroupBookingRecords({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        tourTypeId: req.query.tourTypeId,
        destinationId: req.query.destinationId,
        tourName: req.query.tourName,
        bookingDateFrom: req.query.bookingDateFrom,
        bookingDateTo: req.query.bookingDateTo,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomBookingRecords = (req, res, next) => {
  try {
    const response = tourService.listCustomBookingRecords({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        groupName: req.query.groupName,
        destinationId: req.query.destinationId,
        bookingDateFrom: req.query.bookingDateFrom,
        bookingDateTo: req.query.bookingDateTo,
        travelDateFrom: req.query.travelDateFrom,
        travelDateTo: req.query.travelDateTo,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllCustomBookingRecords = (req, res, next) => {
  try {
    const response = tourService.listAllCustomBookingRecords({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        groupName: req.query.groupName,
        destinationId: req.query.destinationId,
        bookingDateFrom: req.query.bookingDateFrom,
        bookingDateTo: req.query.bookingDateTo,
        travelDateFrom: req.query.travelDateFrom,
        travelDateTo: req.query.travelDateTo,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listFamilyHeadData = (req, res, next) => {
  try {
    const response = tourService.listFamilyHeadData({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomFamilyHeadData = (req, res, next) => {
  try {
    const response = tourService.listCustomFamilyHeadData({
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const saveFamilyHeadDetails = async (req, res, next) => {
  try {
    const response = await tourService.saveFamilyHeadDetails(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getEnquiryFamilyHead = (req, res, next) => {
  try {
    const response = tourService.getFamilyHeadEnquiryDetail({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listFamilyHeadRoomShare = (req, res, next) => {
  try {
    const response = tourService.listFamilyHeadRoomShare({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomFamilyHeadRoomShare = (req, res, next) => {
  try {
    const response = tourService.listCustomFamilyHeadRoomShare({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listRoomPriceDropdown = (req, res, next) => {
  try {
    const response = tourService.listRoomPriceOptions(req.query.enquiryGroupId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listTravelModeDropdown = (req, res, next) => {
  try {
    const response = tourService.listTravelModeOptions({
      departureTypeId: req.query.departureTypeId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listVoucherTypes = (req, res, next) => {
  try {
    const response = tourService.listVoucherTypeOptions();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomVouchers = (req, res, next) => {
  try {
    const response = tourService.listCustomVouchers({
      enquiryCustomId: req.query.enquiryCustomId,
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const uploadCustomVouchers = async (req, res, next) => {
  try {
    const response = await tourService.uploadCustomVouchers(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupGuestsForCancellation = (req, res, next) => {
  try {
    const response = tourService.listGroupGuestsForCancellation({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomGuestsForCancellation = (req, res, next) => {
  try {
    const response = tourService.listCustomGuestsForCancellation({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupCancellationProcessData = (req, res, next) => {
  try {
    const response = tourService.getGroupCancellationProcessData({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomCancellationProcessData = (req, res, next) => {
  try {
    const response = tourService.getCustomCancellationProcessData({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGuestDetailsGt = (req, res, next) => {
  try {
    const response = tourService.getFamilyHeadGuestDetails({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGuestDetailsCt = (req, res, next) => {
  try {
    const response = tourService.getCustomGuestDetails({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGuestDocuments = (req, res, next) => {
  try {
    const response = tourService.listGuestDocumentRecords({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomGuestDocuments = (req, res, next) => {
  try {
    const response = tourService.listCustomGuestDocumentRecords({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listPlanEnquiryUsersGt = (req, res, next) => {
  try {
    const response = tourService.listPlanEnquiryUsersGt({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        search: req.query.search,
        tourName: req.query.tourName,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listPlanEnquiryUsersCt = (req, res, next) => {
  try {
    const response = tourService.listPlanEnquiryUsersCt({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        search: req.query.search,
        tourName: req.query.tourName,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getPlanEnquiryUsersDataGt = (req, res, next) => {
  try {
    const planEnqId = tourService.toPositiveInt(req.query.planEnqId, null);
    if (!planEnqId) {
      return res.status(400).json({ message: "planEnqId is required" });
    }
    const response = tourService.getPlanEnquiryUserDataGt({ planEnqId });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getPlanEnquiryUsersDataCt = (req, res, next) => {
  try {
    const planEnqId = tourService.toPositiveInt(req.query.planEnqId, null);
    if (!planEnqId) {
      return res.status(400).json({ message: "planEnqId is required" });
    }
    const response = tourService.getPlanEnquiryUserDataCt({ planEnqId });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addGuestUser = async (req, res, next) => {
  try {
    const response = await tourService.addGuestUser(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const createGroupTourEnquiry = async (req, res, next) => {
  try {
    const response = await tourService.createGroupTourEnquiry(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const updateGroupTourEnquiry = async (req, res, next) => {
  try {
    const response = await tourService.updateGroupTourEnquiry(req.body || {});
    if (!response) {
      return res.status(404).json({ message: "Group tour enquiry not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createCustomTourEnquiry = async (req, res, next) => {
  try {
    const response = await customEnquiryService.createCustomTourEnquiry(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getGuestDetailsHistory = (req, res, next) => {
  try {
    const response = tourService.getGuestTravelDetails({
      guestId: req.query.guestId,
      tab: req.query.tab,
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGuestLoyaltyPointHistory = (req, res, next) => {
  try {
    const response = tourService.getGuestLoyaltyHistory({
      guestId: req.query.guestId,
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const changePrintStatus = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const response = await tourService.updateLoyaltyStatus({
      userId: payload.userId || req.query.userId,
      status: payload.status,
      statusType: "print",
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const changeDeliveryStatus = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const response = await tourService.updateLoyaltyStatus({
      userId: payload.userId || req.query.userId,
      status: payload.status,
      statusType: "delivery",
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCommissionReport = (req, res, next) => {
  try {
    const response = tourService.getCommissionReport({
      page: req.query.page,
      perPage: req.query.perPage,
      year: req.query.year,
      month: req.query.month,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getWaariSelectReport = (req, res, next) => {
  try {
    const response = tourService.listWaariSelectReport({
      page: req.query.page,
      perPage: req.query.perPage,
      year: req.query.year,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const downloadWaariSelectReport = (req, res, next) => {
  try {
    const data = tourService.downloadWaariSelectReport({
      year: req.query.year,
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const listGuestsDirectory = (req, res, next) => {
  try {
    const response = tourService.listGuestsDirectory({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        cardName: req.query.cardName,
        contact: req.query.contact,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllGuestsDirectory = (req, res, next) => {
  try {
    const response = tourService.listAllGuestsDirectory({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        cardName: req.query.cardName,
        contact: req.query.contact,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const searchAllGuestsDirectory = (req, res, next) => {
  try {
    const response = tourService.searchAllGuestsDirectory({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        cardName: req.query.cardName,
        contact: req.query.contact,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getRefereeGuestCounts = (req, res, next) => {
  try {
    const response = tourService.getRefereeGuestCounts();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getRefereeGuestSales = (req, res, next) => {
  try {
    const response = tourService.getRefereeGuestSales();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getAllRefereeGuestCounts = (req, res, next) => {
  try {
    const response = tourService.getAllRefereeGuestCounts();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getAllRefereeGuestSales = (req, res, next) => {
  try {
    const response = tourService.getAllRefereeGuestSales();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listLoyaltyGuests = (req, res, next) => {
  try {
    const response = tourService.listLoyaltyGuests({
      page: req.query.page,
      perPage: req.query.perPageItem || req.query.perPage,
      filters: {
        name: req.query.name,
        guestName: req.query.guestName,
        cardName: req.query.cardName,
        referralId: req.query.referralId,
        refferalId: req.query.refferalId,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllLoyaltyGuests = (req, res, next) => {
  try {
    const response = tourService.listAllLoyaltyGuests({
      page: req.query.page,
      perPage: req.query.perPageItem || req.query.perPage,
      filters: {
        name: req.query.name,
        guestName: req.query.guestName,
        cardName: req.query.cardName,
        referralId: req.query.referralId,
        refferalId: req.query.refferalId,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTourCount = (req, res, next) => {
  try {
    const response = tourService.getGroupTourCountMetric();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGuestCountMetric = (req, res, next) => {
  try {
    const response = tourService.getGuestCountMetric();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listBillingBirthdayGuests = (req, res, next) => {
  try {
    const response = tourService.listBillingBirthdayGuests({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getLoyaltyBookingMetric = (req, res, next) => {
  try {
    const response = tourService.getLoyaltyBookingMetric();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getWelcomeBookingMetric = (req, res, next) => {
  try {
    const response = tourService.getWelcomeBookingMetric();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getReferralRateMetric = (req, res, next) => {
  try {
    const response = tourService.getReferralRateMetric();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getMoreBookingCounts = (req, res, next) => {
  try {
    const response = tourService.getMoreBookingCounts();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listSalesProfit = (req, res, next) => {
  try {
    const response = tourService.listSalesProfitSummary({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getBookingSalesAmountGraphCt = (req, res, next) => {
  try {
    const response = tourService.getBookingSalesAmountGraphCt();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomProfitMetrics = (req, res, next) => {
  try {
    const response = tourService.getCustomProfitMetrics();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTotalBillingSummary = (req, res, next) => {
  try {
    const response = tourService.getTotalBillingSummary();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTotalBillApprovedSummary = (req, res, next) => {
  try {
    const response = tourService.getTotalBillApprovedSummary();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTotalBillPendingSummary = (req, res, next) => {
  try {
    const response = tourService.getTotalBillPendingSummary();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listContactUsEntries = (req, res, next) => {
  try {
    const response = tourService.listWebsiteContactEntries({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listHomePageJourneys = (req, res, next) => {
  try {
    const response = tourService.listHomePageJourneys();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateHomePageJourneys = (req, res, next) => {
  try {
    const response = tourService.updateHomePageJourneys(req.body || {});
    if (!response.data) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const listTopFiveGroupJourneys = (req, res, next) => {
  try {
    const response = tourService.listTopFiveGroupJourneys({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTopFiveGroupJourney = (req, res, next) => {
  try {
    const response = tourService.getTopFiveGroupJourney(req.query.topFiveGroupJourneyId);
    if (!response.data) {
      return res
        .status(response.message === "topFiveGroupJourneyId is required" ? 400 : 404)
        .json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateTopFiveGroupJourney = (req, res, next) => {
  try {
    const payload = { ...(req.body || {}) };
    if (typeof payload.topFiveGroupJourneyId === "undefined" && typeof req.query.topFiveGroupJourneyId !== "undefined") {
      payload.topFiveGroupJourneyId = req.query.topFiveGroupJourneyId;
    }
    const response = tourService.updateTopFiveGroupJourney(payload);
    if (!response.data) {
      return res
        .status(response.message === "topFiveGroupJourneyId is required" ? 400 : 404)
        .json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listWebsiteReviews = (req, res, next) => {
  try {
    const response = tourService.listWebsiteReviews({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addWebsiteReview = (req, res, next) => {
  try {
    const response = tourService.addWebsiteReview(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getWebsiteReview = (req, res, next) => {
  try {
    const response = tourService.getWebsiteReview(req.query.reviewId);
    if (!response.data) {
      return res.status(response.message === "reviewId is required" ? 400 : 404).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateWebsiteReview = (req, res, next) => {
  try {
    const response = tourService.updateWebsiteReview(req.body || {});
    if (!response.data) {
      return res.status(response.message === "reviewId is required" ? 400 : 404).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listOfficeDetails = (req, res, next) => {
  try {
    const response = tourService.listOfficeDetails({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getOfficeDetail = (req, res, next) => {
  try {
    const officedetailId = tourService.toPositiveInt(req.query.officedetailId, null);
    if (!officedetailId) {
      return res.status(400).json({ message: "officedetailId is required" });
    }
    const response = tourService.getOfficeDetail(officedetailId);
    if (!response.data) {
      return res.status(404).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addOfficeDetail = (req, res, next) => {
  try {
    const response = tourService.addOfficeDetail(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const updateOfficeDetail = (req, res, next) => {
  try {
    const response = tourService.updateOfficeDetail(req.body || {});
    if (!response.data) {
      return res.status(response.message === "officedetailId is required" ? 400 : 404).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deleteOfficeDetail = (req, res, next) => {
  try {
    const officedetailId = tourService.toPositiveInt(req.query.officedetailId, null);
    if (!officedetailId) {
      return res.status(400).json({ message: "officedetailId is required" });
    }
    const response = tourService.deleteOfficeDetail(officedetailId);
    if (!response.data) {
      return res.status(404).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listTopSalesPartners = (req, res, next) => {
  try {
    const response = tourService.listTopSalesPartners();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getMonthlyTargetGraphGt = (req, res, next) => {
  try {
    const response = tourService.getMonthlyTargetGraphGt();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTourTargets = (req, res, next) => {
  try {
    const response = tourService.getGroupTargetSummary();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEnquiryGraphGt = (req, res, next) => {
  try {
    const response = tourService.getGroupEnquiryGraphStats();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEnquiriesGT = (req, res, next) => {
  try {
    const response = tourService.getGroupEnquiryTable();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getMonthlyTargetGraphCt = (req, res, next) => {
  try {
    const response = tourService.getMonthlyTargetGraphCt();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomTourTargets = (req, res, next) => {
  try {
    const response = tourService.getCustomTargetSummary();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEnquiryGraphCt = (req, res, next) => {
  try {
    const response = tourService.getCustomEnquiryGraphStats();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEnquiriesCT = (req, res, next) => {
  try {
    const response = tourService.getCustomEnquiryTable();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listFutureEnquiryAll = (req, res, next) => {
  try {
    const response = tourService.listFutureEnquiryAllListing({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: extractFutureFilters(req.query),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listFutureEnquirySelf = (req, res, next) => {
  try {
    const response = tourService.listFutureEnquirySelfListing({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: extractFutureFilters(req.query),
      currentUserId: resolveCurrentUserId(req),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listPendingGroupPayments = (req, res, next) => {
  try {
    const response = tourService.listPendingGroupPayments({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        tourName: req.query.tourName,
        travelStartDate: req.query.travelStartDate,
        travelEndDate: req.query.travelEndDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listPendingCustomPayments = (req, res, next) => {
  try {
    const response = tourService.listPendingCustomPayments({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        tourName: req.query.tourName,
        travelStartDate: req.query.travelStartDate,
        travelEndDate: req.query.travelEndDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listConfirmedCustomPayments = (req, res, next) => {
  try {
    const response = tourService.listConfirmedCustomPayments({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: {
        guestName: req.query.guestName,
        tourName: req.query.tourName,
        travelStartDate: req.query.travelStartDate,
        travelEndDate: req.query.travelEndDate,
      },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listLostGroupEnquiries = (req, res, next) => {
  try {
    const response = tourService.listLostGroupEnquiries({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: { guestName: req.query.guestName },
      currentUserId: resolveCurrentUserId(req),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllLostGroupEnquiries = (req, res, next) => {
  try {
    const response = tourService.listAllLostGroupEnquiries({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: { guestName: req.query.guestName },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listLostCustomEnquiries = (req, res, next) => {
  try {
    const response = tourService.listLostCustomEnquiries({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: { guestName: req.query.guestName },
      currentUserId: resolveCurrentUserId(req),
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAllLostCustomEnquiries = (req, res, next) => {
  try {
    const response = tourService.listAllLostCustomEnquiries({
      page: req.query.page,
      perPage: req.query.perPage,
      filters: { guestName: req.query.guestName },
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTourCostGt = (req, res, next) => {
  try {
    const response = tourService.getGroupTourCostDetails({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
      guestId: req.query.guestId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTourCostCt = (req, res, next) => {
  try {
    const response = tourService.getCustomTourCostDetails({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
      guestId: req.query.guestId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCouponUsage = (req, res, next) => {
  try {
    const response = tourService.getGuestCouponUsage({
      guestId: req.query.guestId,
      enquiryGroupId: req.query.enquiryGroupId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCouponUsageCt = (req, res, next) => {
  try {
    const response = tourService.getCustomGuestCouponUsage({
      guestId: req.query.guestId,
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const checkGuestExists = (req, res, next) => {
  try {
    const response = tourService.checkGuestExists(req.query.guestId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listPaymentModeOptions = (req, res, next) => {
  try {
    const data = tourService.listPaymentModeOptions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listOnlineTypeOptions = (req, res, next) => {
  try {
    const data = tourService.listOnlineTypeOptions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCardTypeOptions = (req, res, next) => {
  try {
    const data = tourService.listCardTypeOptions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const getPaymentCalculation = (req, res, next) => {
  try {
    const response = tourService.getPaymentCalculationDetails({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getPaymentCalculationCt = (req, res, next) => {
  try {
    const response = tourService.getCustomPaymentCalculationDetails({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupPaymentBill = (req, res, next) => {
  try {
    const response = tourService.getGroupPaymentDetails({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomPaymentBill = (req, res, next) => {
  try {
    const response = tourService.getCustomPaymentDetails({
      enquiryCustomId: req.query.enquiryCustomId,
      enquiryDetailCustomId: req.query.enquiryDetailCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupBillView = (req, res, next) => {
  try {
    const response = tourService.getGroupBillView({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTourBookings = (req, res, next) => {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const response = tourService.getGroupTourBookings({
      enquiryGroupId:
        query.groupTourId || query.enquiryGroupId || body.groupTourId || body.enquiryGroupId,
      page: query.page,
      perPage: query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTourGuestDetails = (req, res, next) => {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const response = tourService.getGroupTourGuestDetails({
      enquiryGroupId:
        query.groupTourId || query.enquiryGroupId || body.groupTourId || body.enquiryGroupId,
      page: query.page,
      perPage: query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupMiscellaneousFiles = (req, res, next) => {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const response = tourService.listGroupMiscellaneousFiles({
      enquiryGroupId:
        query.groupTourId || query.enquiryGroupId || body.groupTourId || body.enquiryGroupId,
      page: query.page,
      perPage: query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupSupplierPayments = (req, res, next) => {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const response = tourService.listGroupSupplierPayments({
      enquiryGroupId:
        query.groupTourId || query.enquiryGroupId || body.groupTourId || body.enquiryGroupId,
      page: query.page,
      perPage: query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addGroupSupplierPaymentDetails = async (req, res, next) => {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const paymentInput = body.paymentDetails ?? query.paymentDetails;
    let paymentDetails = paymentInput;
    if (typeof paymentInput === "string") {
      try {
        const parsed = JSON.parse(paymentInput);
        if (Array.isArray(parsed)) {
          paymentDetails = parsed;
        } else if (paymentInput.trim()) {
          paymentDetails = paymentInput
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
        }
      } catch (error) {
        paymentDetails = paymentInput
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }
    }
    const response = await tourService.addGroupSupplierPaymentDetails({
      groupTourId: body.groupTourId || body.enquiryGroupId || query.groupTourId || query.enquiryGroupId,
      supplierName: body.supplierName || query.supplierName,
      type: body.type || query.type,
      total: body.total || query.total,
      paymentDetails,
      balance: body.balance || query.balance,
    });
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const receiveGroupBill = async (req, res, next) => {
  try {
    const response = await tourService.receiveGroupBill(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupNewPaymentDetails = (req, res, next) => {
  try {
    const response = tourService.getGroupNewPaymentDetails({
      groupPaymentDetailId: req.query.groupPaymentDetailId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateGroupPaymentStatus = async (req, res, next) => {
  try {
    const payload = await tourService.updateGroupPaymentStatus({
      groupPaymentDetailId: req.query.groupPaymentDetailId || req.body.groupPaymentDetailId,
      enquiryGroupId: req.query.enquiryGroupId || req.body.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId || req.body.familyHeadGtId,
    });
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

const getGroupReceiptDetails = (req, res, next) => {
  try {
    const response = tourService.getGroupReceiptDetails({
      groupPaymentDetailId: req.query.groupPaymentDetailId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTourCompletionStatus = (req, res, next) => {
  try {
    const response = tourService.getGroupTourCompletionStatus({
      enquiryGroupId: req.query.enquiryGroupId,
      familyHeadGtId: req.query.familyHeadGtId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomTourCompletionStatus = (req, res, next) => {
  try {
    const response = tourService.getCustomTourCompletionStatus({
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupEnquiryStatus = (req, res, next) => {
  try {
    const response = tourService.getGroupEnquiryStatus({
      enquiryGroupId: req.query.enquiryGroupId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomEnquiryStatus = (req, res, next) => {
  try {
    const response = tourService.getCustomEnquiryStatus({
      enquiryCustomId: req.query.enquiryCustomId,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getGroupTotalCallCount = (req, res, next) => {
  try {
    const response = tourService.getGroupTotalCallCount(req.query.enquiryGroupId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomTotalCallCount = (req, res, next) => {
  try {
    const response = tourService.getCustomTotalCallCount(req.query.enquiryCustomId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCallStatusDropdown = (req, res, next) => {
  try {
    const data = tourService.listCallStatusOptions();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCallFollowHistory = (req, res, next) => {
  try {
    const response = tourService.listCallFollowHistory(req.query.enquiryGroupId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomCallFollowHistory = (req, res, next) => {
  try {
    const response = tourService.listCustomCallFollowHistory(req.query.enquiryCustomId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createGroupCallFollowUp = async (req, res, next) => {
  try {
    const response = await tourService.saveGroupCallFollowUp(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const createCustomCallFollowUp = async (req, res, next) => {
  try {
    const response = await tourService.saveCustomCallFollowUp(req.body || {});
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const cancelGroupEnquiry = async (req, res, next) => {
  try {
    const response = await tourService.cancelGroupEnquiry({
      enquiryGroupId: req.body.enquiryGroupId || req.query.enquiryGroupId,
      closureReason: req.body.closureReason || req.query.closureReason,
      cancelledBy: req.body.cancelledBy || req.query.cancelledBy,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const uploadGroupRefundProof = async (req, res, next) => {
  try {
    const response = await tourService.uploadGroupRefundProof(req.body || {});
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const uploadCustomRefundProof = async (req, res, next) => {
  try {
    const response = await tourService.uploadCustomRefundProof(req.body || {});
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listAssignToUsers = async (req, res, next) => {
  try {
    const data = await tourService.listAssignToUsers();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const assignUserToPlanEnquiryGt = async (req, res, next) => {
  try {
    const planEnqId = tourService.toPositiveInt(req.body.planEnqId || req.query.planEnqId, null);
    if (!planEnqId) {
      return res.status(400).json({ message: "planEnqId is required" });
    }
    const response = await tourService.assignUserToPlanEnquiryGt({ ...req.body, planEnqId });
    if (!response) {
      return res.status(404).json({ message: "Plan enquiry not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const assignUserToPlanEnquiryCt = async (req, res, next) => {
  try {
    const planEnqId = tourService.toPositiveInt(req.body.planEnqId || req.query.planEnqId, null);
    if (!planEnqId) {
      return res.status(400).json({ message: "planEnqId is required" });
    }
    const response = await tourService.assignUserToPlanEnquiryCt({ ...req.body, planEnqId });
    if (!response) {
      return res.status(404).json({ message: "Plan enquiry not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createGroupTour = async (req, res, next) => {
  try {
    const files = req.files || {};
    const data = await tourService.createGroupTour({
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

const addGroupTourInfo = async (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.body.groupTourId || req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const response = await tourService.updateGroupTourInfo(groupTourId, req.body || {});
    if (!response) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addSkeletonDetails = async (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.body.groupTourId || req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const entries = Array.isArray(req.body.skeletonInteriory)
      ? req.body.skeletonInteriory
      : req.body.skeletonItinerary;
    const response = await tourService.updateGroupTourSkeleton(groupTourId, entries);
    if (!response) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addGroupTourPrice = async (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.body.groupTourId || req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const response = await tourService.updateGroupTourPrice(groupTourId, req.body.roomsharingprice);
    if (!response) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addTravelDetails = async (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.body.groupTourId || req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const response = await tourService.updateGroupTourTravelDetails(groupTourId, req.body || {});
    if (!response) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addDetailItinerary = async (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.body.groupTourId || req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const entries = Array.isArray(req.body.detailIntenirary)
      ? req.body.detailIntenirary
      : req.body.detailedItinerary;
    const response = await tourService.updateGroupTourDetailedItinerary(groupTourId, entries);
    if (!response) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(response);
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

const getGroupTourViewDetails = (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const data = tourService.getGroupTourPublicDetails(groupTourId);
    if (!data) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getTailorMadeTourViewDetails = (req, res, next) => {
  try {
    const tailorMadeId = tourService.toPositiveInt(req.query.tailorMadeId, null);
    if (!tailorMadeId) {
      return res.status(400).json({ message: "tailorMadeId is required" });
    }
    const data = tourService.getTailorMadePublicDetails(tailorMadeId);
    if (!data) {
      return res.status(404).json({ message: "Tailor-made tour not found" });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getTailorMadeTourDetails = (req, res, next) => {
  try {
    const tailorMadeId = tourService.toPositiveInt(req.query.tailorMadeId, null);
    if (!tailorMadeId) {
      return res.status(400).json({ message: "tailorMadeId is required" });
    }
    const data = tourService.getTailorMadeById(tailorMadeId);
    if (!data) {
      return res.status(404).json({ message: "Tailor-made tour not found" });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const updateTailorMadeTour = (req, res, next) => {
  try {
    const tailorMadeId = tourService.toPositiveInt(req.query.tailorMadeId || req.body.tailorMadeId, null);
    if (!tailorMadeId) {
      return res.status(400).json({ message: "tailorMadeId is required" });
    }
    const response = tourService.updateTailorMadeTour(tailorMadeId, req.body || {});
    if (!response) {
      return res.status(404).json({ message: "Tailor-made tour not found" });
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupTourGuests = (req, res, next) => {
  try {
    const groupTourId = tourService.toPositiveInt(req.query.groupTourId, null);
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }
    const detail = tourService.getGroupTourById(groupTourId);
    if (!detail) {
      return res.status(404).json({ message: "Group tour not found" });
    }
    const response = tourService.listGroupTourGuests(groupTourId);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listMyGroupFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "today", scope: "mine" });

const listMyExpiredGroupFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "expired", scope: "mine" });

const listMyUpcomingGroupFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "upcoming", scope: "mine" });

const listAllGroupTodayFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "today", scope: "all" });

const listAllGroupExpiredFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "expired", scope: "all" });

const listAllGroupUpcomingFollowUps = (req, res, next) =>
  handleGroupFollowUps(req, res, next, { timeframe: "upcoming", scope: "all" });

const listMyCustomFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "today", scope: "mine" });

const listMyExpiredCustomFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "expired", scope: "mine" });

const listMyUpcomingCustomFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "upcoming", scope: "mine" });

const listAssignedCustomTodayFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "today", scope: "mine" });

const listAssignedCustomExpiredFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "expired", scope: "mine" });

const listAssignedCustomUpcomingFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "upcoming", scope: "mine" });

const listAssignedAllCustomTodayFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "today", scope: "assigned" });

const listAssignedAllCustomExpiredFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "expired", scope: "assigned" });

const listAssignedAllCustomUpcomingFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "upcoming", scope: "assigned" });

const listAllCustomTodayFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "today", scope: "all" });

const listAllCustomExpiredFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "expired", scope: "all" });

const listAllCustomUpcomingFollowUps = (req, res, next) =>
  handleCustomFollowUps(req, res, next, { timeframe: "upcoming", scope: "all" });

module.exports = {
  listGroupTours,
  listDraftGroupTours,
  listTailorMadeTours,
  listCustomTours,
  listConfirmGroupTours,
  listAllConfirmGroupTours,
  listConfirmCustomTours,
  listAllConfirmCustomTours,
  listGroupBookingRecords,
  listAllGroupBookingRecords,
  listCustomBookingRecords,
  listAllCustomBookingRecords,
  listGroupGuestDetails,
  listAllGroupGuestDetails,
  listCustomGuestDetails,
  listAllCustomGuestDetails,
  addGuestUser,
  createGroupTourEnquiry,
  updateGroupTourEnquiry,
  createCustomTourEnquiry,
  getGuestDetailsHistory,
  getGuestLoyaltyPointHistory,
  changePrintStatus,
  changeDeliveryStatus,
  getCommissionReport,
  getWaariSelectReport,
  downloadWaariSelectReport,
  listGuestsDirectory,
  listAllGuestsDirectory,
  searchAllGuestsDirectory,
  getRefereeGuestCounts,
  getRefereeGuestSales,
  getAllRefereeGuestCounts,
  getAllRefereeGuestSales,
  listLoyaltyGuests,
  listAllLoyaltyGuests,
  listGroupTourDropdown,
  listPriorityList,
  listHotelCategoryDropdown,
  listPrefixDropdown,
  listGuestReferenceDropdown,
  searchGuestEmails,
  listEnquiryReferenceDropdown,
  listTourTypes,
  addTourType,
  getTourType,
  listCities,
  listDestinations,
  listVehicles,
  listMealPlans,
  listMealTypes,
  listKitchens,
  listDepartureTypes,
  listCountries,
  getCustomizedEnquiryDetails,
  listCustomizedPackages,
  getCustomBillView,
  listCustomNewPayments,
  getCustomReceiptView,
  updateCustomPaymentStatus,
  getGroupEnquiryDetails,
  listFamilyHeadData,
  listCustomFamilyHeadData,
  saveFamilyHeadDetails,
  getEnquiryFamilyHead,
  listFamilyHeadRoomShare,
  listCustomFamilyHeadRoomShare,
  listRoomPriceDropdown,
  listTravelModeDropdown,
  listVoucherTypes,
  listCustomVouchers,
  uploadCustomVouchers,
  listGroupGuestsForCancellation,
  listCustomGuestsForCancellation,
  getGroupCancellationProcessData,
  getCustomCancellationProcessData,
  getGuestDetailsGt,
  getGuestDetailsCt,
  listGuestDocuments,
  listCustomGuestDocuments,
  listPlanEnquiryUsersGt,
  listPlanEnquiryUsersCt,
  getPlanEnquiryUsersDataGt,
  getPlanEnquiryUsersDataCt,
  listBillingBirthdayGuests,
  getGroupTourCount,
  getGuestCountMetric,
  getLoyaltyBookingMetric,
  getWelcomeBookingMetric,
  getReferralRateMetric,
  getMoreBookingCounts,
  listSalesProfit,
  getBookingSalesAmountGraphCt,
  getCustomProfitMetrics,
  getTotalBillingSummary,
  getTotalBillApprovedSummary,
  getTotalBillPendingSummary,
  listContactUsEntries,
  listHomePageJourneys,
  updateHomePageJourneys,
  listTopFiveGroupJourneys,
  getTopFiveGroupJourney,
  updateTopFiveGroupJourney,
  listWebsiteReviews,
  addWebsiteReview,
  getWebsiteReview,
  updateWebsiteReview,
  listOfficeDetails,
  getOfficeDetail,
  addOfficeDetail,
  updateOfficeDetail,
  deleteOfficeDetail,
  listTopSalesPartners,
  getMonthlyTargetGraphGt,
  getGroupTourTargets,
  getEnquiryGraphGt,
  getEnquiriesGT,
  getMonthlyTargetGraphCt,
  getCustomTourTargets,
  getEnquiryGraphCt,
  getEnquiriesCT,
  listFutureEnquiryAll,
  listFutureEnquirySelf,
  listPendingGroupPayments,
  listPendingCustomPayments,
  listConfirmedCustomPayments,
  listLostGroupEnquiries,
  listAllLostGroupEnquiries,
  listLostCustomEnquiries,
  listAllLostCustomEnquiries,
  getTourCostGt,
  getTourCostCt,
  getCouponUsage,
  getCouponUsageCt,
  checkGuestExists,
  listPaymentModeOptions,
  listOnlineTypeOptions,
  listCardTypeOptions,
  getPaymentCalculation,
  getPaymentCalculationCt,
  getGroupPaymentBill,
  getCustomPaymentBill,
  getGroupBillView,
  getGroupTourBookings,
  getGroupTourGuestDetails,
  listGroupMiscellaneousFiles,
  listGroupSupplierPayments,
  addGroupSupplierPaymentDetails,
  receiveGroupBill,
  getGroupNewPaymentDetails,
  updateGroupPaymentStatus,
  getGroupReceiptDetails,
  getGroupTourCompletionStatus,
  getCustomTourCompletionStatus,
  getGroupEnquiryStatus,
  getCustomEnquiryStatus,
  getGroupTotalCallCount,
  getCustomTotalCallCount,
  listCallStatusDropdown,
  listCallFollowHistory,
  listCustomCallFollowHistory,
  createGroupCallFollowUp,
  createCustomCallFollowUp,
  cancelGroupEnquiry,
  uploadGroupRefundProof,
  uploadCustomRefundProof,
  listAssignToUsers,
  assignUserToPlanEnquiryGt,
  assignUserToPlanEnquiryCt,
  createGroupTour,
  addGroupTourInfo,
  addSkeletonDetails,
  addGroupTourPrice,
  addTravelDetails,
  addDetailItinerary,
  getGroupTourDetails,
  getGroupTourViewDetails,
  getTailorMadeTourViewDetails,
  getTailorMadeTourDetails,
  updateTailorMadeTour,
  listGroupTourGuests,
  listMyGroupFollowUps,
  listMyExpiredGroupFollowUps,
  listMyUpcomingGroupFollowUps,
  listAllGroupTodayFollowUps,
  listAllGroupExpiredFollowUps,
  listAllGroupUpcomingFollowUps,
  listMyCustomFollowUps,
  listMyExpiredCustomFollowUps,
  listMyUpcomingCustomFollowUps,
  listAssignedCustomTodayFollowUps,
  listAssignedCustomExpiredFollowUps,
  listAssignedCustomUpcomingFollowUps,
  listAssignedAllCustomTodayFollowUps,
  listAssignedAllCustomExpiredFollowUps,
  listAssignedAllCustomUpcomingFollowUps,
  listAllCustomTodayFollowUps,
  listAllCustomExpiredFollowUps,
  listAllCustomUpcomingFollowUps,
};
