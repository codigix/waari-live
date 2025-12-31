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

const getGroupTotalCallCount = (req, res, next) => {
  try {
    const response = tourService.getGroupTotalCallCount(req.query.enquiryGroupId);
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
  listGroupTourDropdown,
  listPriorityList,
  listPrefixDropdown,
  listGuestReferenceDropdown,
  listEnquiryReferenceDropdown,
  listTourTypes,
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
  getGroupEnquiryDetails,
  listFamilyHeadData,
  getEnquiryFamilyHead,
  listFamilyHeadRoomShare,
  listRoomPriceDropdown,
  listTravelModeDropdown,
  listGroupGuestsForCancellation,
  getGroupCancellationProcessData,
  getGuestDetailsGt,
  listGuestDocuments,
  listPlanEnquiryUsersGt,
  listPlanEnquiryUsersCt,
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
  getCouponUsage,
  checkGuestExists,
  listPaymentModeOptions,
  listOnlineTypeOptions,
  listCardTypeOptions,
  getPaymentCalculation,
  getGroupPaymentBill,
  getGroupBillView,
  getGroupTourCompletionStatus,
  getGroupTotalCallCount,
  listCallStatusDropdown,
  listCallFollowHistory,
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
