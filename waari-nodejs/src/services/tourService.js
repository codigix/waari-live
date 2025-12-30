const {
  tourTypes,
  cities,
  destinations,
  vehicles,
  mealPlans,
  mealTypes,
  kitchens,
  departureTypes,
  countries,
  groupTours,
  tailorMadeTours,
  customTours,
} = require("../data/toursData");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const toDate = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const matchesText = (source, filter) => {
  const query = normalize(filter);
  if (!query) {
    return true;
  }
  return normalize(source).includes(query);
};

const matchesTourType = (tour, filter) => {
  if (filter === undefined || filter === null || filter === "") {
    return true;
  }
  const numeric = toPositiveInt(filter, null);
  if (numeric) {
    return Number(tour.tourTypeId) === numeric;
  }
  const query = normalize(filter);
  if (!query) {
    return true;
  }
  return normalize(tour.tourTypeName) === query || normalize(tour.category) === query;
};

const matchesCity = (tour, cityId) => {
  const parsed = toPositiveInt(cityId, null);
  if (!parsed) {
    return true;
  }
  return Number(tour.cityId) === parsed;
};

const matchesTravelMonth = (value, filter) => {
  if (!filter) {
    return true;
  }
  const target = (filter || "").toString().slice(0, 7);
  return (value || "").toString().startsWith(target);
};

const matchesDuration = (value, filter) => {
  const parsed = toPositiveInt(filter, null);
  if (!parsed) {
    return true;
  }
  return Number(value || 0) === parsed;
};

const matchesDeparture = (value, filter) => {
  const query = normalize(filter);
  if (!query) {
    return true;
  }
  return normalize(value) === query;
};

const matchesDateRange = (startValue, endValue, from, to) => {
  const start = toDate(startValue);
  const end = toDate(endValue);
  const rangeStart = toDate(from);
  const rangeEnd = toDate(to);
  if (rangeStart && (!start || start < rangeStart)) {
    return false;
  }
  if (rangeEnd && (!end || end > rangeEnd)) {
    return false;
  }
  return true;
};

const paginate = (items, page, perPage) => {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return { data, total, lastPage, page, perPage };
};

const filterGroupStyleTours = (list, filters = {}) => {
  const {
    tourName,
    tourType,
    travelMonth,
    totalDuration,
    travelStartDate,
    travelEndDate,
    departureType,
    cityId,
    tailorMadeId,
  } = filters;

  return list.filter((tour) => {
    if (!matchesText(tour.tourName, tourName)) {
      return false;
    }
    if (!matchesTourType(tour, tourType)) {
      return false;
    }
    if (!matchesTravelMonth(tour.travelMonth, travelMonth)) {
      return false;
    }
    if (!matchesDuration(tour.totalDuration ?? tour.days, totalDuration)) {
      return false;
    }
    if (!matchesDeparture(tour.departureType, departureType)) {
      return false;
    }
    if (!matchesCity(tour, cityId)) {
      return false;
    }
    if (!matchesDateRange(tour.startDate, tour.endDate, travelStartDate, travelEndDate)) {
      return false;
    }
    const filterId = toPositiveInt(tailorMadeId, null);
    if (filterId && Number(tour.tailorMadeId || tour.groupTourId) !== filterId) {
      return false;
    }
    return true;
  });
};

const filterCustomTours = (list, filters = {}) => {
  const { groupName, travelMonth, duration, startDate, endDate, cityId } = filters;
  return list.filter((tour) => {
    if (!matchesText(tour.groupName, groupName)) {
      return false;
    }
    if (!matchesTravelMonth(tour.travelMonth, travelMonth)) {
      return false;
    }
    if (!matchesDuration(tour.days, duration)) {
      return false;
    }
    if (!matchesCity(tour, cityId)) {
      return false;
    }
    if (!matchesDateRange(tour.startDate, tour.endDate, startDate, endDate)) {
      return false;
    }
    return true;
  });
};

const buildListResponse = (items, page, perPage, filters = {}, message = "") => {
  const pagination = paginate(items, page, perPage);
  return {
    message,
    filters,
    data: pagination.data,
    total: pagination.total,
    page: pagination.page,
    perPage: pagination.perPage,
    lastPage: pagination.lastPage,
  };
};

const listGroupTours = ({ page = 1, perPage = 10, filters = {}, status = "PUBLISHED", category = "GROUP" }) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const filtered = filterGroupStyleTours(groupTours, filters).filter((tour) => {
    if (status && tour.status !== status) {
      return false;
    }
    if (category && tour.category !== category) {
      return false;
    }
    return true;
  });
  return buildListResponse(filtered, pageNumber, perPageNumber, filters, "Group tours fetched successfully");
};

const listTailorMadeTours = ({ page = 1, perPage = 10, filters = {} }) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const filtered = filterGroupStyleTours(tailorMadeTours, filters);
  return buildListResponse(filtered, pageNumber, perPageNumber, filters, "Tailor-made tours fetched successfully");
};

const listCustomTours = ({ page = 1, perPage = 10, filters = {}, category = "CUSTOMIZED" }) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const filtered = filterCustomTours(customTours, filters).filter((tour) => {
    if (category && tour.category !== category) {
      return false;
    }
    return true;
  });
  const pagination = paginate(filtered, pageNumber, perPageNumber);
  return {
    data: pagination.data,
    total: pagination.total,
    currentPage: pagination.page,
    perPage: pagination.perPage,
    lastPage: pagination.lastPage,
    filters,
    message: "Customized tours fetched successfully",
  };
};

const listTourTypes = () => tourTypes;

const listCities = () => cities;

const listDestinations = () => destinations;

const listVehicles = () => vehicles;

const listMealPlans = () => mealPlans;

const listMealTypes = () => mealTypes;

const listKitchens = () => kitchens;

const listDepartureTypes = ({ destinationId } = {}) => {
  const parsedDestination = toPositiveInt(destinationId, null);
  return departureTypes.filter((type) => {
    if (!parsedDestination) {
      return true;
    }
    return Number(type.destinationId) === parsedDestination;
  });
};

const listCountries = ({ destinationId } = {}) => {
  const parsedDestination = toPositiveInt(destinationId, null);
  return countries.filter((country) => {
    if (!parsedDestination) {
      return true;
    }
    return Number(country.destinationId) === parsedDestination;
  });
};

const parseCityIds = (input) => {
  if (!input) {
    return [];
  }
  if (Array.isArray(input)) {
    return input.map((value) => toPositiveInt(value, null)).filter(Boolean);
  }
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed.map((value) => toPositiveInt(value, null)).filter(Boolean);
      }
    } catch (error) {}
    return input
      .split(",")
      .map((value) => toPositiveInt(value.trim(), null))
      .filter(Boolean);
  }
  return [];
};

const nextGroupTourId = () =>
  groupTours.reduce((max, tour) => Math.max(max, Number(tour.groupTourId) || 0), 0) + 1;

const createGroupTour = (payload = {}) => {
  const groupTourId = nextGroupTourId();
  const tourTypeId = toPositiveInt(payload.tourTypeId, null);
  const tourType = tourTypes.find((item) => item.tourTypeId === tourTypeId);
  const departureTypeId = toPositiveInt(payload.departureTypeId, null);
  const departureType = departureTypes.find((item) => item.departureTypeId === departureTypeId);
  const destinationId = toPositiveInt(payload.destinationId, null);
  const countryId = toPositiveInt(payload.countryId, null);
  const stateId = toPositiveInt(payload.stateId, null);
  const vehicleId = toPositiveInt(payload.vehicleId, null);
  const mealPlanId = toPositiveInt(payload.mealPlanId, null);
  const mealTypeId = toPositiveInt(payload.mealTypeId, null);
  const kitchenId = toPositiveInt(payload.kitchenId, null);
  const totalSeats = toPositiveInt(payload.totalSeats, 0) || 0;
  const days = toPositiveInt(payload.days, null);
  const nights = toPositiveInt(payload.night || payload.nights, null);
  const cityIds = parseCityIds(payload.cityIds || payload.cityId);
  const primaryCityId = cityIds[0] || null;
  const city = cities.find((item) => item.citiesId === primaryCityId);
  const travelMonth = (payload.startDate || "").toString().slice(0, 7);
  const now = new Date().toISOString();

  const newTour = {
    groupTourId,
    tourName: payload.tourName || "",
    tourCode: payload.tourCode || "",
    tourTypeId,
    tourTypeName: tourType ? tourType.tourTypeName : "",
    category: tourType ? tourType.category : "GROUP",
    destinationId,
    departureTypeId,
    departureType: departureType ? departureType.departureName || departureType.departureTypeName : "",
    countryId,
    stateId,
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    travelMonth,
    days,
    night: nights,
    duration:
      days && nights
        ? `${days}D-${nights}N`
        : days
        ? `${days}D`
        : nights
        ? `${nights}N`
        : "",
    totalDuration: days || nights || null,
    totalSeats,
    seatsBook: 0,
    seatsAval: totalSeats,
    cityId: primaryCityId,
    cityName: city ? city.citiesName : "",
    cityIds,
    vehicleId,
    mealPlanId,
    mealTypeId,
    kitchenId,
    uniqueExperience: payload.uniqueExperience || "",
    tourManager: payload.tourManager || "",
    managerNo: payload.managerNo || "",
    shopping: payload.shopping || "",
    weather: payload.weather || "",
    websiteDescription: payload.websiteDescription || "",
    bgImageUrl: payload.bgImageUrl || "",
    websiteBannerUrl: payload.websiteBannerUrl || "",
    pdfUrl: "",
    status: "DRAFT",
    workflowStage: "ENQUIRY",
    createdAt: now,
    updatedAt: now,
  };

  groupTours.push(newTour);

  return {
    message: "Tour created successfully",
    groupTourId,
    data: newTour,
  };
};

const getGroupTourById = (groupTourId) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  return groupTours.find((tour) => Number(tour.groupTourId) === id) || null;
};

module.exports = {
  toPositiveInt,
  listGroupTours,
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
  getGroupTourById,
};
