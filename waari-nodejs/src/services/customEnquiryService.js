const {
  customEnquiryDetails,
  customEnquiryDetailTemplate,
  customTours,
  destinations,
  countries,
  states,
  cities,
  hotelCategories,
  mealPlans,
  priorities,
  enquiryReferences,
  guestReferenceDropdown,
} = require("../data/tourDataStore");
const { persistTourFixture } = require("../data/toursDataLoader");

const DEFAULT_HOTEL_CATEGORY_OPTIONS = [
  { hotelCatId: 1, hotelCatName: "Budget" },
  { hotelCatId: 2, hotelCatName: "Standard" },
  { hotelCatId: 3, hotelCatName: "Deluxe" },
  { hotelCatId: 4, hotelCatName: "Premium" },
  { hotelCatId: 5, hotelCatName: "Luxury" },
];

const toPositiveInt = (value, fallback = null) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const toSafeString = (value) => (value === undefined || value === null ? "" : String(value)).trim();

const cloneValue = (value, fallback) => JSON.parse(JSON.stringify(value !== undefined ? value : fallback));

const normalizeArrayInput = (value, fallback = []) => {
  const base = Array.isArray(value) ? value : fallback;
  return cloneValue(base, Array.isArray(fallback) ? fallback : []);
};

const normalizeAgeArray = (value) => {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .map((entry) => toPositiveInt(entry, null))
    .filter((entry) => entry !== null)
    .map((age) => String(age));
};

const normalizeCityIds = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (entry && typeof entry === "object") {
          if (entry.value !== undefined) {
            return toPositiveInt(entry.value, null);
          }
          if (entry.citiesId !== undefined) {
            return toPositiveInt(entry.citiesId, null);
          }
          if (entry.cityId !== undefined) {
            return toPositiveInt(entry.cityId, null);
          }
        }
        return toPositiveInt(entry, null);
      })
      .filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return normalizeCityIds(parsed);
    } catch (error) {
      return value
        .split(",")
        .map((token) => toPositiveInt(token.trim(), null))
        .filter(Boolean);
    }
  }
  return [];
};

const buildCityDetails = (cityIds) =>
  cityIds
    .map((cityId) => cities.find((city) => Number(city.citiesId) === Number(cityId)))
    .filter(Boolean)
    .map((city) => ({ citiesId: city.citiesId, citiesName: city.citiesName }));

const resolveDestination = (destinationId) =>
  destinations.find((entry) => Number(entry.destinationId) === Number(destinationId)) ||
  destinations[0] ||
  { destinationId: null, destinationName: "" };

const resolveCountry = (countryId, destinationId) =>
  countries.find((entry) => Number(entry.countryId) === Number(countryId)) ||
  countries.find((entry) => Number(entry.destinationId) === Number(destinationId)) ||
  countries[0] ||
  { countryId: null, countryName: "" };

const resolveState = (stateId) =>
  states.find((entry) => Number(entry.stateId) === Number(stateId)) || states[0] || { stateId: null, stateName: "" };

const resolveMealPlan = (mealPlanId) =>
  mealPlans.find((entry) => Number(entry.mealPlanId) === Number(mealPlanId)) ||
  mealPlans[0] ||
  { mealPlanId: null, mealPlanName: "" };

const resolveHotelCategory = (hotelCatId) => {
  const source = Array.isArray(hotelCategories) && hotelCategories.length ? hotelCategories : DEFAULT_HOTEL_CATEGORY_OPTIONS;
  return (
    source.find((entry) => Number(entry.hotelCatId) === Number(hotelCatId)) ||
    source[0] ||
    { hotelCatId: null, hotelCatName: "" }
  );
};

const resolvePriority = (priorityId) =>
  priorities.find((entry) => Number(entry.priorityId) === Number(priorityId)) ||
  priorities[0] ||
  {
    priorityId: customEnquiryDetailTemplate.priorityId,
    priorityName: customEnquiryDetailTemplate.priorityName,
  };

const resolveEnquiryReference = (enquiryReferId) =>
  enquiryReferences.find((entry) => Number(entry.enquiryReferId) === Number(enquiryReferId)) ||
  enquiryReferences[0] ||
  {
    enquiryReferId: customEnquiryDetailTemplate.enquiryReferId,
    enquiryReferName: customEnquiryDetailTemplate.enquiryReferName,
  };

const resolveGuestReference = (guestRefId) =>
  guestReferenceDropdown.find((entry) => entry.guestRefId === guestRefId) ||
  guestReferenceDropdown[0] ||
  { guestRefId: customEnquiryDetailTemplate.guestRefId };

const existingCustomEnquiryIds = () => {
  const ids = new Set();
  customTours.forEach((tour) => {
    const value = toPositiveInt(tour.enquiryCustomId, null);
    if (value) {
      ids.add(value);
    }
  });
  Object.keys(customEnquiryDetails || {}).forEach((key) => {
    const value = toPositiveInt(key, null);
    if (value) {
      ids.add(value);
    }
  });
  return Array.from(ids);
};

const nextEnquiryCustomId = () => {
  const ids = existingCustomEnquiryIds();
  if (!ids.length) {
    return 501;
  }
  return ids.reduce((max, value) => Math.max(max, value), 0) + 1;
};

const buildDurationLabel = (days, nights) => {
  const safeDays = toPositiveInt(days, null);
  const safeNights = toPositiveInt(nights, null);
  if (safeDays !== null && safeNights !== null) {
    return `${safeDays}D-${safeNights}N`;
  }
  if (safeDays !== null) {
    return `${safeDays}D-${Math.max(0, safeDays - 1)}N`;
  }
  if (safeNights !== null) {
    return `${safeNights + 1}D-${safeNights}N`;
  }
  return customEnquiryDetailTemplate.duration || "5D-4N";
};

const requireField = (value, message) => {
  if (!toSafeString(value)) {
    const error = new Error(message);
    error.status = 400;
    throw error;
  }
};

const createCustomTourEnquiry = async (payload = {}) => {
  requireField(payload.groupName || payload.nameofgroup, "groupName is required");
  requireField(payload.fullName || payload.contactName, "fullName is required");
  requireField(payload.contact, "contact is required");

  const destination = resolveDestination(payload.destinationId);
  const country = resolveCountry(payload.countryId, destination.destinationId);
  const state = resolveState(payload.stateId);
  const mealPlan = resolveMealPlan(payload.mealPlanId);
  const hotelCategory = resolveHotelCategory(payload.hotelCatId || payload.hotel);
  const priority = resolvePriority(payload.priorityId || payload.priority);
  const enquiryReference = resolveEnquiryReference(payload.enquiryReferId || payload.enquiryref);
  const guestReference = resolveGuestReference(payload.guestRefId || payload.guestref);

  const cityIds = normalizeCityIds(payload.cities);
  const cityDetails = buildCityDetails(cityIds);
  const adults = toPositiveInt(payload.adults, customEnquiryDetailTemplate.adults);
  const child = toPositiveInt(payload.child, customEnquiryDetailTemplate.child);
  const nights = toPositiveInt(payload.nights, null);
  const days = toPositiveInt(payload.days, null);
  const rooms = toPositiveInt(payload.rooms || payload.totalrooms, customEnquiryDetailTemplate.rooms);
  const extraBed = toPositiveInt(payload.extraBed || payload.totalextrabed, customEnquiryDetailTemplate.extraBed);
  const familyHeadNo = toPositiveInt(payload.familyHeadNo || payload.numberoffamilyhead, customEnquiryDetailTemplate.familyHeadNo);
  const newId = nextEnquiryCustomId();
  const now = new Date().toISOString();

  const detail = {
    ...customEnquiryDetailTemplate,
    enquiryCustomId: newId,
    enquiryDetailCustomId: Number(`${newId}01`),
    uniqueEnqueryId: `CT-${String(newId).padStart(4, "0")}`,
    groupName: toSafeString(payload.groupName || payload.nameofgroup) || customEnquiryDetailTemplate.groupName,
    contactName: toSafeString(payload.fullName || payload.contactName) || customEnquiryDetailTemplate.contactName,
    fullName: toSafeString(payload.fullName || payload.contactName) || customEnquiryDetailTemplate.contactName,
    contact: toSafeString(payload.contact),
    mailId: toSafeString(payload.mailId || payload.email) || customEnquiryDetailTemplate.mailId,
    destinationId: destination.destinationId,
    destinationName: destination.destinationName,
    countryId: country.countryId,
    countryName: country.countryName,
    stateId: state.stateId,
    stateName: state.stateName,
    startDate: toSafeString(payload.startDate || payload.tourstartdate) || customEnquiryDetailTemplate.startDate,
    endDate: toSafeString(payload.endDate || payload.tourenddate) || customEnquiryDetailTemplate.endDate,
    travelMonth: (payload.startDate || payload.tourstartdate || "").toString().slice(0, 7),
    days: days ?? customEnquiryDetailTemplate.days,
    nights: nights ?? customEnquiryDetailTemplate.nights,
    duration: payload.duration || buildDurationLabel(days, nights),
    adults,
    child,
    age: normalizeAgeArray(payload.age || payload.childrenages),
    cityIds,
    cities: JSON.stringify(cityIds),
    cityDetails,
    rooms,
    extraBed,
    familyHeadNo,
    mealPlanId: mealPlan.mealPlanId,
    mealPlanName: mealPlan.mealPlanName,
    hotelCatId: hotelCategory.hotelCatId,
    hotelCatName: hotelCategory.hotelCatName,
    enquiryReferId: enquiryReference.enquiryReferId,
    enquiryReferName: enquiryReference.enquiryReferName,
    guestRefId: guestReference.guestRefId || customEnquiryDetailTemplate.guestRefId,
    priorityId: priority.priorityId,
    priorityName: priority.priorityName,
    sectorId: toPositiveInt(payload.sectorId, customEnquiryDetailTemplate.sectorId),
    budgetPerPerson: toSafeString(payload.budgetPerPerson) || customEnquiryDetailTemplate.budgetPerPerson,
    notes: toSafeString(payload.notes || payload.note) || customEnquiryDetailTemplate.notes,
    nextFollowUp: toSafeString(payload.nextFollowUp || payload.nextfollowup) || customEnquiryDetailTemplate.nextFollowUp,
    requirements: normalizeArrayInput(payload.requirements, customEnquiryDetailTemplate.requirements),
    experiences: normalizeArrayInput(payload.experiences, customEnquiryDetailTemplate.experiences),
    destinationHighlights: normalizeArrayInput(payload.destinationHighlights, customEnquiryDetailTemplate.destinationHighlights),
    workflowStage: "ENQUIRY_CAPTURED",
    status: "IN_PROGRESS",
    isRework: Boolean(payload.isRework),
    isEnqNonEditable: false,
    createdAt: now,
    updatedAt: now,
  };

  customEnquiryDetails[newId] = detail;
  await persistTourFixture("customEnquiryDetails");

  return {
    message: "Custom tour enquiry saved successfully",
    enquiryCustomId: newId,
    data: detail,
  };
};

module.exports = {
  createCustomTourEnquiry,
};
