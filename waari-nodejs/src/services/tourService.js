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
  priorities,
  namePrefixes,
  enquiryReferences,
  guestReferenceDropdown,
  groupTours,
  tailorMadeTours,
  customTours,
  states,
  roomSharingPriceTemplate,
  tailorMadeHotelPriceTemplate,
  skeletonItineraryTemplate,
  detailedItineraryTemplate,
  grouptourItineraryImagesTemplate,
  flightDetailsTemplate,
  trainDetailsTemplate,
  dtodTemplate,
  inclusionsTemplate,
  exclusionsTemplate,
  notesTemplate,
  groupTourDetailOverrides,
  tailorMadeDetailOverrides,
  groupTourGuestTemplate,
  groupTourGuests,
  customEnquiryDetailTemplate,
  customEnquiryDetails,
  customPackageTemplate,
  customEnquiryPackages,
} = require("../data/tourDataStore");
const { persistTourFixture } = require("../data/toursDataLoader");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

const normalizeCategory = (value, fallback = "GROUP") => {
  const base = value === undefined || value === null || value === "" ? fallback : value;
  const normalized = (base || "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
  if (!normalized) {
    return "GROUP";
  }
  if (["GROUP", "GROUP_TOUR", "GROUPS"].includes(normalized)) {
    return "GROUP";
  }
  if (["TAILOR_MADE", "TAILORMADE", "TAILOR"].includes(normalized)) {
    return "TAILOR_MADE";
  }
  if (["CUSTOMIZED", "CUSTOM", "CUSTOM_TOUR", "CUSTOMISED"].includes(normalized)) {
    return "CUSTOMIZED";
  }
  return normalized;
};

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

const DEFAULT_BG_IMAGE = "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1080";
const DEFAULT_WEBSITE_BANNER = "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=600";
const DEFAULT_WEBSITE_DESCRIPTION =
  "<p>Plan immersive journeys with Waari's curated departures and concierge support.</p>";

const cloneValue = (value, fallback) => JSON.parse(JSON.stringify((value !== undefined ? value : fallback)));

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toStringValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
};

const normalizeNotes = (value, fallback = []) => {
  const base = value !== undefined ? value : fallback;
  const list = cloneValue(base, Array.isArray(fallback) ? fallback : []);
  return list.map((entry, index) => {
    const text =
      (typeof entry.note === "string" && entry.note.trim()) ||
      (typeof entry.description === "string" && entry.description.trim()) ||
      "";
    const note = text || `Note ${index + 1}`;
    return { ...entry, note, description: entry.description || note };
  });
};

const normalizeDescriptionEntries = (value, fallback = []) => {
  const fallbackList = Array.isArray(fallback) ? fallback : [];
  const source = Array.isArray(value) ? value : fallbackList;
  const normalized = source
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.trim();
      }
      if (entry && typeof entry.description === "string") {
        return entry.description.trim();
      }
      if (entry && typeof entry.note === "string") {
        return entry.note.trim();
      }
      return "";
    })
    .filter((text) => Boolean(text))
    .map((description) => ({ description }));
  if (normalized.length) {
    return normalized;
  }
  return cloneValue(fallbackList, []);
};

const normalizeTailorMadePrices = (value) => {
  const hasValue = Array.isArray(value) && value.length;
  const source = cloneValue(hasValue ? value : tailorMadeHotelPriceTemplate, []);
  const fallback = tailorMadeHotelPriceTemplate;
  return source.map((entry, index) => {
    const fallbackEntry = fallback[index % fallback.length];
    const type = entry.type ?? fallbackEntry.type ?? (index % 3);
    const roomShareId = entry.roomShareId ?? fallbackEntry.roomShareId ?? index + 1;
    const title = entry.roomShareName || entry.hotelName || fallbackEntry.roomShareName || `Option ${index + 1}`;
    const hotelName = entry.hotelName || fallbackEntry.hotelName || title;
    return {
      type,
      roomShareId,
      roomShareName: title,
      hotelName,
      tourPrice: Number(entry.tourPrice ?? fallbackEntry.tourPrice ?? 0),
      offerPrice: Number(entry.offerPrice ?? fallbackEntry.offerPrice ?? entry.tourPrice ?? fallbackEntry.tourPrice ?? 0),
      commissionPrice: Number(entry.commissionPrice ?? fallbackEntry.commissionPrice ?? 0),
    };
  });
};

const normalizeTailorMadeItinerary = (value) => {
  const hasValue = Array.isArray(value) && value.length;
  const source = cloneValue(hasValue ? value : detailedItineraryTemplate, []);
  const templateKeys = Object.keys(grouptourItineraryImagesTemplate);
  return source.map((entry, index) => {
    const templateKey = templateKeys[index % templateKeys.length];
    const fallbackImages =
      entry.tailorMadeitineraryimages ||
      entry.grouptouritineraryimages ||
      grouptourItineraryImagesTemplate[templateKey] ||
      [];
    const normalizedImages = cloneValue(fallbackImages, []);
    return {
      ...entry,
      tailorMadeitineraryimages: normalizedImages,
      grouptouritineraryimages: normalizedImages,
    };
  });
};

const normalizeArrayInput = (value, fallback = []) => {
  const source = Array.isArray(value) ? value : Array.isArray(fallback) ? fallback : [];
  const reference = Array.isArray(fallback) ? fallback : [];
  return cloneValue(source, reference);
};

const normalizeSkeletonItineraryInput = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    return cloneValue(fallback, []);
  }
  const normalized = value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      return {
        day: toPositiveInt(entry.day, index + 1) || index + 1,
        date: toStringValue(entry.date),
        destination: toStringValue(entry.destination),
        overnightAt: toStringValue(entry.overnightAt),
        hotelName: toStringValue(entry.hotelName),
        hotelAddress: toStringValue(entry.hotelAddress),
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    return cloneValue(fallback, []);
  }
  return normalized;
};

const normalizeRoomSharingPriceInput = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    return cloneValue(fallback, roomSharingPriceTemplate);
  }
  const normalized = value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const roomShareId = toPositiveInt(entry.roomShareId, index + 1) || index + 1;
      return {
        roomShareId,
        roomShareName: toStringValue(entry.roomShareName || `Option ${roomShareId}`),
        tourPrice: toNumber(entry.tourPrice, 0),
        offerPrice: toNumber(entry.offerPrice, toNumber(entry.tourPrice, 0)),
        commissionPrice: toNumber(entry.commissionPrice, 0),
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    return cloneValue(fallback, roomSharingPriceTemplate);
  }
  return normalized;
};

const normalizeItineraryImagesList = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((image) => {
      if (!image || typeof image !== "object") {
        return null;
      }
      const itineraryImageName = toStringValue(image.itineraryImageName);
      const itineraryImageUrl = toStringValue(image.itineraryImageUrl);
      if (!itineraryImageName && !itineraryImageUrl) {
        return null;
      }
      const typeValue = Number(image.type);
      return {
        itineraryImageName,
        itineraryImageUrl,
        type: Number.isNaN(typeValue) ? 0 : typeValue,
      };
    })
    .filter(Boolean);
};

const normalizeDetailedItineraryInput = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    const reference = Array.isArray(fallback) ? fallback : [];
    return cloneValue(reference, detailedItineraryTemplate);
  }
  const normalized = value
    .map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const images = normalizeItineraryImagesList(
        entry.grouptouritineraryimagesList || entry.grouptouritineraryimages
      );
      const mealTypes = Array.isArray(entry.mealTypeId)
        ? entry.mealTypeId.map((meal) => toStringValue(meal)).filter(Boolean)
        : [];
      return {
        day: toPositiveInt(entry.day, index + 1) || index + 1,
        date: toStringValue(entry.date),
        title: toStringValue(entry.title),
        distance: toStringValue(entry.distance),
        description: toStringValue(entry.description),
        nightStayAt: toStringValue(entry.nightStayAt),
        mealTypeId: mealTypes,
        fromCity: toStringValue(entry.fromCity),
        toCity: toStringValue(entry.toCity),
        approxTravelTime: toStringValue(entry.approxTravelTime),
        bannerImage: toStringValue(entry.bannerImage),
        hotelImage: toStringValue(entry.hotelImage),
        grouptouritineraryimages: images,
        grouptouritineraryimagesList: images,
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    const reference = Array.isArray(fallback) ? fallback : [];
    return cloneValue(reference, detailedItineraryTemplate);
  }
  return normalized;
};

const buildItineraryImagesByType = (entries, fallback = {}) => {
  if (!Array.isArray(entries)) {
    return cloneValue(fallback, grouptourItineraryImagesTemplate);
  }
  const bucket = {};
  entries.forEach((entry) => {
    const images = Array.isArray(entry.grouptouritineraryimagesList)
      ? entry.grouptouritineraryimagesList
      : Array.isArray(entry.grouptouritineraryimages)
      ? entry.grouptouritineraryimages
      : [];
    images.forEach((image) => {
      if (!image || typeof image !== "object") {
        return;
      }
      const itineraryImageName = toStringValue(image.itineraryImageName);
      const itineraryImageUrl = toStringValue(image.itineraryImageUrl);
      if (!itineraryImageName && !itineraryImageUrl) {
        return;
      }
      const typeValue = Number(image.type);
      const key = String(Number.isNaN(typeValue) ? 0 : typeValue);
      if (!bucket[key]) {
        bucket[key] = [];
      }
      bucket[key].push({
        itineraryImageName,
        itineraryImageUrl,
        type: Number.isNaN(typeValue) ? 0 : typeValue,
      });
    });
  });
  if (!Object.keys(bucket).length) {
    return cloneValue(fallback, grouptourItineraryImagesTemplate);
  }
  return bucket;
};

const normalizeFlightDetailsInput = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    return cloneValue(fallback, flightDetailsTemplate);
  }
  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      return {
        journey: toStringValue(entry.journey),
        flight: toStringValue(entry.flight),
        airline: toStringValue(entry.airline),
        class: toStringValue(entry.class),
        from: toStringValue(entry.from),
        fromDate: toStringValue(entry.fromDate),
        fromTime: toStringValue(entry.fromTime),
        to: toStringValue(entry.to),
        toDate: toStringValue(entry.toDate),
        toTime: toStringValue(entry.toTime),
        weight: toStringValue(entry.weight),
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    return cloneValue(fallback, flightDetailsTemplate);
  }
  return normalized;
};

const normalizeTrainDetailsInput = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    return cloneValue(fallback, trainDetailsTemplate);
  }
  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      return {
        journey: toStringValue(entry.journey),
        trainNo: toStringValue(entry.trainNo),
        trainName: toStringValue(entry.trainName),
        from: toStringValue(entry.from),
        fromDate: toStringValue(entry.fromDate),
        fromTime: toStringValue(entry.fromTime),
        to: toStringValue(entry.to),
        toDate: toStringValue(entry.toDate),
        toTime: toStringValue(entry.toTime),
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    return cloneValue(fallback, trainDetailsTemplate);
  }
  return normalized;
};

const normalizeDtodInput = (value, fallback = []) => {
  const fallbackValue = Array.isArray(fallback) && fallback.length ? fallback : dtodTemplate ? [dtodTemplate] : [];
  if (!Array.isArray(value)) {
    return cloneValue(fallbackValue, fallbackValue);
  }
  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      return {
        startCity: toStringValue(entry.startCity),
        pickUpMeet: toStringValue(entry.pickUpMeet),
        pickUpMeetTime: toStringValue(entry.pickUpMeetTime),
        arriveBefore: toStringValue(entry.arriveBefore),
        endCity: toStringValue(entry.endCity),
        dropOffPoint: toStringValue(entry.dropOffPoint),
        dropOffTime: toStringValue(entry.dropOffTime),
        bookAfter: toStringValue(entry.bookAfter),
      };
    })
    .filter(Boolean);
  if (!normalized.length) {
    return cloneValue(fallbackValue, fallbackValue);
  }
  return normalized;
};

const formatTailorMadeItineraryOverride = (value, fallback = []) => {
  if (!Array.isArray(value) || !value.length) {
    const reference = Array.isArray(fallback) && fallback.length ? fallback : detailedItineraryTemplate;
    return cloneValue(reference, detailedItineraryTemplate);
  }
  return value.map((entry) => {
    const imagesSource = Array.isArray(entry.tailormadeitineraryimagesList)
      ? entry.tailormadeitineraryimagesList
      : Array.isArray(entry.tailorMadeitineraryimages)
      ? entry.tailorMadeitineraryimages
      : Array.isArray(entry.grouptouritineraryimages)
      ? entry.grouptouritineraryimages
      : [];
    const images = cloneValue(imagesSource, []).map((image) => ({
      itineraryImageName: image.itineraryImageName || "",
      itineraryImageUrl: image.itineraryImageUrl || "",
      type: image.type ?? 0,
    }));
    return {
      ...entry,
      mealTypeId: Array.isArray(entry.mealTypeId) ? entry.mealTypeId : [],
      tailorMadeitineraryimages: images,
      tailormadeitineraryimagesList: images,
      grouptouritineraryimages: images,
    };
  });
};

const formatTailorMadeHotelPriceOverride = (value, fallback = []) => {
  if (!Array.isArray(value) || !value.length) {
    const reference = Array.isArray(fallback) && fallback.length ? fallback : tailorMadeHotelPriceTemplate;
    return cloneValue(reference, reference);
  }
  const template = tailorMadeHotelPriceTemplate;
  let cursor = 0;
  const items = [];
  const pushEntry = (entry, typeValue) => {
    if (!entry || typeof entry !== "object") {
      return;
    }
    const hasData =
      entry.hotelName !== undefined ||
      entry.roomShareName !== undefined ||
      entry.tourPrice !== undefined ||
      entry.offerPrice !== undefined ||
      entry.commissionPrice !== undefined;
    if (!hasData) {
      return;
    }
    const fallbackEntry = template[cursor % template.length] || {};
    cursor += 1;
    const resolvedType = Number.isNaN(Number(typeValue)) ? fallbackEntry.type ?? 0 : Number(typeValue);
    items.push({
      type: resolvedType,
      roomShareId: toPositiveInt(entry.roomShareId, fallbackEntry.roomShareId || cursor),
      roomShareName:
        entry.roomShareName ||
        entry.hotelName ||
        fallbackEntry.roomShareName ||
        `Option ${cursor}`,
      hotelName: entry.hotelName || fallbackEntry.hotelName || entry.roomShareName || `Option ${cursor}`,
      tourPrice: toNumber(entry.tourPrice, fallbackEntry.tourPrice || 0),
      offerPrice: toNumber(
        entry.offerPrice,
        entry.tourPrice !== undefined
          ? toNumber(entry.tourPrice, fallbackEntry.offerPrice || 0)
          : fallbackEntry.offerPrice || 0
      ),
      commissionPrice: toNumber(entry.commissionPrice, fallbackEntry.commissionPrice || 0),
    });
  };
  value.forEach((group) => {
    if (!group || typeof group !== "object") {
      return;
    }
    const typeValue = group.type;
    if (Array.isArray(group.hotels)) {
      group.hotels.forEach((hotel) => pushEntry(hotel, typeValue));
      return;
    }
    pushEntry(group, typeValue);
  });
  if (!items.length) {
    const reference = Array.isArray(fallback) && fallback.length ? fallback : tailorMadeHotelPriceTemplate;
    return cloneValue(reference, reference);
  }
  return items;
};

const findDestination = (destinationId) =>
  destinations.find((item) => item.destinationId === destinationId) || destinations[0];

const findCountry = (countryId, destinationId) => {
  if (countryId) {
    const existing = countries.find((item) => item.countryId === countryId);
    if (existing) {
      return existing;
    }
  }
  return countries.find((item) => item.destinationId === destinationId) || countries[0];
};

const findState = (stateId) => states.find((item) => item.stateId === stateId) || states[0];

const findDepartureType = (departureTypeId, destinationId) => {
  if (departureTypeId) {
    const existing = departureTypes.find((item) => item.departureTypeId === departureTypeId);
    if (existing) {
      return existing;
    }
  }
  return departureTypes.find((item) => item.destinationId === destinationId) || departureTypes[0];
};

const findVehicle = (vehicleId) => vehicles.find((item) => item.vehicleId === vehicleId) || vehicles[0];
const findMealPlan = (mealPlanId) => mealPlans.find((item) => item.mealPlanId === mealPlanId) || mealPlans[0];
const findMealType = (mealTypeId) => mealTypes.find((item) => item.mealTypeId === mealTypeId) || mealTypes[0];
const findKitchen = (kitchenId) => kitchens.find((item) => item.kitchenId === kitchenId) || kitchens[0];

const resolveCityIds = (tour, override = {}) => {
  if (Array.isArray(override.cityIds) && override.cityIds.length) {
    return override.cityIds;
  }
  if (Array.isArray(tour.cityIds) && tour.cityIds.length) {
    return tour.cityIds;
  }
  if (tour.cityId) {
    return [tour.cityId];
  }
  return [];
};

const mapCities = (cityIds) =>
  cityIds
    .map((cityId) => cities.find((city) => city.citiesId === cityId))
    .filter(Boolean)
    .map((city) => ({ citiesId: city.citiesId, citiesName: city.citiesName }));

const buildCustomEnquiryDetail = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return null;
  }
  const base = customTours.find((item) => Number(item.enquiryCustomId) === id) || {};
  const override = customEnquiryDetails[id] || {};
  if (!Object.keys(base).length && !Object.keys(override).length) {
    return null;
  }

  const destination = findDestination(override.destinationId || base.destinationId || customEnquiryDetailTemplate.destinationId);
  const country = findCountry(
    override.countryId || base.countryId || customEnquiryDetailTemplate.countryId,
    destination.destinationId
  );
  const stateData = findState(override.stateId || base.stateId || customEnquiryDetailTemplate.stateId);

  const rawCityIds = Array.isArray(override.cityIds)
    ? override.cityIds
    : base.cityId
    ? [base.cityId]
    : customEnquiryDetailTemplate.cityIds;
  const cityIds = rawCityIds.filter((value) => toPositiveInt(value, null));
  const cityDetails = mapCities(cityIds);

  const ageArray = Array.isArray(override.age)
    ? override.age
    : Array.isArray(customEnquiryDetailTemplate.age)
    ? customEnquiryDetailTemplate.age
    : [];

  const nightsValue =
    override.nights ?? base.nights ?? base.night ?? customEnquiryDetailTemplate.nights;
  const daysValue = override.days ?? base.days ?? customEnquiryDetailTemplate.days;

  const mealPlan = findMealPlan(override.mealPlanId || customEnquiryDetailTemplate.mealPlanId);
  const mealPlanName = override.mealPlanName || mealPlan.mealPlanName;

  return {
    ...customEnquiryDetailTemplate,
    ...base,
    ...override,
    enquiryCustomId: id,
    uniqueEnqueryId:
      override.uniqueEnqueryId || base.uniqueEnqueryId || customEnquiryDetailTemplate.uniqueEnqueryId || `CT-${id}`,
    destinationId: destination.destinationId,
    destinationName: destination.destinationName,
    countryId: country.countryId,
    countryName: country.countryName,
    stateId: stateData.stateId,
    stateName: stateData.stateName,
    startDate: override.startDate || base.startDate || customEnquiryDetailTemplate.startDate,
    endDate: override.endDate || base.endDate || customEnquiryDetailTemplate.endDate,
    travelMonth:
      override.travelMonth || base.travelMonth || (override.startDate || base.startDate || "").toString().slice(0, 7),
    days: daysValue,
    nights: nightsValue,
    duration:
      override.duration ||
      base.duration ||
      (daysValue && nightsValue ? `${daysValue}D-${nightsValue}N` : customEnquiryDetailTemplate.duration),
    adults: override.adults ?? base.adults ?? customEnquiryDetailTemplate.adults,
    child: override.child ?? base.child ?? customEnquiryDetailTemplate.child,
    age: JSON.stringify(ageArray),
    cityIds,
    cities: JSON.stringify(cityIds),
    cityDetails,
    rooms: override.rooms ?? customEnquiryDetailTemplate.rooms,
    extraBed: override.extraBed ?? customEnquiryDetailTemplate.extraBed,
    familyHeadNo: override.familyHeadNo ?? customEnquiryDetailTemplate.familyHeadNo,
    mealPlanId: mealPlan.mealPlanId,
    mealPlanName,
    hotelCatId: override.hotelCatId ?? customEnquiryDetailTemplate.hotelCatId,
    hotelCatName: override.hotelCatName || customEnquiryDetailTemplate.hotelCatName,
    enquiryReferId: override.enquiryReferId ?? customEnquiryDetailTemplate.enquiryReferId,
    enquiryReferName: override.enquiryReferName || customEnquiryDetailTemplate.enquiryReferName,
    guestRefId: override.guestRefId || customEnquiryDetailTemplate.guestRefId,
    priorityId: override.priorityId ?? customEnquiryDetailTemplate.priorityId,
    priorityName: override.priorityName || customEnquiryDetailTemplate.priorityName,
    budgetPerPerson: override.budgetPerPerson || customEnquiryDetailTemplate.budgetPerPerson,
    notes: override.notes ?? customEnquiryDetailTemplate.notes,
    nextFollowUp: override.nextFollowUp || customEnquiryDetailTemplate.nextFollowUp,
    requirements: cloneValue(override.requirements, customEnquiryDetailTemplate.requirements),
    experiences: cloneValue(override.experiences, customEnquiryDetailTemplate.experiences),
    travelReason: override.travelReason || customEnquiryDetailTemplate.travelReason,
    specialOccasion: override.specialOccasion || customEnquiryDetailTemplate.specialOccasion,
    destinationHighlights: cloneValue(
      override.destinationHighlights,
      customEnquiryDetailTemplate.destinationHighlights
    ),
    isRework: Boolean(override.isRework ?? customEnquiryDetailTemplate.isRework),
    isEnqNonEditable: Boolean(
      override.isEnqNonEditable ?? customEnquiryDetailTemplate.isEnqNonEditable
    ),
    workflowStage: override.workflowStage || base.workflowStage || customEnquiryDetailTemplate.workflowStage,
    status: override.status || base.status || customEnquiryDetailTemplate.status,
    createdAt: override.createdAt || customEnquiryDetailTemplate.createdAt,
    updatedAt: override.updatedAt || customEnquiryDetailTemplate.updatedAt,
  };
};

const listCustomEnquiryPackages = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return { enquiryCustomId: null, data: [], total: 0, message: "Invalid enquiryCustomId" };
  }
  const source = customEnquiryPackages[id] || customPackageTemplate;
  const data = cloneValue(source, customPackageTemplate).map((pkg, index) => ({
    packageCustomId: pkg.packageCustomId || Number(`${id}${index + 1}`),
    enquiryCustomId: id,
    packageName: pkg.packageName || customPackageTemplate[0].packageName,
    packageLabel: pkg.packageLabel || `Option ${index + 1}`,
    package: pkg.package || customPackageTemplate[0].package,
    adult: pkg.adult ?? customPackageTemplate[0].adult,
    extraBed: pkg.extraBed ?? customPackageTemplate[0].extraBed,
    childWithout: pkg.childWithout ?? customPackageTemplate[0].childWithout,
    childWith: pkg.childWith ?? pkg.childWithout ?? customPackageTemplate[0].childWith,
    isFinal: pkg.isFinal ?? customPackageTemplate[0].isFinal,
    isRework: Boolean(pkg.isRework ?? customPackageTemplate[0].isRework),
    createdAt: pkg.createdAt || customPackageTemplate[0].createdAt,
  }));
  return {
    enquiryCustomId: id,
    data,
    total: data.length,
    message: "Customized packages fetched successfully",
  };
};

const buildGroupTourDetail = (tour) => {
  if (!tour) {
    return null;
  }
  const override = groupTourDetailOverrides[tour.groupTourId] || {};
  const destination = findDestination(override.destinationId || tour.destinationId);
  const country = findCountry(override.countryId || tour.countryId, destination.destinationId);
  const stateData = findState(override.stateId || tour.stateId || states[0].stateId);
  const departure = findDepartureType(override.departureTypeId || tour.departureTypeId, destination.destinationId);
  const vehicle = findVehicle(override.vehicleId || tour.vehicleId);
  const mealPlan = findMealPlan(override.mealPlanId || tour.mealPlanId);
  const mealType = findMealType(override.mealTypeId || tour.mealTypeId);
  const kitchen = findKitchen(override.kitchenId || tour.kitchenId);
  const cityIds = resolveCityIds(tour, override);
  const city = mapCities(cityIds);
  const dtodEntry = cloneValue(dtodTemplate, {});
  dtodEntry.startCity = override.startCity || dtodEntry.startCity || (city[0]?.citiesName || "");
  dtodEntry.endCity = override.endCity || dtodEntry.endCity || destination.destinationName;
  dtodEntry.pickUpMeet = override.pickUpMeet || dtodEntry.pickUpMeet || "";
  dtodEntry.dropOffPoint = override.dropOffPoint || dtodEntry.dropOffPoint || "";
  dtodEntry.pickUpMeetTime = override.pickUpMeetTime || dtodEntry.pickUpMeetTime || "";
  dtodEntry.dropOffTime = override.dropOffTime || dtodEntry.dropOffTime || "";
  dtodEntry.arriveBefore = override.arriveBefore || dtodEntry.arriveBefore || "";
  dtodEntry.bookAfter = override.bookAfter || dtodEntry.bookAfter || "";

  const media = {
    bgImage: override.bgImage || tour.bgImage || tour.bgImageUrl || DEFAULT_BG_IMAGE,
    websiteBanner:
      override.websiteBanner || tour.websiteBanner || tour.websiteBannerUrl || DEFAULT_WEBSITE_BANNER,
    websiteDescription:
      override.websiteDescription || tour.websiteDescription || DEFAULT_WEBSITE_DESCRIPTION,
  };

  return {
    ...tour,
    destinationId: destination.destinationId,
    destinationName: destination.destinationName,
    departureTypeId: departure.departureTypeId,
    departureName: departure.departureName,
    countryId: country.countryId,
    countryName: country.countryName,
    stateId: stateData.stateId,
    stateName: stateData.stateName,
    vehicleId: vehicle.vehicleId,
    vehicleName: vehicle.vehicleName,
    mealPlanId: mealPlan.mealPlanId,
    mealPlanName: mealPlan.mealPlanName,
    mealTypeId: mealType.mealTypeId,
    mealTypeName: mealType.mealTypeName,
    kitchenId: kitchen.kitchenId,
    kitchenName: kitchen.kitchenName,
    cityIds,
    city,
    tourPrice: cloneValue(tour.tourPrice, roomSharingPriceTemplate),
    flightDetails: cloneValue(tour.flightDetails, flightDetailsTemplate),
    trainDetails: cloneValue(tour.trainDetails, trainDetailsTemplate),
    dtod: tour.dtod?.length ? cloneValue(tour.dtod, []) : [dtodEntry],
    inclusions: cloneValue(tour.inclusions, inclusionsTemplate),
    exclusions: cloneValue(tour.exclusions, exclusionsTemplate),
    skeletonItinerary: cloneValue(tour.skeletonItinerary, skeletonItineraryTemplate),
    detailedItinerary: cloneValue(tour.detailedItinerary, detailedItineraryTemplate),
    grouptouritineraryimages: cloneValue(
      tour.grouptouritineraryimages,
      grouptourItineraryImagesTemplate
    ),
    notes: normalizeNotes(tour.notes, notesTemplate),
    visaDocuments: tour.visaDocuments || override.visaDocuments || "Passport valid for 6 months",
    visaFee: tour.visaFee || override.visaFee || "4500",
    visaInstruction:
      tour.visaInstruction || override.visaInstruction || "Submit documents 15 days prior",
    visaAlerts: tour.visaAlerts || override.visaAlerts || "Visa on arrival available",
    insuranceDetails:
      tour.insuranceDetails || override.insuranceDetails || "Comprehensive travel insurance included",
    euroTrainDetails:
      tour.euroTrainDetails || override.euroTrainDetails || "Not applicable for this departure",
    nriOriForDetails:
      tour.nriOriForDetails || override.nriOriForDetails || "Carry OCI/PIO documents for verification",
    shopping: tour.shopping || override.shopping || "Explore curated local markets",
    weather: tour.weather || override.weather || "Pleasant seasonal weather",
    uniqueExperience: tour.uniqueExperience || override.uniqueExperience || "Signature Waari experience",
    tourManager: tour.tourManager || override.tourManager || "Waari Tour Manager",
    managerNo: tour.managerNo || override.managerNo || "9876543210",
    bgImage: media.bgImage,
    websiteBanner: media.websiteBanner,
    websiteDescription: media.websiteDescription,
    bgImageUrl: media.bgImage,
    websiteBannerUrl: media.websiteBanner,
  };
};

const buildGroupTourPublicPayload = (tour) => {
  if (!tour) {
    return null;
  }
  const detailGroupTour = [
    {
      groupTourId: tour.groupTourId,
      tourName: tour.tourName,
      tourCode: tour.tourCode,
      tourTypeId: tour.tourTypeId,
      tourTypeName: tour.tourTypeName,
      destinationId: tour.destinationId,
      destinationName: tour.destinationName,
      departureTypeId: tour.departureTypeId,
      departureName: tour.departureName,
      countryId: tour.countryId,
      countryName: tour.countryName,
      stateId: tour.stateId,
      stateName: tour.stateName,
      startDate: tour.startDate,
      endDate: tour.endDate,
      days: tour.days,
      night: tour.night,
      totalSeats: tour.totalSeats,
      seatAvailability: tour.seatsAval,
      vehicleName: tour.vehicleName,
      mealPlanName: tour.mealPlanName,
      mealTypeName: tour.mealTypeName,
      kitchenName: tour.kitchenName,
      tourManager: tour.tourManager,
      managerNo: tour.managerNo,
      uniqueExperience: tour.uniqueExperience,
      bgImage: tour.bgImage,
      websiteBanner: tour.websiteBanner,
      websiteDescription: tour.websiteDescription,
      pdfUrl: tour.pdfUrl,
    },
  ];

  return {
    detailGroupTour,
    city: tour.city,
    skeletonItinerary: cloneValue(tour.skeletonItinerary, []),
    tourPrice: cloneValue(tour.tourPrice, []),
    detailedItinerary: cloneValue(tour.detailedItinerary, []),
    flightDetails: cloneValue(tour.flightDetails, []),
    trainDetails: cloneValue(tour.trainDetails, []),
    visaDocuments: tour.visaDocuments
      ? [
          {
            visaDocuments: tour.visaDocuments,
            visaFee: tour.visaFee,
            visaInstruction: tour.visaInstruction,
            visaAlerts: tour.visaAlerts,
            insuranceDetails: tour.insuranceDetails,
            euroTrainDetails: tour.euroTrainDetails,
            nriOriForDetails: tour.nriOriForDetails,
          },
        ]
      : [],
    seatsAvailable: tour.seatsAval,
    dtod: tour.dtod?.[0] || {},
    inclusions: cloneValue(tour.inclusions, []),
    exclusions: cloneValue(tour.exclusions, []),
    notes: cloneValue(tour.notes, []),
    grouptouritineraryimages: cloneValue(tour.grouptouritineraryimages, {}),
    printUrl: tour.pdfUrl || "",
  };
};

const buildTailorMadeDetail = (tour) => {
  if (!tour) {
    return null;
  }
  const override = tailorMadeDetailOverrides[tour.tailorMadeId] || {};
  const destination = findDestination(override.destinationId || tour.destinationId || destinations[0].destinationId);
  const country = findCountry(override.countryId || tour.countryId, destination.destinationId);
  const stateData = findState(override.stateId || tour.stateId || states[0].stateId);
  const departure = findDepartureType(override.departureTypeId || tour.departureTypeId, destination.destinationId);
  const vehicle = findVehicle(override.vehicleId || tour.vehicleId);
  const mealPlan = findMealPlan(override.mealPlanId || tour.mealPlanId);
  const mealType = findMealType(override.mealTypeId || tour.mealTypeId);
  const kitchen = findKitchen(override.kitchenId || tour.kitchenId);
  const cityIds = resolveCityIds(tour, override);
  const city = mapCities(cityIds);
  const dtodEntry = cloneValue(dtodTemplate, {});
  dtodEntry.startCity = override.startCity || dtodEntry.startCity || (city[0]?.citiesName || "");
  dtodEntry.endCity = override.endCity || dtodEntry.endCity || destination.destinationName;
  dtodEntry.pickUpMeet = override.pickUpMeet || dtodEntry.pickUpMeet || "";
  dtodEntry.dropOffPoint = override.dropOffPoint || dtodEntry.dropOffPoint || "";
  dtodEntry.pickUpMeetTime = override.pickUpMeetTime || dtodEntry.pickUpMeetTime || "";
  dtodEntry.dropOffTime = override.dropOffTime || dtodEntry.dropOffTime || "";

  const media = {
    bgImage: override.bgImage || tour.bgImage || tour.bgImageUrl || DEFAULT_BG_IMAGE,
    websiteBanner:
      override.websiteBanner || tour.websiteBanner || tour.websiteBannerUrl || DEFAULT_WEBSITE_BANNER,
    websiteDescription:
      override.websiteDescription || tour.websiteDescription || DEFAULT_WEBSITE_DESCRIPTION,
  };

  const seatsAval =
    tour.seatsAval !== undefined
      ? tour.seatsAval
      : Math.max(0, (tour.totalSeats || 0) - (tour.seatsBook || 0));

  const detailedItinerary = normalizeTailorMadeItinerary(override.detailedItinerary || tour.detailedItinerary);
  const hotelPrice = normalizeTailorMadePrices(override.tourPrice || tour.tourPrice);
  const normalizedNotes = normalizeNotes(override.notes ?? tour.notes, override.notes || notesTemplate);

  return {
    ...tour,
    destinationId: destination.destinationId,
    destinationName: destination.destinationName,
    departureTypeId: departure.departureTypeId,
    departureName: departure.departureName,
    countryId: country.countryId,
    countryName: country.countryName,
    stateId: stateData.stateId,
    stateName: stateData.stateName,
    vehicleId: vehicle.vehicleId,
    vehicleName: vehicle.vehicleName,
    mealPlanId: mealPlan.mealPlanId,
    mealPlanName: mealPlan.mealPlanName,
    mealTypeId: mealType.mealTypeId,
    mealTypeName: mealType.mealTypeName,
    kitchenId: kitchen.kitchenId,
    kitchenName: kitchen.kitchenName,
    cityIds,
    city,
    dtod: tour.dtod?.length ? cloneValue(tour.dtod, []) : [dtodEntry],
    tourPrice: hotelPrice,
    skeletonItinerary: cloneValue(tour.skeletonItinerary, skeletonItineraryTemplate),
    detailedItinerary,
    tailormadeinclusions: cloneValue(
      override.tailormadeinclusions ?? tour.tailormadeinclusions,
      override.tailormadeinclusions || inclusionsTemplate
    ),
    tailormadeexclusions: cloneValue(
      override.tailormadeexclusions ?? tour.tailormadeexclusions,
      override.tailormadeexclusions || exclusionsTemplate
    ),
    note: normalizedNotes,
    notes: normalizedNotes,
    visaDocuments: tour.visaDocuments || override.visaDocuments || "Passport valid for 6 months",
    visaFee: tour.visaFee || override.visaFee || "4500",
    visaInstruction:
      tour.visaInstruction || override.visaInstruction || "Submit documents 15 days prior",
    visaAlerts: tour.visaAlerts || override.visaAlerts || "Visa on arrival available",
    insuranceDetails:
      tour.insuranceDetails || override.insuranceDetails || "Comprehensive travel insurance included",
    euroTrainDetails:
      tour.euroTrainDetails || override.euroTrainDetails || "Not applicable for this departure",
    nriOriForDetails:
      tour.nriOriForDetails || override.nriOriForDetails || "Carry OCI/PIO documents for verification",
    uniqueExperience: tour.uniqueExperience || override.uniqueExperience || "Signature Waari experience",
    shopping: tour.shopping || override.shopping || "Explore curated local markets",
    weather: tour.weather || override.weather || "Pleasant seasonal weather",
    tourManager: tour.tourManager || override.tourManager || "Waari Tour Manager",
    managerNo: tour.managerNo || override.managerNo || "9876543210",
    seatsAval,
    bgImage: media.bgImage,
    websiteBanner: media.websiteBanner,
    websiteDescription: media.websiteDescription,
    bgImageUrl: media.bgImage,
    websiteBannerUrl: media.websiteBanner,
  };
};

const buildTailorMadePublicPayload = (tour) => {
  if (!tour) {
    return null;
  }
  const detailTailorMade = [
    {
      tailorMadeId: tour.tailorMadeId,
      tourName: tour.tourName,
      tourCode: tour.tourCode,
      tourTypeId: tour.tourTypeId,
      tourTypeName: tour.tourTypeName,
      destinationId: tour.destinationId,
      destinationName: tour.destinationName,
      departureTypeId: tour.departureTypeId,
      departureName: tour.departureName,
      countryId: tour.countryId,
      countryName: tour.countryName,
      stateId: tour.stateId,
      stateName: tour.stateName,
      startDate: tour.startDate,
      endDate: tour.endDate,
      days: tour.days,
      night: tour.night,
      totalSeats: tour.totalSeats,
      seatAvailability: tour.seatsAval,
      vehicleName: tour.vehicleName,
      mealPlanName: tour.mealPlanName,
      mealTypeName: tour.mealTypeName,
      kitchenName: tour.kitchenName,
      tourManager: tour.tourManager,
      managerNo: tour.managerNo,
      uniqueExperience: tour.uniqueExperience,
      bgImage: tour.bgImage,
      websiteBanner: tour.websiteBanner,
      websiteDescription: tour.websiteDescription,
      pdfUrl: tour.pdfUrl,
    },
  ];

  return {
    detailTailorMade,
    skeletonItinerary: cloneValue(tour.skeletonItinerary, []),
    tourPrice: cloneValue(tour.tourPrice, []),
    detailedItinerary: cloneValue(tour.detailedItinerary, []),
    visaDocuments: tour.visaDocuments
      ? [
          {
            visaDocuments: tour.visaDocuments,
            visaFee: tour.visaFee,
            visaInstruction: tour.visaInstruction,
            visaAlerts: tour.visaAlerts,
            insuranceDetails: tour.insuranceDetails,
            euroTrainDetails: tour.euroTrainDetails,
            nriOriForDetails: tour.nriOriForDetails,
          },
        ]
      : [],
    seatsAvailable: tour.seatsAval,
    tailormadeinclusions: cloneValue(tour.tailormadeinclusions, []),
    tailormadeexclusions: cloneValue(tour.tailormadeexclusions, []),
    notes: cloneValue(tour.notes, []),
    grouptouritineraryimages: cloneValue(tour.grouptouritineraryimages, {}),
    dtod: tour.dtod?.[0] || {},
    printUrl: tour.pdfUrl || "",
  };
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

const DEFAULT_FOLLOW_UP_USER_ID = 9001;

const groupFollowUpPlan = [
  {
    groupTourId: 101,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: "Ananya Sharma",
    guestName: "Corporate Delegation",
    paxNo: 24,
    nextFollowUpOffset: 0,
    enquiryDateOffset: -12,
    nextFollowUpTime: "10:00 AM",
  },
  {
    groupTourId: 102,
    assignedUserId: 9002,
    assignedUserName: "Vikram Rao",
    guestName: "Khanna Family",
    paxNo: 28,
    nextFollowUpOffset: 4,
    enquiryDateOffset: -9,
    nextFollowUpTime: "03:30 PM",
  },
  {
    groupTourId: 103,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: "Ananya Sharma",
    guestName: "Swiss Delegation",
    paxNo: 12,
    nextFollowUpOffset: -2,
    enquiryDateOffset: -15,
    nextFollowUpTime: "12:15 PM",
  },
  {
    groupTourId: 201,
    assignedUserId: 9003,
    assignedUserName: "Lisa Pereira",
    guestName: "Andaman Explorers",
    paxNo: 8,
    nextFollowUpOffset: -5,
    enquiryDateOffset: -18,
    nextFollowUpTime: "05:45 PM",
  },
];

const customFollowUpPlan = [
  {
    enquiryCustomId: 301,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: "Ananya Sharma",
    nextFollowUpOffset: 0,
    enquiryDateOffset: -10,
    nextFollowUpTime: "09:30 AM",
  },
  {
    enquiryCustomId: 302,
    assignedUserId: 9002,
    assignedUserName: "Vikram Rao",
    nextFollowUpOffset: 5,
    enquiryDateOffset: -8,
    nextFollowUpTime: "02:00 PM",
  },
  {
    enquiryCustomId: 303,
    assignedUserId: 9003,
    assignedUserName: "Lisa Pereira",
    nextFollowUpOffset: -3,
    enquiryDateOffset: -14,
    nextFollowUpTime: "11:45 AM",
  },
  {
    enquiryCustomId: 302,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: "Ananya Sharma",
    nextFollowUpOffset: -1,
    enquiryDateOffset: -20,
    nextFollowUpTime: "04:15 PM",
  },
];

const groupPlanEnquiries = [
  {
    planEnqId: 8101,
    enquiryGroupId: 501,
    groupTourId: 101,
    firstName: "Ritesh Kulkarni",
    contactNo: "9820000011",
    email: "ritesh.kulkarni@waari.travel",
    groupName: "Kulkarni Corporate",
    noOfTravelPeople: 4,
    enquiryReferId: 1,
    enquiryDateOffset: -4,
    nextFollowUpOffset: 2,
  },
  {
    planEnqId: 8102,
    enquiryGroupId: 502,
    groupTourId: 102,
    firstName: "Nikita Agarwal",
    contactNo: "9812233445",
    groupName: "Agarwal Family",
    noOfTravelPeople: 5,
    enquiryReferId: 2,
    assignedUserId: 9002,
    assignedUserName: "Vikram Rao",
    enquiryDateOffset: -6,
    nextFollowUpOffset: 1,
  },
  {
    planEnqId: 8103,
    enquiryGroupId: 503,
    groupTourId: 103,
    firstName: "Gaurav Shah",
    contactNo: "9898989898",
    groupName: "Shah Entrepreneurs",
    noOfTravelPeople: 3,
    enquiryReferId: 3,
    enquiryDateOffset: -8,
    nextFollowUpOffset: 3,
  },
  {
    planEnqId: 8104,
    enquiryGroupId: 504,
    groupTourId: 201,
    firstName: "Shruti Menon",
    contactNo: "9977886655",
    groupName: "Menon Friends",
    noOfTravelPeople: 6,
    enquiryReferId: 4,
    assignedUserId: 9003,
    assignedUserName: "Lisa Pereira",
    enquiryDateOffset: -5,
    nextFollowUpOffset: 4,
  },
];

const customPlanEnquiries = [
  {
    planEnqId: 9101,
    enquiryCustomId: 301,
    firstName: "Meghna Bhosale",
    groupName: "Bhosale Anniversary Trip",
    contactNo: "9821550080",
    noOfTravelPeople: 4,
    pricePerPersonMin: 52000,
    pricePerPersonMax: 69000,
    enquiryReferId: 2,
    travelStartOffset: 15,
    travelEndOffset: 21,
  },
  {
    planEnqId: 9102,
    enquiryCustomId: 302,
    firstName: "Deepak Iyer",
    groupName: "Iyer Family Europe",
    contactNo: "9811112211",
    noOfTravelPeople: 5,
    pricePerPersonMin: 85000,
    pricePerPersonMax: 99000,
    enquiryReferId: 3,
    travelStartOffset: 25,
    travelEndOffset: 33,
  },
  {
    planEnqId: 9103,
    enquiryCustomId: 303,
    firstName: "Ruchi Desai",
    groupName: "Desai Wellness Retreat",
    contactNo: "9833445566",
    noOfTravelPeople: 2,
    pricePerPersonMin: 46000,
    pricePerPersonMax: 58000,
    enquiryReferId: 1,
    travelStartOffset: 10,
    travelEndOffset: 16,
  },
  {
    planEnqId: 9104,
    enquiryCustomId: 302,
    firstName: "Karthik Nambiar",
    groupName: "Nambiar Adventure Crew",
    contactNo: "9876501234",
    noOfTravelPeople: 6,
    pricePerPersonMin: 68000,
    pricePerPersonMax: 82000,
    enquiryReferId: 4,
    travelStartOffset: 18,
    travelEndOffset: 27,
  },
];

const futureEnquirySeeds = [
  {
    futureEnqId: 6001,
    name: "Anish Kulkarni",
    email: "anish.k@waari.travel",
    phoneNo: "9811112233",
    city: ["London", "Zurich"],
    address: "Baner, Pune",
    startOffset: 45,
    endOffset: 52,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    futureEnqId: 6002,
    name: "Bhavna Deshpande",
    email: "bhavna.d@waari.travel",
    phoneNo: "9922554411",
    city: ["Melbourne", "Sydney"],
    address: "Thane West, Mumbai",
    startOffset: 60,
    endOffset: 68,
    assignedUserId: 9002,
  },
  {
    futureEnqId: 6003,
    name: "Chris Patel",
    email: "chris.patel@waari.travel",
    phoneNo: "9876500001",
    city: ["Tokyo", "Kyoto"],
    address: "Prahlad Nagar, Ahmedabad",
    startOffset: 32,
    endOffset: 37,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    futureEnqId: 6004,
    name: "Divya Rathi",
    email: "divya.rathi@waari.travel",
    phoneNo: "9000001188",
    city: ["Reykjavik", "Blue Lagoon"],
    address: "Jubilee Hills, Hyderabad",
    startOffset: 80,
    endOffset: 86,
    assignedUserId: 9003,
  },
];

const customFutureEnquirySeeds = [
  {
    futureEnqId: 6101,
    name: "Esha Wadhwa",
    email: "esha.w@waari.travel",
    phoneNo: "9819981998",
    city: ["Santorini", "Athens"],
    address: "Khar, Mumbai",
    startOffset: 34,
    endOffset: 41,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    futureEnqId: 6102,
    name: "Farhan Ali",
    email: "farhan.ali@waari.travel",
    phoneNo: "9702001010",
    city: ["Banff", "Vancouver"],
    address: "Indiranagar, Bengaluru",
    startOffset: 48,
    endOffset: 55,
    assignedUserId: 9002,
  },
  {
    futureEnqId: 6103,
    name: "Gargi Tiwari",
    email: "gargi.t@waari.travel",
    phoneNo: "9611223344",
    city: ["Maui", "Honolulu"],
    address: "Satellite, Ahmedabad",
    startOffset: 72,
    endOffset: 79,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
];

const groupLostEnquiries = [
  {
    lostEnqId: 7001,
    uniqueEnqueryId: "GT-4501",
    enqDateOffset: -28,
    guestName: "Himanshu Soni",
    contact: "9922114400",
    destinationName: "Kashmir",
    pax: 18,
    lastFollowOffset: -10,
    closureReason: "Shifted travel window",
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    lostEnqId: 7002,
    uniqueEnqueryId: "GT-4502",
    enqDateOffset: -35,
    guestName: "Ishita Borkar",
    contact: "9812230011",
    destinationName: "Singapore",
    pax: 8,
    lastFollowOffset: -14,
    closureReason: "Opted for competitor",
    assignedUserId: 9002,
  },
  {
    lostEnqId: 7003,
    uniqueEnqueryId: "GT-4503",
    enqDateOffset: -22,
    guestName: "Jigar Khanna",
    contact: "9004412233",
    destinationName: "Bali",
    pax: 6,
    lastFollowOffset: -7,
    closureReason: "Budget mismatch",
    assignedUserId: 9003,
  },
];

const customLostEnquiries = [
  {
    lostEnqId: 7101,
    uniqueEnqueryId: "CT-3301",
    enqDateOffset: -30,
    guestName: "Kavya Rao",
    contact: "9887766554",
    destinationName: "Swiss Explorer",
    pax: 4,
    lastFollowOffset: -11,
    closureReason: "Postponed to next year",
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    lostEnqId: 7102,
    uniqueEnqueryId: "CT-3302",
    enqDateOffset: -40,
    guestName: "Laksh Sharma",
    contact: "9011122233",
    destinationName: "Kenya Safari",
    pax: 5,
    lastFollowOffset: -15,
    closureReason: "Visa rejected",
    assignedUserId: 9002,
  },
  {
    lostEnqId: 7103,
    uniqueEnqueryId: "CT-3303",
    enqDateOffset: -18,
    guestName: "Maya Dutta",
    contact: "9766004455",
    destinationName: "Scandinavian Lights",
    pax: 2,
    lastFollowOffset: -6,
    closureReason: "Chose different theme",
    assignedUserId: 9003,
  },
];

const formatDateOnly = (date) => date.toISOString().slice(0, 10);

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDaysToDate = (baseDate, offset = 0) => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offset);
  return date;
};

const sanitizeText = (value) => (typeof value === "string" ? value.trim() : value || "");

const classifyFollowUpByDate = (dateStr) => {
  const todayStr = formatDateOnly(startOfToday());
  if (!dateStr) {
    return "upcoming";
  }
  if (dateStr === todayStr) {
    return "today";
  }
  if (dateStr < todayStr) {
    return "expired";
  }
  return "upcoming";
};

const matchesTimeframe = (record, timeframe) => {
  if (!timeframe || timeframe === "all") {
    return true;
  }
  return classifyFollowUpByDate(record.nextFollowUp) === timeframe;
};

const matchesScope = (record, scope, currentUserId) => {
  if (scope === "mine") {
    return Number(record.assignedUserId) === Number(currentUserId);
  }
  if (scope === "assigned") {
    return Boolean(record.assignedUserId);
  }
  return true;
};

const isWithinDateRange = (value, from, to) => {
  const start = sanitizeText(from);
  const end = sanitizeText(to);
  if (!start && !end) {
    return true;
  }
  if (start && value < start) {
    return false;
  }
  if (end && value > end) {
    return false;
  }
  return true;
};

const filterGroupFollowupRecord = (record, filters = {}) => {
  const search = sanitizeText(filters.search);
  if (
    search &&
    !matchesText(record.groupName, search) &&
    !matchesText(record.uniqueEnqueryId, search) &&
    !matchesText(record.guestName, search)
  ) {
    return false;
  }
  const tourName = sanitizeText(filters.tourName);
  if (tourName && !matchesText(record.tourName, tourName)) {
    return false;
  }
  const groupName = sanitizeText(filters.groupName);
  if (groupName && !matchesText(record.groupName, groupName)) {
    return false;
  }
  const guestName = sanitizeText(filters.guestName);
  if (guestName && !matchesText(record.guestName, guestName)) {
    return false;
  }
  return isWithinDateRange(record.nextFollowUp, filters.startDate, filters.endDate);
};

const filterCustomFollowupRecord = (record, filters = {}) => {
  const search = sanitizeText(filters.search);
  if (
    search &&
    !matchesText(record.groupName, search) &&
    !matchesText(record.uniqueEnqueryId, search) &&
    !matchesText(record.guestName, search)
  ) {
    return false;
  }
  const tourName = sanitizeText(filters.tourName);
  if (tourName && !matchesText(record.tourName, tourName)) {
    return false;
  }
  const groupName = sanitizeText(filters.groupName);
  if (groupName && !matchesText(record.groupName, groupName)) {
    return false;
  }
  const guestName = sanitizeText(filters.guestName);
  if (guestName && !matchesText(record.guestName, guestName)) {
    return false;
  }
  return isWithinDateRange(record.nextFollowUp, filters.startDate, filters.endDate);
};

const resolvePlanEnquiryReference = (plan = {}, fallbackId) => {
  const referenceId =
    toPositiveInt(plan.enquiryReferId, null) || toPositiveInt(fallbackId, null) || fallbackEnquiryReferenceId();
  const reference = enquiryReferences.find((item) => Number(item.enquiryReferId) === Number(referenceId));
  return {
    enquiryReferId: referenceId,
    enquiryReferName: reference ? reference.enquiryReferName : "",
  };
};

const createGroupPlanEnquiryRecord = (plan, baseDate, index) => {
  const tour = resolveGroupTourRecord(plan.groupTourId || plan.enquiryGroupId);
  if (!tour) {
    return null;
  }
  const reference = resolvePlanEnquiryReference(plan, tour.enquiryReferId);
  const assignedMeta =
    plan.assignedUserId || plan.assignedUserName
      ? {
          assignedUserId: toPositiveInt(plan.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
          assignedUserName: plan.assignedUserName || "Waari Team",
        }
      : resolveAssignedUser(tour);
  const enquiryGroupId = plan.enquiryGroupId || tour.groupTourId;
  const enquiryOffset = plan.enquiryDateOffset ?? -(index + 2);
  const followUpOffset = plan.nextFollowUpOffset ?? index + 1;
  return {
    id: plan.planEnqId,
    planEnqId: plan.planEnqId,
    enquiryGroupId,
    groupTourId: tour.groupTourId,
    tourName: tour.tourName,
    groupName: plan.groupName || tour.groupName || tour.tourName,
    firstName: plan.firstName || deriveGuestName(tour),
    contactNo: plan.contactNo || resolveContact(tour),
    email: plan.email || tour.email || "",
    noOfTravelPeople: plan.noOfTravelPeople || Math.min(6, resolveGroupPaxCount(tour)),
    enquiryReferId: reference.enquiryReferId,
    enquiryReferName: reference.enquiryReferName,
    startDate: tour.startDate,
    endDate: tour.endDate,
    enquiryDate: formatDateOnly(addDaysToDate(baseDate, enquiryOffset)),
    nextFollowUp: formatDateOnly(addDaysToDate(baseDate, followUpOffset)),
    assignedUserId: assignedMeta.assignedUserId,
    assignedUserName: assignedMeta.assignedUserName,
  };
};

const createCustomPlanEnquiryRecord = (plan, baseDate, index) => {
  const detail = buildCustomEnquiryDetail(plan.enquiryCustomId) || { enquiryCustomId: plan.enquiryCustomId };
  const reference = resolvePlanEnquiryReference(plan, detail.enquiryReferId);
  const adults = toPositiveInt(plan.adults, null) || toPositiveInt(detail.adults, null) || 2;
  const child = toPositiveInt(plan.child, null) || toPositiveInt(detail.child, null) || 0;
  const pax = plan.noOfTravelPeople || adults + child || 2;
  const travelStartOffset = plan.travelStartOffset ?? (index + 1) * 2;
  const travelEndOffset = plan.travelEndOffset ?? travelStartOffset + 5;
  const startDate =
    plan.startDate ||
    detail.startDate ||
    formatDateOnly(addDaysToDate(baseDate, travelStartOffset));
  const endDate =
    plan.endDate ||
    detail.endDate ||
    formatDateOnly(addDaysToDate(baseDate, travelEndOffset));
  const priceMin = toNumber(plan.pricePerPersonMin, toNumber(detail.budgetPerPerson, 45000));
  const priceMax = toNumber(plan.pricePerPersonMax, Math.max(priceMin, priceMin + 7000));
  return {
    id: plan.planEnqId,
    planEnqId: plan.planEnqId,
    enquiryCustomId: plan.enquiryCustomId,
    firstName: plan.firstName || detail.contactName || detail.fullName || `Guest ${index + 1}`,
    groupName: plan.groupName || detail.groupName || detail.tourName || `Custom Enquiry ${plan.enquiryCustomId}`,
    tourName: plan.tourName || detail.groupName || detail.tourName || `Custom Enquiry ${plan.enquiryCustomId}`,
    contactNo: plan.contactNo || detail.contact || detail.phoneNo || "",
    email: plan.email || detail.mailId || "",
    startDate,
    endDate,
    noOfTravelPeople: pax,
    pricePerPersonMin: priceMin,
    pricePerPersonMax: priceMax,
    enquiryReferId: reference.enquiryReferId,
    enquiryReferName: reference.enquiryReferName,
    cityName: detail.cityName || "",
    priorityName: detail.priorityName || "Medium",
  };
};

const buildGroupPlanEnquiryRecords = () => {
  const baseDate = startOfToday();
  const seeds =
    groupPlanEnquiries.length
      ? groupPlanEnquiries
      : groupTours.slice(0, 4).map((tour, index) => ({
          planEnqId: 8200 + index + 1,
          enquiryGroupId: tour.groupTourId,
          groupTourId: tour.groupTourId,
        }));
  return seeds.map((plan, index) => createGroupPlanEnquiryRecord(plan, baseDate, index)).filter(Boolean);
};

const buildCustomPlanEnquiryRecords = () => {
  const baseDate = startOfToday();
  const seeds =
    customPlanEnquiries.length
      ? customPlanEnquiries
      : collectCustomEnquiryIds().map((id, index) => ({
          planEnqId: 9200 + index + 1,
          enquiryCustomId: id,
        }));
  return seeds.map((plan, index) => createCustomPlanEnquiryRecord(plan, baseDate, index)).filter(Boolean);
};

const filterPlanEnquiryRecord = (record, filters = {}, options = {}) => {
  const search = sanitizeText(filters.search);
  const searchFields = options.searchFields || ["firstName", "groupName", "tourName", "contactNo"];
  if (search) {
    const matched = searchFields.some((field) => matchesText(record[field], search));
    if (!matched) {
      return false;
    }
  }
  const tourField = options.tourField || "tourName";
  const tourFilter = sanitizeText(filters.tourName);
  if (tourFilter && !matchesText(record[tourField], tourFilter)) {
    return false;
  }
  return isWithinDateRange(record.startDate || record.nextFollowUp || record.enquiryDate, filters.startDate, filters.endDate);
};

const buildFutureEnquiryRecords = (seeds) => {
  const baseDate = startOfToday();
  return seeds.map((seed) => {
    const startDate = formatDateOnly(addDaysToDate(baseDate, seed.startOffset || 30));
    const endDate = formatDateOnly(addDaysToDate(baseDate, seed.endOffset || (seed.startOffset || 30) + 5));
    return {
      futureEnqId: seed.futureEnqId,
      name: seed.name,
      email: seed.email,
      phoneNo: seed.phoneNo,
      city: seed.city || [],
      address: seed.address || "",
      startDate,
      endDate,
      assignedUserId: toPositiveInt(seed.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
    };
  });
};

const filterFutureEnquiryRecord = (record, filters = {}) => {
  const nameFilter = sanitizeText(filters.name);
  if (nameFilter && !matchesText(record.name, nameFilter)) {
    return false;
  }
  const emailFilter = sanitizeText(filters.email);
  if (emailFilter && !matchesText(record.email, emailFilter)) {
    return false;
  }
  const phoneFilter = sanitizeText(filters.phoneNo);
  if (phoneFilter && !matchesText(record.phoneNo, phoneFilter)) {
    return false;
  }
  return true;
};

const listFutureEnquiries = ({ seeds, scope = "all", page = 1, perPage = 10, filters = {}, currentUserId }) => {
  const records = buildFutureEnquiryRecords(seeds).filter((record) => {
    if (scope === "mine") {
      return Number(record.assignedUserId) === Number(currentUserId || DEFAULT_FOLLOW_UP_USER_ID);
    }
    return true;
  });
  const filtered = records.filter((record) => filterFutureEnquiryRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(filtered, pageNumber, perPageNumber, filters, "Future enquiries fetched successfully");
};

const listFutureEnquiryAllListing = ({ page, perPage, filters }) =>
  listFutureEnquiries({ seeds: futureEnquirySeeds.concat(customFutureEnquirySeeds), scope: "all", page, perPage, filters });

const listFutureEnquirySelfListing = ({ page, perPage, filters, currentUserId }) =>
  listFutureEnquiries({ seeds: futureEnquirySeeds, scope: "mine", page, perPage, filters, currentUserId });

const createGroupFollowUpRecord = (plan, baseDate) => {
  const tour = groupTours.find((item) => Number(item.groupTourId) === Number(plan.groupTourId));
  if (!tour) {
    return null;
  }
  const followUpDate = formatDateOnly(addDaysToDate(baseDate, plan.nextFollowUpOffset || 0));
  const enquiryDate = formatDateOnly(
    addDaysToDate(baseDate, plan.enquiryDateOffset ?? (plan.nextFollowUpOffset || 0) - 7)
  );
  return {
    type: "GROUP",
    enquiryGroupId: tour.groupTourId,
    uniqueEnqueryId: `GT-${tour.groupTourId}`,
    groupName: plan.groupName || tour.tourName,
    tourName: tour.tourName,
    guestName: plan.guestName || "Primary Guest",
    userName: plan.assignedUserName,
    assignedUserId: plan.assignedUserId,
    assignedUserName: plan.assignedUserName,
    paxNo: plan.paxNo || tour.seatsBook || 0,
    nextFollowUp: followUpDate,
    nextFollowUpTime: plan.nextFollowUpTime || "10:00 AM",
    enquiryDate,
    startDate: tour.startDate,
    endDate: tour.endDate,
    cityName: tour.cityName,
    status: plan.status || tour.status,
    workflowStage: plan.workflowStage || tour.workflowStage,
    category: tour.category,
    tourTypeName: tour.tourTypeName,
  };
};

const createCustomFollowUpRecord = (plan, baseDate) => {
  const detail = customEnquiryDetails[plan.enquiryCustomId] || {};
  const tour = customTours.find((item) => Number(item.enquiryCustomId) === Number(plan.enquiryCustomId)) || {};
  if (!Object.keys(detail).length && !Object.keys(tour).length) {
    return null;
  }
  const followUpDate = formatDateOnly(addDaysToDate(baseDate, plan.nextFollowUpOffset || 0));
  const enquiryDate = formatDateOnly(
    addDaysToDate(baseDate, plan.enquiryDateOffset ?? (plan.nextFollowUpOffset || 0) - 7)
  );
  const adults = Number(detail.adults || tour.adults || 0);
  const child = Number(detail.child || tour.child || 0);
  const paxNo = plan.paxNo || adults + child || 0;
  const cityName =
    detail.cityName ||
    (Array.isArray(detail.cityDetails) && detail.cityDetails.length ? detail.cityDetails[0].citiesName : "") ||
    tour.cityName ||
    "";
  return {
    type: "CUSTOM",
    enquiryCustomId: plan.enquiryCustomId,
    uniqueEnqueryId: detail.uniqueEnqueryId || tour.uniqueEnqueryId || `CT-${plan.enquiryCustomId}`,
    groupName: detail.groupName || tour.groupName || "Custom Enquiry",
    tourName: detail.groupName || tour.groupName || "Custom Journey",
    guestName: detail.contactName || plan.guestName || "Primary Guest",
    userName: plan.assignedUserName,
    assignedUserId: plan.assignedUserId,
    assignedUserName: plan.assignedUserName,
    paxNo,
    nextFollowUp: followUpDate,
    nextFollowUpTime: plan.nextFollowUpTime || "10:00 AM",
    enquiryDate,
    startDate: detail.startDate || tour.startDate || null,
    endDate: detail.endDate || tour.endDate || null,
    cityName,
    status: detail.status || tour.status || "ENQUIRY",
    workflowStage: detail.workflowStage || tour.workflowStage || "ENQUIRY",
    guestContact: detail.contact || "",
    priorityName: detail.priorityName || "Medium",
  };
};

const buildGroupFollowUpRecords = () => {
  const baseDate = startOfToday();
  return groupFollowUpPlan.map((plan) => createGroupFollowUpRecord(plan, baseDate)).filter(Boolean);
};

const buildCustomFollowUpRecords = () => {
  const baseDate = startOfToday();
  return customFollowUpPlan.map((plan) => createCustomFollowUpRecord(plan, baseDate)).filter(Boolean);
};

const listGroupFollowUps = ({
  timeframe = "today",
  scope = "all",
  page = 1,
  perPage = 10,
  filters = {},
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildGroupFollowUpRecords()
    .filter((record) => matchesTimeframe(record, timeframe))
    .filter((record) => matchesScope(record, scope, currentUserId))
    .filter((record) => filterGroupFollowupRecord(record, filters));
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Group enquiry follow-ups fetched successfully");
};

const listCustomFollowUps = ({
  timeframe = "today",
  scope = "all",
  page = 1,
  perPage = 10,
  filters = {},
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildCustomFollowUpRecords()
    .filter((record) => matchesTimeframe(record, timeframe))
    .filter((record) => matchesScope(record, scope, currentUserId))
    .filter((record) => filterCustomFollowupRecord(record, filters));
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Custom enquiry follow-ups fetched successfully");
};

const listPlanEnquiryUsersGt = ({ page = 1, perPage = 10, filters = {} } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildGroupPlanEnquiryRecords().filter((record) =>
    filterPlanEnquiryRecord(record, filters, { tourField: "tourName" })
  );
  return buildListResponse(
    records,
    pageNumber,
    perPageNumber,
    filters,
    "Group tour plan enquiry users fetched successfully"
  );
};

const listPlanEnquiryUsersCt = ({ page = 1, perPage = 10, filters = {} } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildCustomPlanEnquiryRecords().filter((record) =>
    filterPlanEnquiryRecord(record, filters, { tourField: "groupName" })
  );
  return buildListResponse(
    records,
    pageNumber,
    perPageNumber,
    filters,
    "Custom tour plan enquiry users fetched successfully"
  );
};

const filterGroupPaymentRecord = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.guestName, filters.guestName)) {
    return false;
  }
  if (filters.tourName && !matchesText(record.tourName, filters.tourName)) {
    return false;
  }
  if (!matchesDateRange(record.startDate, record.endDate, filters.travelStartDate, filters.travelEndDate)) {
    return false;
  }
  return true;
};

const listPendingGroupPayments = ({ page = 1, perPage = 10, filters = {} } = {}) => {
  const records = buildGroupConfirmRecords()
    .filter((record) => toNumber(record.balance, 0) > 0)
    .filter((record) => filterGroupPaymentRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Pending group payments fetched successfully");
};

const buildCustomPaymentSummaries = () => {
  const ids = collectCustomEnquiryIds();
  const baseDate = startOfToday();
  return ids.map((id, index) => {
    const detail = buildCustomEnquiryDetail(id) || { enquiryCustomId: id };
    const adults = toPositiveInt(detail.adults, null) || 2;
    const child = toPositiveInt(detail.child, null) || 0;
    const pax = Math.max(2, adults + child || toPositiveInt(detail.paxNo, 2));
    const amountPerPerson = toNumber(detail.budgetPerPerson, 48000);
    const payment = buildPaymentBreakdown(amountPerPerson * pax);
    const startDate = detail.startDate || formatDateOnly(addDaysToDate(baseDate, (index + 1) * 4));
    const endDate = detail.endDate || formatDateOnly(addDaysToDate(baseDate, (index + 1) * 4 + 6));
    const status = index % 2 === 0 ? "PENDING" : "CONFIRMED";
    return {
      enquiryCustomId: id,
      enquiryDetailCustomId: Number(`${id}01`),
      uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${id}`,
      contactName: detail.contactName || detail.fullName || `Guest ${id}`,
      groupName: detail.groupName || detail.tourName || `Custom Journey ${id}`,
      startDate,
      endDate,
      contact: detail.contact || detail.phoneNo || "",
      tourPrice: payment.tourPrice,
      additionalDis: payment.discount,
      discountPrice: payment.discounted,
      gst: payment.gst,
      tcs: payment.tcs,
      grandTotal: payment.grand,
      advancePayment: payment.advancePayment,
      balance: payment.balance,
      dueDate: formatDateOnly(addDaysToDate(toDate(startDate) || baseDate, -7)),
      status,
    };
  });
};

const filterCustomPaymentRecord = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.contactName, filters.guestName)) {
    return false;
  }
  if (filters.tourName && !matchesText(record.groupName, filters.tourName)) {
    return false;
  }
  if (!matchesDateRange(record.startDate, record.endDate, filters.travelStartDate, filters.travelEndDate)) {
    return false;
  }
  return true;
};

const listPendingCustomPayments = ({ page = 1, perPage = 10, filters = {} } = {}) => {
  const records = buildCustomPaymentSummaries()
    .filter((record) => record.status === "PENDING")
    .filter((record) => filterCustomPaymentRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Pending custom payments fetched successfully");
};

const listConfirmedCustomPayments = ({ page = 1, perPage = 10, filters = {} } = {}) => {
  const records = buildCustomPaymentSummaries()
    .filter((record) => record.status !== "PENDING")
    .filter((record) => filterCustomPaymentRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Confirmed custom payments fetched successfully");
};

const buildLostEnquiryRecords = (seeds) => {
  const baseDate = startOfToday();
  return seeds.map((seed) => {
    const enqDate = formatDateOnly(addDaysToDate(baseDate, seed.enqDateOffset || -15));
    const lastFollow = formatDateOnly(addDaysToDate(baseDate, seed.lastFollowOffset || -5));
    return {
      uniqueEnqueryId: seed.uniqueEnqueryId,
      enqDate,
      guestName: seed.guestName,
      contact: seed.contact,
      destinationId: seed.destinationName,
      destinationName: seed.destinationName,
      pax: seed.pax,
      lastFollow,
      closureReason: seed.closureReason,
      assignedUserId: seed.assignedUserId || DEFAULT_FOLLOW_UP_USER_ID,
    };
  });
};

const filterLostEnquiryRecord = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.guestName, filters.guestName)) {
    return false;
  }
  return true;
};

const listLostGroupEnquiries = ({ page = 1, perPage = 10, filters = {}, scope = "mine", currentUserId } = {}) => {
  const records = buildLostEnquiryRecords(groupLostEnquiries)
    .filter((record) => (scope === "mine" ? Number(record.assignedUserId) === Number(currentUserId || DEFAULT_FOLLOW_UP_USER_ID) : true))
    .filter((record) => filterLostEnquiryRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Group lost enquiries fetched successfully");
};

const listAllLostGroupEnquiries = ({ page = 1, perPage = 10, filters = {} } = {}) =>
  listLostGroupEnquiries({ page, perPage, filters, scope: "all" });

const listLostCustomEnquiries = ({ page = 1, perPage = 10, filters = {}, scope = "mine", currentUserId } = {}) => {
  const records = buildLostEnquiryRecords(customLostEnquiries)
    .filter((record) => (scope === "mine" ? Number(record.assignedUserId) === Number(currentUserId || DEFAULT_FOLLOW_UP_USER_ID) : true))
    .filter((record) => filterLostEnquiryRecord(record, filters));
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return buildListResponse(records, pageNumber, perPageNumber, filters, "Custom lost enquiries fetched successfully");
};

const listAllLostCustomEnquiries = ({ page = 1, perPage = 10, filters = {} } = {}) =>
  listLostCustomEnquiries({ page, perPage, filters, scope: "all" });

const listGroupTours = ({ page = 1, perPage = 10, filters = {}, status = "PUBLISHED", category = "GROUP" }) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const normalizedCategory = category ? normalizeCategory(category) : "";
  const filtered = filterGroupStyleTours(groupTours, filters).filter((tour) => {
    if (status && tour.status !== status) {
      return false;
    }
    if (normalizedCategory && normalizeCategory(tour.category) !== normalizedCategory) {
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
  const normalizedCategory = category ? normalizeCategory(category) : "";
  const filtered = filterCustomTours(customTours, filters).filter((tour) => {
    if (normalizedCategory && normalizeCategory(tour.category) !== normalizedCategory) {
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

const roundCurrency = (value) => Math.round(toNumber(value, 0) * 100) / 100;

const buildPaymentBreakdown = (amount = 0) => {
  const tourPrice = roundCurrency(amount);
  const discount = roundCurrency(tourPrice * 0.05);
  const discounted = roundCurrency(tourPrice - discount);
  const gst = roundCurrency(discounted * 0.05);
  const tcs = roundCurrency(discounted * 0.01);
  const grand = roundCurrency(discounted + gst + tcs);
  const advancePayment = roundCurrency(grand * 0.6);
  const balance = roundCurrency(grand - advancePayment);
  return { tourPrice, discount, discounted, gst, tcs, grand, advancePayment, balance };
};

const resolveGroupPaxCount = (tour) =>
  toPositiveInt(tour.paxNo, null) ||
  toPositiveInt(tour.seatsBook, null) ||
  toPositiveInt(tour.totalSeats, null) ||
  2;

const resolveGroupAmount = (tour) => {
  const priceEntries = Array.isArray(tour.tourPrice) && tour.tourPrice.length ? tour.tourPrice : roomSharingPriceTemplate;
  const entry = priceEntries && priceEntries.length ? priceEntries[0] : {};
  const base = toNumber(entry.offerPrice ?? entry.tourPrice, entry.tourPrice ?? 0);
  return roundCurrency(base * Math.max(1, resolveGroupPaxCount(tour)));
};

const deriveGuestName = (tour) => {
  if (tour.familyHeadName) {
    return tour.familyHeadName;
  }
  if (tour.primaryGuestName) {
    return tour.primaryGuestName;
  }
  if (tour.tourManager) {
    return tour.tourManager;
  }
  return `${tour.tourName || "Guest"} Lead`;
};

const resolveContact = (source = {}) =>
  source.contact || source.contactNo || source.managerNo || source.phoneNo || source.mobile || "9999999999";

const generateFamilyHeadId = (tour, index = 0) =>
  toPositiveInt(tour.familyHeadGtId || tour.familyHeadId, null) ||
  Number(`${tour.groupTourId || 0}${(index % 9) + 1}`);

const resolveAssignedUser = (entity = {}) => ({
  assignedUserId: toPositiveInt(entity.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
  assignedUserName: entity.assignedUserName || entity.tourManager || entity.userName || "Waari Team",
});

const createGroupConfirmRecord = (tour, index) => {
  if (!tour || !tour.groupTourId) {
    return null;
  }
  const payment = buildPaymentBreakdown(resolveGroupAmount(tour));
  const userMeta = resolveAssignedUser(tour);
  const enquiryDate = tour.createdAt
    ? formatDateOnly(new Date(tour.createdAt))
    : formatDateOnly(addDaysToDate(new Date(), -(index + 4)));
  return {
    enquiryGroupId: tour.groupTourId,
    familyHeadGtId: generateFamilyHeadId(tour, index),
    groupPaymentDetailId: Number(`${tour.groupTourId}${(index % 3) + 1}`),
    uniqueEnqueryId: tour.uniqueEnqueryId || tour.tourCode || `GT-${tour.groupTourId}`,
    guestName: deriveGuestName(tour),
    contact: resolveContact(tour),
    startDate: tour.startDate,
    endDate: tour.endDate,
    enqDate: enquiryDate,
    tourName: tour.tourName,
    status: tour.status || "CONFIRMED",
    ...payment,
    assignedUserId: userMeta.assignedUserId,
    assignedUserName: userMeta.assignedUserName,
  };
};

const buildGroupConfirmRecords = () =>
  groupTours.map((tour, index) => createGroupConfirmRecord(tour, index)).filter(Boolean);

const filterConfirmBooking = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.guestName, filters.guestName)) {
    return false;
  }
  if (filters.tourName && !matchesText(record.tourName, filters.tourName)) {
    return false;
  }
  return matchesDateRange(record.startDate, record.endDate, filters.startDate, filters.endDate);
};

const matchesConfirmScope = (record, scope, currentUserId) => {
  if (scope === "mine") {
    return Number(record.assignedUserId) === Number(currentUserId);
  }
  return true;
};

const listConfirmGroupTours = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildGroupConfirmRecords()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterConfirmBooking(record, filters));
  const message =
    scope === "all"
      ? "All confirm group tour list fetched successfully"
      : "Confirm group tour list fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const collectCustomEnquiryIds = () => {
  const ids = new Set();
  customTours.forEach((tour) => {
    const id = toPositiveInt(tour.enquiryCustomId, null);
    if (id) {
      ids.add(id);
    }
  });
  Object.keys(customEnquiryDetails).forEach((key) => {
    const id = toPositiveInt(key, null);
    if (id) {
      ids.add(id);
    }
  });
  return Array.from(ids);
};

const createCustomConfirmRecord = (enquiryCustomId) => {
  const detail = buildCustomEnquiryDetail(enquiryCustomId) || { enquiryCustomId };
  const tour = customTours.find((item) => Number(item.enquiryCustomId) === enquiryCustomId) || {};
  const adults = toPositiveInt(detail.adults, null) || toPositiveInt(tour.adults, null) || 0;
  const child = toPositiveInt(detail.child, null) || toPositiveInt(tour.child, null) || 0;
  const pax = adults + child || toPositiveInt(tour.paxNo, null) || 2;
  const userMeta = resolveAssignedUser(tour);
  return {
    enquiryCustomId,
    uniqueEnqueryId: detail.uniqueEnqueryId || tour.uniqueEnqueryId || `CT-${enquiryCustomId}`,
    groupName: detail.groupName || tour.groupName || `Custom Enquiry ${enquiryCustomId}`,
    guestName: detail.contactName || tour.contactName || detail.guestName || `Guest ${enquiryCustomId}`,
    phoneNo: detail.contact || tour.phoneNo || tour.contact || "",
    destination: detail.destinationName || tour.destination || "",
    pax,
    startDate: detail.startDate || tour.startDate || null,
    endDate: detail.endDate || tour.endDate || null,
    duration: detail.duration || tour.duration || "",
    status: detail.status || tour.status || "CONFIRMED",
    assignedUserId: userMeta.assignedUserId,
    assignedUserName: userMeta.assignedUserName,
  };
};

const buildCustomConfirmRecords = () =>
  collectCustomEnquiryIds().map((id) => createCustomConfirmRecord(id)).filter(Boolean);

const filterCustomConfirmRecord = (record, filters = {}) => {
  if (filters.tourName && !matchesText(record.groupName, filters.tourName)) {
    return false;
  }
  return matchesDateRange(record.startDate, record.endDate, filters.startDate, filters.endDate);
};

const listConfirmCustomTours = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildCustomConfirmRecords()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterCustomConfirmRecord(record, filters));
  const message =
    scope === "all"
      ? "All confirm custom tour list fetched successfully"
      : "Confirm custom tour list fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const buildDurationLabel = (days, nights) => {
  const resolvedDays = toPositiveInt(days, null);
  const resolvedNights = toPositiveInt(nights, null);
  if (resolvedDays !== null && resolvedNights !== null) {
    return `${resolvedDays}D-${resolvedNights}N`;
  }
  if (resolvedDays !== null) {
    return `${resolvedDays}D-${Math.max(0, resolvedDays - 1)}N`;
  }
  if (resolvedNights !== null) {
    return `${resolvedNights + 1}D-${resolvedNights}N`;
  }
  return "5D-4N";
};

const resolveBookingDateString = (primaryDate, referenceDate, offset = -7) => {
  const primary = toDate(primaryDate);
  if (primary) {
    return formatDateString(primary);
  }
  const base = toDate(referenceDate) || new Date();
  return formatDateString(addDaysToDate(base, offset));
};

const createGroupBookingRecord = (tour, index = 0) => {
  if (!tour || !tour.groupTourId) {
    return null;
  }
  const destination = findDestination(tour.destinationId);
  const tourTypeId = toPositiveInt(tour.tourTypeId, null);
  const tourType = tourTypes.find((item) => Number(item.tourTypeId) === Number(tourTypeId));
  const startDate = formatDateString(toDate(tour.startDate) || addDaysToDate(new Date(), index * 3));
  const endDate = formatDateString(
    toDate(tour.endDate) || addDaysToDate(toDate(tour.startDate) || new Date(), Math.max(3, toPositiveInt(tour.days, null) || 4))
  );
  const bookingDate = resolveBookingDateString(tour.bookingDate || tour.bookingAt, tour.createdAt || startDate);
  const pax = Math.max(1, resolveGroupPaxCount(tour));
  const duration = tour.duration || buildDurationLabel(tour.days, tour.nights ?? tour.night);
  const assigned = resolveAssignedUser(tour);
  return {
    recordType: "GROUP",
    enquiryId: tour.groupTourId,
    familyHeadGtId: generateFamilyHeadId(tour, 0),
    uniqueEnqueryId: tour.uniqueEnqueryId || tour.tourCode || `GT-${tour.groupTourId}`,
    guestName: deriveGuestName(tour),
    phoneNo: resolveContact(tour),
    tourTypeId: tourType?.tourTypeId || tourTypeId,
    tourType: tourType?.tourTypeName || tour.tourTypeName || "Group Tour",
    destinationId: destination ? destination.destinationId : tour.destinationId || null,
    destinationName: destination ? destination.destinationName : tour.destinationName || "",
    tourName: tour.tourName || destination?.destinationName || "Group Tour",
    pax,
    bookingDate,
    travelDate: startDate,
    duration: duration || "5D-4N",
    startDate,
    endDate,
    assignedUserId: assigned.assignedUserId,
    assignedUserName: assigned.assignedUserName,
  };
};

const buildGroupBookingRecords = () =>
  groupTours.map((tour, index) => createGroupBookingRecord(tour, index)).filter(Boolean);

const filterGroupBookingRecord = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.guestName, filters.guestName)) {
    return false;
  }
  if (filters.tourName && !matchesText(record.tourName, filters.tourName)) {
    return false;
  }
  const tourTypeId = toPositiveInt(filters.tourTypeId, null);
  if (tourTypeId && Number(record.tourTypeId) !== tourTypeId) {
    return false;
  }
  const destinationId = toPositiveInt(filters.destinationId, null);
  if (destinationId && Number(record.destinationId) !== destinationId) {
    return false;
  }
  if (!isWithinDateRange(record.bookingDate, filters.bookingDateFrom, filters.bookingDateTo)) {
    return false;
  }
  const travelFrom = filters.startDate || filters.travelDateFrom;
  const travelTo = filters.endDate || filters.travelDateTo;
  if (!isWithinDateRange(record.travelDate, travelFrom, travelTo)) {
    return false;
  }
  return true;
};

const listGroupBookingRecords = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
} = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildGroupBookingRecords()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterGroupBookingRecord(record, filters));
  const message =
    scope === "all"
      ? "All group booking records fetched successfully"
      : "Group booking records fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const listAllGroupBookingRecords = (options = {}) =>
  listGroupBookingRecords({ ...options, scope: "all" });

const createCustomBookingRecord = (enquiryCustomId, index = 0) => {
  const detail = buildCustomEnquiryDetail(enquiryCustomId);
  if (!detail) {
    return null;
  }
  const tour = customTours.find((item) => Number(item.enquiryCustomId) === enquiryCustomId) || {};
  const assigned = resolveAssignedUser(tour);
  const start = toDate(detail.startDate) || addDaysToDate(new Date(), index * 4);
  const end = toDate(detail.endDate) || addDaysToDate(start, Math.max(3, toPositiveInt(detail.days, null) || 4));
  const bookingDate = resolveBookingDateString(tour.bookingDate || detail.bookingDate, start, -12);
  const duration = detail.duration || buildDurationLabel(detail.days, detail.nights);
  const adults = toPositiveInt(detail.adults, 0) || 0;
  const child = toPositiveInt(detail.child, 0) || 0;
  const pax = Math.max(1, adults + child || toPositiveInt(tour.paxNo, null) || 2);
  return {
    recordType: "CUSTOM",
    enquiryId: enquiryCustomId,
    uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${enquiryCustomId}`,
    tourName: detail.groupName || tour.groupName || "Custom Journey",
    guestName: detail.contactName || tour.contactName || detail.guestName || "Primary Guest",
    phoneNo: detail.contact || tour.phoneNo || tour.contact || "",
    tourTypeId: detail.destinationId,
    tourType: detail.destinationName || "Customized Tour",
    destinationId: detail.destinationId,
    destinationName: detail.destinationName,
    pax,
    bookingDate,
    travelDate: formatDateString(start),
    duration: duration || "5D-4N",
    startDate: formatDateString(start),
    endDate: formatDateString(end),
    assignedUserId: assigned.assignedUserId,
    assignedUserName: assigned.assignedUserName,
  };
};

const buildCustomBookingRecords = () =>
  collectCustomEnquiryIds().map((id, index) => createCustomBookingRecord(id, index)).filter(Boolean);

const filterCustomBookingRecord = (record, filters = {}) => {
  if (filters.guestName && !matchesText(record.guestName, filters.guestName)) {
    return false;
  }
  if (filters.groupName && !matchesText(record.tourName, filters.groupName)) {
    return false;
  }
  const destinationId = toPositiveInt(filters.destinationId, null);
  if (destinationId && Number(record.destinationId) !== destinationId) {
    return false;
  }
  if (!isWithinDateRange(record.bookingDate, filters.bookingDateFrom, filters.bookingDateTo)) {
    return false;
  }
  const travelFrom = filters.travelDateFrom || filters.startDate;
  const travelTo = filters.travelDateTo || filters.endDate;
  if (!isWithinDateRange(record.travelDate, travelFrom, travelTo)) {
    return false;
  }
  return true;
};

const listCustomBookingRecords = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
} = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildCustomBookingRecords()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterCustomBookingRecord(record, filters));
  const message =
    scope === "all"
      ? "All customized booking records fetched successfully"
      : "Customized booking records fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const listAllCustomBookingRecords = (options = {}) =>
  listCustomBookingRecords({ ...options, scope: "all" });

const splitNameParts = (value) => {
  const text = (value || "").toString().trim();
  if (!text) {
    return ["Guest", ""];
  }
  const parts = text.split(/\s+/);
  const firstName = parts.shift();
  const lastName = parts.join(" ");
  return [firstName, lastName];
};

const normalizeGuestRecord = (guest, index, options = {}) => {
  if (!guest) {
    return null;
  }
  const groupTourId = options.groupTourId || guest.enquiryGroupId || 0;
  const nameSource =
    guest.firstName || guest.lastName
      ? `${guest.firstName || ""} ${guest.lastName || ""}`
      : guest.familyHeadName || guest.guestName || `Guest ${index + 1}`;
  const [firstName, lastName] = splitNameParts(nameSource);
  const guestId =
    toPositiveInt(guest.guestId || guest.id, null) ||
    Number(`${groupTourId}${(index % 9) + 1}`);
  const assignedUserId =
    toPositiveInt(options.assignedUserId, null) ||
    toPositiveInt(guest.assignedUserId, null) ||
    DEFAULT_FOLLOW_UP_USER_ID;
  return {
    guestId,
    enquiryGroupId: groupTourId,
    familyHeadGtId: toPositiveInt(guest.familyHeadGtId || guest.familyHeadId, null) || guestId,
    firstName,
    lastName: lastName.trim(),
    guestName: `${firstName} ${lastName}`.trim(),
    gender: guest.gender || "NA",
    contact: guest.contact || guest.phone || guest.mobile || resolveContact(options.tour || {}),
    assignedUserId,
  };
};

const buildGroupGuestDirectory = () => {
  const records = [];
  const tourMap = new Map();
  groupTours.forEach((tour) => {
    if (tour && tour.groupTourId) {
      tourMap.set(Number(tour.groupTourId), tour);
    }
  });
  const groupIds = new Set();
  Object.keys(groupTourGuests).forEach((key) => {
    const id = toPositiveInt(key, null);
    if (id) {
      groupIds.add(id);
    }
  });
  groupTours.forEach((tour) => {
    const id = toPositiveInt(tour.groupTourId, null);
    if (id) {
      groupIds.add(id);
    }
  });
  groupIds.forEach((groupId) => {
    const guestList =
      (Array.isArray(groupTourGuests[groupId]) && groupTourGuests[groupId].length
        ? groupTourGuests[groupId]
        : groupTourGuestTemplate) || [];
    if (guestList.length) {
      guestList.forEach((guest, index) => {
        const formatted = normalizeGuestRecord(guest, index, {
          groupTourId: groupId,
          assignedUserId: tourMap.get(groupId)?.assignedUserId,
          tour: tourMap.get(groupId) || {},
        });
        if (formatted) {
          records.push(formatted);
        }
      });
      return;
    }
    const tour = tourMap.get(groupId) || {};
    const fallbackGuest = normalizeGuestRecord(
      {
        familyHeadName: deriveGuestName(tour),
        contact: resolveContact(tour),
      },
      0,
      {
        groupTourId: groupId,
        assignedUserId: tour.assignedUserId,
        tour,
      }
    );
    if (fallbackGuest) {
      records.push(fallbackGuest);
    }
  });
  return records;
};

const filterGuestRecord = (record, filters = {}) => {
  const guestIdQuery = (filters.guestId || "").toString().trim();
  if (guestIdQuery && !String(record.guestId || "").includes(guestIdQuery)) {
    return false;
  }
  return true;
};

const listGroupGuestDetails = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildGroupGuestDirectory()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterGuestRecord(record, filters));
  const message =
    scope === "all"
      ? "All group tour guest list fetched successfully"
      : "Group tour guest list fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const buildCustomGuestDirectory = () =>
  collectCustomEnquiryIds()
    .map((id, index) => {
      const detail = buildCustomEnquiryDetail(id);
      if (!detail) {
        return null;
      }
      const [firstName, lastName] = splitNameParts(detail.contactName || detail.groupName || `Custom Guest ${id}`);
      const guestId = toPositiveInt(detail.guestRefId, null) || Number(`${id}${index + 1}`);
      const assignedUserId =
        toPositiveInt(detail.assignedUserId, null) ||
        DEFAULT_FOLLOW_UP_USER_ID;
      return {
        guestId,
        enquiryCustomId: id,
        enquiryDetailCustomId: detail.enquiryDetailCustomId || guestId,
        firstName,
        lastName: lastName.trim(),
        guestName: `${firstName} ${lastName}`.trim(),
        gender: detail.gender || "NA",
        contact: detail.contact || detail.phoneNo || "",
        assignedUserId,
      };
    })
    .filter(Boolean);

const listCustomGuestDetails = ({
  page = 1,
  perPage = 10,
  filters = {},
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildCustomGuestDirectory()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => filterGuestRecord(record, filters));
  const message =
    scope === "all"
      ? "All custom tour guest list fetched successfully"
      : "Custom tour guest list fetched successfully";
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const DEFAULT_CALL_STATUS_OPTIONS = [
  { callStatusId: 1, callStatusName: "Interested" },
  { callStatusId: 2, callStatusName: "Follow-up Scheduled" },
  { callStatusId: 3, callStatusName: "Not Reachable" },
  { callStatusId: 4, callStatusName: "Converted" },
  { callStatusId: 5, callStatusName: "Not Interested" },
];
const DEFAULT_ROOM_SHARING_OPTIONS = [
  { roomShareId: 1, roomShareName: "Twin Sharing", tourPrice: 22000, offerPrice: 20500 },
  { roomShareId: 2, roomShareName: "Triple Sharing", tourPrice: 21000, offerPrice: 19500 },
  { roomShareId: 3, roomShareName: "Single Sharing", tourPrice: 26000, offerPrice: 25000 },
];
const DEFAULT_TRAVEL_MODE_VEHICLES = [
  { vehicleId: 1, vehicleName: "Luxury AC Coach", departureTypeId: 1 },
  { vehicleId: 2, vehicleName: "Economy Flight", departureTypeId: 2 },
  { vehicleId: 3, vehicleName: "Sleeper Train 3A", departureTypeId: 3 },
  { vehicleId: 4, vehicleName: "Private SUV", departureTypeId: 1 },
];
const PAYMENT_MODE_OPTIONS = [
  { paymentModeId: 1, paymentModeName: "Online" },
  { paymentModeId: 2, paymentModeName: "Cheque" },
  { paymentModeId: 3, paymentModeName: "Cash" },
  { paymentModeId: 4, paymentModeName: "Card" },
];
const ONLINE_TYPE_OPTIONS = [
  { onlineTypeId: 1, onlineTypeName: "UPI" },
  { onlineTypeId: 2, onlineTypeName: "Net Banking" },
  { onlineTypeId: 3, onlineTypeName: "IMPS" },
];
const CARD_TYPE_OPTIONS = [
  { cardTypeId: 1, cardTypeName: "Debit Card" },
  { cardTypeId: 2, cardTypeName: "Credit Card" },
];
const DOCUMENT_BASE_URL = "https://files.waari.travel/documents";

const DEFAULT_CANCELLATION_TEMPLATES = [
  {
    cancellationReason: "Medical emergency within the family",
    cancellationCharges: 3500,
    refundAmount: 14500,
    cancelType: 1,
    status: 0,
    accountName: "Anita Sharma",
    accountNo: "441102009876",
    bank: "HDFC Bank",
    branch: "Baner",
    ifsc: "HDFC0000456",
    refundProof: `${DOCUMENT_BASE_URL}/refunds/refund-proof-sample.pdf`,
  },
  {
    cancellationReason: "Visa processing delayed",
    cancellationCharges: 2200,
    refundAmount: 9800,
    cancelType: 2,
    status: 1,
    accountName: "Travel Credits",
    accountNo: "CN-2024-001",
    bank: "Waari Credits Desk",
    branch: "Head Office",
    ifsc: "WAAR0000001",
    creditNote: `${DOCUMENT_BASE_URL}/credit-notes/credit-note-sample.pdf`,
  },
];

const fallbackPriorityId = () => (priorities[0]?.priorityId ? Number(priorities[0].priorityId) : 1);

const fallbackEnquiryReferenceId = () =>
  enquiryReferences[0]?.enquiryReferId ? Number(enquiryReferences[0].enquiryReferId) : 1;

const fallbackGuestReferenceId = () => guestReferenceDropdown[0]?.guestRefId || "WR-1001";

const resolveGroupTourRecord = (enquiryGroupId) => {
  const parsed = toPositiveInt(enquiryGroupId, null);
  if (parsed) {
    const matched = groupTours.find((tour) => Number(tour.groupTourId) === parsed);
    if (matched) {
      return matched;
    }
  }
  return groupTours[0] || null;
};

const buildGroupEnquiryDetail = (enquiryGroupId) => {
  const tour = resolveGroupTourRecord(enquiryGroupId);
  if (!tour) {
    const fallbackId = toPositiveInt(enquiryGroupId, null) || 0;
    return {
      enquiryGroupId: fallbackId,
      groupTourId: fallbackId,
      tourName: `Group Tour ${fallbackId || 1}`,
      priorityId: fallbackPriorityId(),
      enquiryReferId: fallbackEnquiryReferenceId(),
      guestRefId: fallbackGuestReferenceId(),
      adults: 2,
      child: 0,
      email: "group@waari.travel",
      contact: "9999999999",
      fullName: "Waari Guest",
      groupName: `Group ${fallbackId || 1}`,
      familyHeadNo: 1,
      status: "NEW",
      message: "No group tour data available, returning placeholder enquiry details",
    };
  }
  const paxCount = resolveGroupPaxCount(tour);
  const adults = toPositiveInt(tour.adults, null) || Math.max(1, paxCount - 1);
  const child = toPositiveInt(tour.child, null);
  const priorityId = toPositiveInt(tour.priorityId, null) || fallbackPriorityId();
  const priority = priorities.find((item) => Number(item.priorityId) === Number(priorityId));
  const enquiryReferId = toPositiveInt(tour.enquiryReferId, null) || fallbackEnquiryReferenceId();
  const enquiryRef = enquiryReferences.find((item) => Number(item.enquiryReferId) === Number(enquiryReferId));
  const guestRefId = tour.guestRefId || fallbackGuestReferenceId();
  const familyHeadNo = Math.max(1, toPositiveInt(tour.familyHeadNo, null) || Math.ceil(paxCount / 2));
  const fullName = tour.fullName || tour.contactName || deriveGuestName(tour);
  const groupName = tour.groupName || `${tour.tourName || "Group"} ${tour.groupTourId}`;
  const emailSlug = normalize(tour.tourName || fullName || "group").replace(/\s+/g, ".");
  return {
    enquiryGroupId: tour.groupTourId,
    groupTourId: tour.groupTourId,
    tourName: tour.tourName,
    priorityId,
    priorityName: priority ? priority.priorityName : "",
    enquiryReferId,
    enquiryReferName: enquiryRef ? enquiryRef.enquiryReferName : "",
    guestRefId,
    adults,
    child: child === null || child === undefined ? Math.max(0, paxCount - adults) : child,
    email: tour.email || `${emailSlug || "group"}.${tour.groupTourId}@waari.travel`,
    contact: resolveContact(tour),
    fullName,
    groupName,
    familyHeadNo,
    status: tour.status || "IN_PROGRESS",
    message: "Group enquiry details fetched successfully",
  };
};

const resolveNamePrefixByIndex = (index = 0) => {
  if (namePrefixes.length) {
    const entry = namePrefixes[index % namePrefixes.length] || {};
    return {
      preFixId: entry.preFixId || index + 1,
      preFixName: entry.preFixName || (index % 2 === 0 ? "Mr." : "Ms."),
    };
  }
  return {
    preFixId: index + 1,
    preFixName: index % 2 === 0 ? "Mr." : "Ms.",
  };
};

const computeFamilyHeadPaxShare = (tour, familyCount, index) => {
  const total = Math.max(1, resolveGroupPaxCount(tour));
  const baseShare = Math.floor(total / familyCount);
  const remainder = total % familyCount;
  return Math.max(1, baseShare + (index < remainder ? 1 : 0));
};

const createFamilyHeadRecord = (tour, index, familyCount) => {
  if (!tour || !tour.groupTourId) {
    return null;
  }
  const prefix = resolveNamePrefixByIndex(index);
  const fallbackName = `${tour.groupName || tour.tourName || "Family"} ${index + 1}`;
  const [firstName, lastName] = splitNameParts(
    (tour.familyHeads && tour.familyHeads[index]?.familyHeadName) || fallbackName
  );
  const destination = destinations.find((item) => Number(item.destinationId) === Number(tour.destinationId));
  const paxPerHead = computeFamilyHeadPaxShare(tour, familyCount, index);
  const familyHeadGtId = generateFamilyHeadId(tour, index);
  const guestId = Number(`${tour.groupTourId}${index + 1}`);
  const addressParts = [tour.cityName, destination ? destination.destinationName : ""].filter(Boolean);
  const assignedUser = resolveAssignedUser(tour);
  return {
    familyHeadGtId,
    enquiryGroupId: tour.groupTourId,
    preFixId: prefix.preFixId,
    preFixName: prefix.preFixName,
    firstName,
    lastName: lastName.trim(),
    guestId,
    paxPerHead,
    destinationId: destination ? destination.destinationId : tour.destinationId || null,
    destinationName: destination ? destination.destinationName : "",
    loyaltyPoints: 50 * (index + 1),
    address: addressParts.join(", ") || "Waari HQ, Pune",
    contact: resolveContact(tour),
    email: tour.email || `${firstName.toLowerCase()}@waari.travel`,
    assignedUserId: assignedUser.assignedUserId,
    assignedUserName: assignedUser.assignedUserName,
  };
};

const buildFamilyHeadDirectory = () => {
  const records = [];
  groupTours.forEach((tour) => {
    if (!tour || !tour.groupTourId) {
      return;
    }
    const familyCount = Math.max(
      1,
      toPositiveInt(tour.familyHeadNo, null) || Math.ceil(resolveGroupPaxCount(tour) / 2)
    );
    for (let index = 0; index < familyCount; index += 1) {
      const record = createFamilyHeadRecord(tour, index, familyCount);
      if (record) {
        records.push(record);
      }
    }
  });
  return records;
};

const listFamilyHeadData = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  const headId = toPositiveInt(familyHeadGtId, null);
  const records = buildFamilyHeadDirectory().filter((record) => {
    if (id && Number(record.enquiryGroupId) !== id) {
      return false;
    }
    if (headId && Number(record.familyHeadGtId) !== headId) {
      return false;
    }
    return true;
  });
  return {
    enquiryGroupId: id,
    total: records.length,
    data: records,
    message: records.length ? "Family head data fetched successfully" : "No family head data available",
  };
};

const resolveFamilyHeadContext = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  const headId = toPositiveInt(familyHeadGtId, null);
  const listing = listFamilyHeadData({ enquiryGroupId: id, familyHeadGtId: headId });
  let familyHead = listing.data[0] || null;
  let resolvedGroupId = familyHead ? familyHead.enquiryGroupId : id;
  let tour = resolveGroupTourRecord(resolvedGroupId);
  if (!familyHead && tour) {
    const familyCount = Math.max(
      1,
      toPositiveInt(tour.familyHeadNo, null) || Math.ceil(resolveGroupPaxCount(tour) / 2)
    );
    familyHead = createFamilyHeadRecord(tour, 0, familyCount);
  }
  if (familyHead && !tour) {
    tour = resolveGroupTourRecord(familyHead.enquiryGroupId);
    resolvedGroupId = familyHead.enquiryGroupId;
  }
  return {
    enquiryGroupId: tour?.groupTourId || resolvedGroupId || null,
    familyHead,
    tour,
  };
};

const resolveRoomShareOptions = (tour = {}) => {
  const entries =
    (Array.isArray(tour.tourPrice) && tour.tourPrice.length ? tour.tourPrice : roomSharingPriceTemplate) || [];
  const source = entries.length ? entries : DEFAULT_ROOM_SHARING_OPTIONS;
  return source.map((entry, index) => {
    const fallback = DEFAULT_ROOM_SHARING_OPTIONS[index % DEFAULT_ROOM_SHARING_OPTIONS.length];
    return {
      roomShareId: entry.roomShareId || fallback.roomShareId || index + 1,
      roomShareName: entry.roomShareName || entry.hotelName || fallback.roomShareName || `Option ${index + 1}`,
      tourPrice: toNumber(entry.tourPrice, fallback.tourPrice),
      offerPrice: toNumber(
        entry.offerPrice,
        entry.tourPrice !== undefined ? toNumber(entry.tourPrice, fallback.offerPrice) : fallback.offerPrice
      ),
    };
  });
};

const resolveFamilyHeadShare = (tour, familyHead) => {
  const totalAmount = resolveGroupAmount(tour || {});
  const totalPax = Math.max(1, resolveGroupPaxCount(tour || {}));
  const paxPerHead = Math.max(1, familyHead?.paxPerHead || Math.ceil(totalPax / 2));
  const ratio = totalPax ? paxPerHead / totalPax : 1;
  return {
    totalAmount,
    shareAmount: totalAmount * ratio,
    paxPerHead,
    ratio,
  };
};

const buildGuestDetailRecords = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead) {
    return [];
  }
  const paxCount = Math.max(1, context.familyHead.paxPerHead || resolveGroupPaxCount(context.tour || {}));
  const guestDirectory = buildGroupGuestDirectory().filter((guest) => {
    if (familyHeadGtId && Number(guest.familyHeadGtId) !== Number(context.familyHead.familyHeadGtId)) {
      return false;
    }
    return Number(guest.enquiryGroupId) === Number(context.enquiryGroupId);
  });
  const roomOptions = resolveRoomShareOptions(context.tour || {});
  const records = [];
  for (let index = 0; index < paxCount; index += 1) {
    const existing = guestDirectory[index];
    const guestId =
      existing?.guestId || Number(`${context.familyHead.familyHeadGtId || context.enquiryGroupId}${index + 1}`);
    const [firstName, lastName] = existing
      ? [existing.firstName, existing.lastName]
      : splitNameParts(`${context.familyHead.firstName} ${context.familyHead.lastName} ${index + 1}`);
    const roomShare = roomOptions[index % roomOptions.length];
    const adharNo = `9999${String(guestId).padStart(8, "0")}`;
    const panNo = `WAARI${String(guestId).padStart(4, "0")}K`;
    const passportNo = `P${String(guestId).padStart(7, "0")}`;
    const issueDate = addDaysToDate(new Date(), -5 * 365 - index * 17);
    const expiryDate = addDaysToDate(issueDate, 10 * 365);
    records.push({
      enquiryGroupId: context.enquiryGroupId,
      familyHeadGtId: context.familyHead.familyHeadGtId,
      guestId,
      preFixId: context.familyHead.preFixId,
      preFixName: context.familyHead.preFixName,
      firstName,
      lastName: lastName.trim(),
      guestName: `${firstName} ${lastName}`.trim(),
      address: context.familyHead.address,
      contact: context.familyHead.contact,
      gender: existing?.gender || (index % 2 === 0 ? "Male" : "Female"),
      dob: existing?.dob || formatDateString(addDaysToDate(new Date(), -(25 + index) * 365)),
      mailId:
        existing?.email ||
        `${firstName.toLowerCase()}.${(lastName || "guest").toLowerCase() || "guest"}@waari.travel`,
      roomShareId: roomShare.roomShareId,
      adharCard: `${DOCUMENT_BASE_URL}/aadhar-${guestId}.pdf`,
      adharNo,
      pan: `${DOCUMENT_BASE_URL}/pan-${guestId}.pdf`,
      panNo,
      passport: `${DOCUMENT_BASE_URL}/passport-${guestId}.pdf`,
      passportNo,
      passport_issue_date: formatDateString(issueDate),
      passport_expiry_date: formatDateString(expiryDate),
      marriageDate: index === 0 ? formatDateString(addDaysToDate(new Date(), -2000)) : "",
    });
  }
  return records;
};

const getFamilyHeadEnquiryDetail = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead) {
    return {
      enquiryGroupId: context.enquiryGroupId,
      familyHeadGtId: null,
      message: "No family head data available",
    };
  }
  const destination = findDestination(context.familyHead.destinationId || context.tour?.destinationId);
  const departure = findDepartureType(context.tour?.departureTypeId, destination.destinationId);
  const travelMode =
    vehicles.find((vehicle) => vehicle.destinationId === destination.destinationId) || vehicles[0] || {
      vehicleId: 1,
      vehicleName: "Luxury Coach",
    };
  const dtodEntry = Array.isArray(context.tour?.dtod) && context.tour.dtod.length ? context.tour.dtod[0] : null;
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    preFixId: context.familyHead.preFixId,
    preFixName: context.familyHead.preFixName,
    firstName: context.familyHead.firstName,
    lastName: context.familyHead.lastName,
    tourName: context.tour?.tourName || `Group Tour ${context.enquiryGroupId}`,
    tourCode: context.tour?.tourCode || `GT-${context.enquiryGroupId}`,
    destinationId: destination.destinationId,
    destinationName: destination.destinationName,
    departureType: departure ? departure.departureTypeId || departure.departureType : null,
    departureName: departure ? departure.departureName || departure.departureTypeName : "",
    travelId: travelMode?.vehicleId || null,
    travelModeName: travelMode?.vehicleName || "",
    arrivalTime: dtodEntry?.pickUpMeetTime || "10:00",
    paxPerHead: context.familyHead.paxPerHead,
    assignedUserId: context.familyHead.assignedUserId,
    assignedUserName: context.familyHead.assignedUserName,
    contact: context.familyHead.contact,
    message: "Family head enquiry detail fetched successfully",
  };
};

const listFamilyHeadRoomShare = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  const options = resolveRoomShareOptions(context.tour || {});
  const data = options.map((option, index) => ({
    roomShareId: option.roomShareId,
    roomShareName: option.roomShareName,
    count: index === 0 ? Math.max(1, context.familyHead?.paxPerHead || 1) : 0,
  }));
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead?.familyHeadGtId || null,
    total: data.length,
    data,
    alreadyRoomsAdded: false,
    message: data.length ? "Room share data fetched successfully" : "No room share data available",
  };
};

const listRoomPriceOptions = (enquiryGroupId) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId });
  const options = resolveRoomShareOptions(context.tour || {});
  return {
    enquiryGroupId: context.enquiryGroupId,
    total: options.length,
    data: options,
    message: options.length ? "Room price list fetched successfully" : "No room price data available",
  };
};

const listTravelModeOptions = ({ departureTypeId } = {}) => {
  const parsedDepartureType = toPositiveInt(departureTypeId, null);
  const sourceVehicles = vehicles.length ? vehicles : DEFAULT_TRAVEL_MODE_VEHICLES;
  const normalized = sourceVehicles.map((vehicle, index) => {
    const travelId =
      toPositiveInt(vehicle.travelId, null) ||
      toPositiveInt(vehicle.vehicleId, null) ||
      index + 1;
    const travelModeName =
      vehicle.traveModeName ||
      vehicle.travelModeName ||
      vehicle.vehicleName ||
      `Travel Mode ${index + 1}`;
    const departureTypeIds = [];
    const directDepartureId = toPositiveInt(vehicle.departureTypeId, null);
    if (directDepartureId) {
      departureTypeIds.push(directDepartureId);
    }
    if (Array.isArray(vehicle.departureTypeIds)) {
      vehicle.departureTypeIds.forEach((value) => {
        const parsed = toPositiveInt(value, null);
        if (parsed && !departureTypeIds.includes(parsed)) {
          departureTypeIds.push(parsed);
        }
      });
    }
    return {
      travelId,
      traveModeName: travelModeName,
      travelModeName,
      destinationId: toPositiveInt(vehicle.destinationId, null) || null,
      capacity: toPositiveInt(vehicle.capacity, null) || null,
      departureTypeIds,
    };
  });
  const filtered =
    parsedDepartureType !== null
      ? normalized.filter((option) => {
          if (!option.departureTypeIds.length) {
            return true;
          }
          return option.departureTypeIds.includes(parsedDepartureType);
        })
      : normalized;
  const resolved = (filtered.length ? filtered : normalized).map((option) => {
    const { departureTypeIds, ...rest } = option;
    return {
      ...rest,
      departureTypeId: departureTypeIds.length ? departureTypeIds[0] : null,
    };
  });
  return {
    departureTypeId: parsedDepartureType,
    total: resolved.length,
    data: resolved,
    message: resolved.length ? "Travel mode list fetched successfully" : "No travel mode data available",
  };
};

const getFamilyHeadGuestDetails = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const records = buildGuestDetailRecords({ enquiryGroupId, familyHeadGtId });
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead?.familyHeadGtId || null,
    total: records.length,
    data: records,
    message: records.length ? "Guest details fetched successfully" : "No guest details available",
  };
};

const listGuestDocumentRecords = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const records = buildGuestDetailRecords({ enquiryGroupId, familyHeadGtId });
  const data = records.map((guest) => ({
    familyHeadName: guest.guestName,
    adharCard: guest.adharCard,
    adharNo: guest.adharNo,
    pan: guest.pan,
    panNo: guest.panNo,
    passport: guest.passport,
    passportNo: guest.passportNo,
    passport_issue_date: guest.passport_issue_date,
    passport_expiry_date: guest.passport_expiry_date,
  }));
  return {
    enquiryGroupId: records[0]?.enquiryGroupId || null,
    familyHeadGtId: records[0]?.familyHeadGtId || null,
    total: data.length,
    data,
    message: data.length ? "Guest documents fetched successfully" : "No guest documents available",
  };
};

const resolveGroupGuestDetailId = (guest, index = 0) =>
  toPositiveInt(guest.groupGuestDetailId, null) ||
  toPositiveInt(guest.guestId, null) ||
  Number(`${guest.enquiryGroupId || guest.familyHeadGtId || 1}${(index % 9) + 1}`);

const attachGroupGuestDetailIds = (records = []) =>
  records.map((guest, index) => ({
    ...guest,
    groupGuestDetailId: resolveGroupGuestDetailId(guest, index),
  }));

const buildCancellationProcessRecords = (guests = []) => {
  if (!guests.length) {
    return [];
  }
  const templates = DEFAULT_CANCELLATION_TEMPLATES.length
    ? DEFAULT_CANCELLATION_TEMPLATES
    : [
        {
          cancellationReason: "Guest requested cancellation",
          cancellationCharges: 2000,
          refundAmount: 0,
          cancelType: 1,
          status: 0,
        },
      ];
  return guests.slice(0, templates.length).map((guest, index) => {
    const template = templates[index % templates.length];
    const refundProof =
      template.cancelType === 1
        ? template.refundProof || `${DOCUMENT_BASE_URL}/refunds/refund-${guest.groupGuestDetailId}.pdf`
        : null;
    const creditNote =
      template.cancelType === 2
        ? template.creditNote || `${DOCUMENT_BASE_URL}/credit-notes/credit-note-${guest.groupGuestDetailId}.pdf`
        : null;
    return {
      enquiryGroupId: guest.enquiryGroupId,
      familyHeadGtId: guest.familyHeadGtId,
      guestId: guest.guestId,
      groupGuestDetailId: guest.groupGuestDetailId,
      name: guest.guestName,
      cancellationReason: template.cancellationReason,
      cancellationCharges: template.cancellationCharges,
      refundAmount: template.refundAmount,
      cancelType: template.cancelType,
      status: template.status,
      accountName: template.accountName || guest.guestName,
      accountNo: template.accountNo || `XXXX${String(guest.groupGuestDetailId).slice(-4)}`,
      bank: template.bank || "Waari Payments Bank",
      branch: template.branch || "Head Office",
      ifsc: template.ifsc || "WAAR0000001",
      refundProof,
      creditNote,
    };
  });
};

const resolveGuestCancellationState = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const guestRecords = attachGroupGuestDetailIds(buildGuestDetailRecords({ enquiryGroupId, familyHeadGtId }));
  const cancellationRecords = buildCancellationProcessRecords(guestRecords);
  return { guestRecords, cancellationRecords };
};

const listGroupGuestsForCancellation = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const { guestRecords, cancellationRecords } = resolveGuestCancellationState({ enquiryGroupId, familyHeadGtId });
  const cancelledIds = new Set(cancellationRecords.map((record) => record.groupGuestDetailId));
  const data = guestRecords.map((guest) => ({
    groupGuestDetailId: guest.groupGuestDetailId,
    enquiryGroupId: guest.enquiryGroupId,
    familyHeadGtId: guest.familyHeadGtId,
    guestId: guest.guestId,
    firstName: guest.firstName,
    lastName: guest.lastName,
    isCancel: cancelledIds.has(guest.groupGuestDetailId),
  }));
  const resolvedGroupId = data[0]?.enquiryGroupId || toPositiveInt(enquiryGroupId, null) || null;
  const resolvedFamilyHeadId = data[0]?.familyHeadGtId || toPositiveInt(familyHeadGtId, null) || null;
  return {
    enquiryGroupId: resolvedGroupId,
    familyHeadGtId: resolvedFamilyHeadId,
    total: data.length,
    data,
    message: data.length
      ? "Group guest list fetched successfully"
      : "No guests found for the provided enquiry",
  };
};

const getGroupCancellationProcessData = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const { cancellationRecords } = resolveGuestCancellationState({ enquiryGroupId, familyHeadGtId });
  const resolvedGroupId = cancellationRecords[0]?.enquiryGroupId || toPositiveInt(enquiryGroupId, null) || null;
  const resolvedFamilyHeadId = cancellationRecords[0]?.familyHeadGtId || toPositiveInt(familyHeadGtId, null) || null;
  return {
    enquiryGroupId: resolvedGroupId,
    familyHeadGtId: resolvedFamilyHeadId,
    total: cancellationRecords.length,
    data: cancellationRecords,
    message: cancellationRecords.length
      ? "Cancellation process data fetched successfully"
      : "No cancellation process data available",
  };
};

const getGuestCouponUsage = ({ guestId, enquiryGroupId } = {}) => {
  const id = toPositiveInt(guestId, null) || null;
  const coupon = {
    couponId: 501,
    couponName: "WAARI500",
    discountType: 2,
    discountValue: 5,
    maxDiscount: 500,
    guestId: id,
    enquiryGroupId: toPositiveInt(enquiryGroupId, null) || null,
    toDate: formatDateString(addDaysToDate(new Date(), 30)),
    description: "5% off on final tour cost up to ₹500",
  };
  return {
    data: coupon,
    message: "Coupon usage fetched successfully",
  };
};

const checkGuestExists = (guestId) => {
  const id = toPositiveInt(guestId, null);
  if (!id) {
    return { guestId: null, isExist: false };
  }
  const exists = buildGroupGuestDirectory().some((guest) => Number(guest.guestId) === id);
  return { guestId: id, isExist: exists };
};

const getGroupTourCostDetails = ({ enquiryGroupId, familyHeadGtId, guestId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead || !context.tour) {
    return { data: {}, message: "Family head data not found" };
  }
  const share = resolveFamilyHeadShare(context.tour, context.familyHead);
  const payment = buildPaymentBreakdown(share.shareAmount);
  const coupon = getGuestCouponUsage({ guestId, enquiryGroupId: context.enquiryGroupId }).data;
  const points = Math.min(500, context.familyHead.loyaltyPoints || 0);
  const couponDiscountAmount = coupon
    ? Number(coupon.discountType) === 2
      ? Math.min(payment.discounted * (coupon.discountValue / 100), coupon.maxDiscount)
      : coupon.discountValue
    : 0;
  const data = {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    guestId: toPositiveInt(guestId, context.familyHead.guestId),
    tourPrice: payment.tourPrice,
    points,
    discountprice: Math.max(0, payment.discounted - couponDiscountAmount - points),
    gst: payment.gst,
    tcs: payment.tcs,
    grandtotal: payment.grand,
    couponDiscount: couponDiscountAmount,
    couponId: coupon?.couponId || null,
    loyaltyPoints: context.familyHead.loyaltyPoints,
    isTourCostSubmitted: true,
  };
  return {
    data,
    message: "Tour cost details fetched successfully",
  };
};

const listPaymentModeOptions = () => PAYMENT_MODE_OPTIONS;

const listOnlineTypeOptions = () => ONLINE_TYPE_OPTIONS;

const listCardTypeOptions = () => CARD_TYPE_OPTIONS;

const getPaymentCalculationDetails = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead || !context.tour) {
    return { data: {}, message: "Family head data not found" };
  }
  const share = resolveFamilyHeadShare(context.tour, context.familyHead);
  const payment = buildPaymentBreakdown(share.shareAmount);
  const billingName = `${context.familyHead.preFixName} ${context.familyHead.firstName} ${context.familyHead.lastName}`.trim();
  const address = context.familyHead.address;
  const phoneNo = context.familyHead.contact;
  const data = {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    sameAsbillingName: billingName,
    sameAsaddress: address,
    sameAsphoneno: phoneNo,
    billingName,
    address,
    phoneNo,
    gstin: "27AAACW1234F1Z5",
    panNo: "AAACW1234F",
    grandTotal: payment.grand,
    advancePayment: payment.advancePayment,
    paymentModeId: PAYMENT_MODE_OPTIONS[0].paymentModeId,
    onlineTypeId: ONLINE_TYPE_OPTIONS[0].onlineTypeId,
    cardTypeId: CARD_TYPE_OPTIONS[0].cardTypeId,
    bankName: "Waari Payments Bank",
    chequeNo: "",
    paymentDate: formatDateString(new Date()),
    transactionId: `TXN${context.familyHead.familyHeadGtId}`,
    transactionProof: `${DOCUMENT_BASE_URL}/payments/${context.familyHead.familyHeadGtId}.png`,
    balance: payment.balance,
    isPaymentDone: payment.balance <= 0,
  };
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    data,
    message: "Payment calculation fetched successfully",
  };
};

const getGroupBillView = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead || !context.tour) {
    return { data: {}, message: "Family head data not found" };
  }
  const share = resolveFamilyHeadShare(context.tour, context.familyHead);
  const payment = buildPaymentBreakdown(share.shareAmount);
  const receiptPrefix = `REC-${context.familyHead.familyHeadGtId || context.enquiryGroupId}`;
  const advancePayments = [
    {
      groupPaymentDetailId: Number(`${context.familyHead.familyHeadGtId || context.enquiryGroupId}1`),
      advancePayment: payment.advancePayment,
      status: 1,
      receiptNo: `${receiptPrefix}-1`,
      paymentMode: PAYMENT_MODE_OPTIONS[0].paymentModeName,
      paymentDate: formatDateString(new Date()),
    },
  ];
  if (payment.balance > 0) {
    advancePayments.push({
      groupPaymentDetailId: Number(`${context.familyHead.familyHeadGtId || context.enquiryGroupId}2`),
      advancePayment: Math.min(payment.balance, payment.advancePayment / 2),
      status: 0,
      receiptNo: `${receiptPrefix}-2`,
      paymentMode: PAYMENT_MODE_OPTIONS[2].paymentModeName,
      paymentDate: formatDateString(addDaysToDate(new Date(), 7)),
    });
  }
  const data = {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    billingName: `${context.familyHead.preFixName} ${context.familyHead.firstName} ${context.familyHead.lastName}`.trim(),
    address: context.familyHead.address,
    phoneNumber: context.familyHead.contact,
    gstIn: "27AAACW1234F1Z5",
    panNumber: "AAACW1234F",
    grandTotal: payment.grand,
    balance: Math.max(0, payment.balance),
    isPaymentDone: payment.balance <= 0,
    advancePayments,
  };
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    data,
    message: "Group bill fetched successfully",
  };
};

const formatDateString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const formatTimeString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "10:00";
  }
  return date.toISOString().slice(11, 16);
};

const buildCallFollowHistory = (enquiryGroupId) => {
  const tour = resolveGroupTourRecord(enquiryGroupId);
  if (!tour) {
    return [];
  }
  const callCount = Math.max(1, Math.min(5, Math.ceil(resolveGroupPaxCount(tour) / 2)));
  const baseDate = toDate(tour.startDate) || new Date();
  const assigned = resolveAssignedUser(tour);
  const history = [];
  for (let index = 0; index < callCount; index += 1) {
    const current = new Date(baseDate);
    current.setDate(current.getDate() - (callCount - index));
    const next = new Date(current);
    next.setDate(next.getDate() + (index + 1));
    const status = DEFAULT_CALL_STATUS_OPTIONS[index % DEFAULT_CALL_STATUS_OPTIONS.length];
    history.push({
      callFollowUpId: Number(`${tour.groupTourId || 0}${index + 1}`) || index + 1,
      enquiryGroupId: tour.groupTourId,
      callStatusId: status.callStatusId,
      callStatusName: status.callStatusName,
      callSummary: `Discussed ${tour.tourName || "itinerary"} updates`,
      currentFollowUpDate: formatDateString(current),
      currentFollowUpTime: formatTimeString(current),
      nextFollowUpDate: formatDateString(next),
      nextFollowUpTime: formatTimeString(next),
      assignedUserId: assigned.assignedUserId,
      assignedUserName: assigned.assignedUserName,
    });
  }
  return history;
};

const listCallStatusOptions = () => DEFAULT_CALL_STATUS_OPTIONS;

const listCallFollowHistory = (enquiryGroupId) => {
  const id = toPositiveInt(enquiryGroupId, null);
  const data = buildCallFollowHistory(id);
  return {
    enquiryGroupId: id,
    total: data.length,
    data,
    message: data.length
      ? "Call follow-up history fetched successfully"
      : "No follow-up history available for this enquiry",
  };
};

const getGroupTotalCallCount = (enquiryGroupId) => {
  const tour = resolveGroupTourRecord(enquiryGroupId);
  const history = buildCallFollowHistory(enquiryGroupId);
  const resolvedId = tour ? tour.groupTourId : toPositiveInt(enquiryGroupId, null) || 0;
  const groupName = (tour && (tour.groupName || tour.tourName)) || `Group ${resolvedId || 1}`;
  return {
    enquiryGroupId: resolvedId,
    callCount: history.length,
    groupName,
    message: "Follow-up call count fetched successfully",
  };
};

const getGroupPaymentDetails = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  const headId = toPositiveInt(familyHeadGtId, null);
  const familyHeadResponse = listFamilyHeadData({ enquiryGroupId: id, familyHeadGtId: headId });
  let familyHead = familyHeadResponse.data[0];
  const tour = resolveGroupTourRecord(id);
  if (!familyHead && tour) {
    familyHead = createFamilyHeadRecord(tour, 0, 1);
  }
  const totalAmount = resolveGroupAmount(tour || {});
  const totalPax = Math.max(1, resolveGroupPaxCount(tour || {}));
  const paxPerHead = Math.max(1, familyHead ? familyHead.paxPerHead : totalPax);
  const ratio = totalPax ? paxPerHead / totalPax : 1;
  const payment = buildPaymentBreakdown(totalAmount * ratio);
  const payload = [
    {
      ...payment,
      grandTotal: payment.grand,
      enquiryGroupId: tour?.groupTourId || id,
      familyHeadGtId: familyHead ? familyHead.familyHeadGtId : null,
      guestName: familyHead ? `${familyHead.firstName} ${familyHead.lastName}`.trim() : deriveGuestName(tour || {}),
      paxPerHead,
    },
  ];
  return {
    enquiryGroupId: tour?.groupTourId || id,
    data: payload,
    total: payload.length,
    message: "Payment bill fetched successfully",
  };
};

const getGroupTourCompletionStatus = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  const paymentResponse = getGroupPaymentDetails({ enquiryGroupId: id, familyHeadGtId });
  const followUps = buildCallFollowHistory(id);
  const familyHeads = listFamilyHeadData({ enquiryGroupId: id }).data;
  let completionStatusCount = 1;
  if (familyHeads.length) {
    completionStatusCount += 1;
  }
  if (followUps.length) {
    completionStatusCount += 1;
  }
  const payment = paymentResponse.data[0];
  if (payment && payment.advancePayment > 0) {
    completionStatusCount += 1;
  }
  if (payment && payment.balance <= payment.advancePayment) {
    completionStatusCount += 1;
  }
  if (followUps.length > 2) {
    completionStatusCount += 1;
  }
  completionStatusCount = Math.min(6, completionStatusCount);
  return {
    enquiryGroupId: paymentResponse.enquiryGroupId,
    familyHeadGtId: payment ? payment.familyHeadGtId : null,
    completionStatusCount,
    message: "Group tour completion status fetched successfully",
  };
};

const getGroupEnquiryDetails = (enquiryGroupId) => buildGroupEnquiryDetail(enquiryGroupId);

const listGroupTourDropdown = () =>
  groupTours
    .map((tour) => ({
      groupTourId: tour.groupTourId,
      tourName: tour.tourName,
      status: tour.status,
      category: normalizeCategory(tour.category),
      startDate: tour.startDate,
      travelMonth: tour.travelMonth,
    }))
    .sort((a, b) => a.tourName.localeCompare(b.tourName));

const listPriorityOptions = () => priorities;

const listNamePrefixes = () => namePrefixes;

const listEnquiryReferences = () => enquiryReferences;

const listGuestReferenceDropdown = () => guestReferenceDropdown;

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

const createGroupTour = async (payload = {}) => {
  const groupTourId = nextGroupTourId();
  const tourTypeId = toPositiveInt(payload.tourTypeId, null);
  const tourType = tourTypes.find((item) => item.tourTypeId === tourTypeId);
  const category = normalizeCategory(tourType ? tourType.category : payload.category || "GROUP");
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
    category,
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
  await persistTourFixture("groupTours");

  return {
    message: "Tour created successfully",
    groupTourId,
    data: newTour,
  };
};

const updateGroupTourSkeleton = async (groupTourId, entries) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const index = groupTours.findIndex((item) => Number(item.groupTourId) === id);
  if (index === -1) {
    return null;
  }
  const existing = groupTours[index];
  const skeletonItinerary = normalizeSkeletonItineraryInput(
    entries,
    existing.skeletonItinerary || skeletonItineraryTemplate
  );
  const updated = {
    ...existing,
    skeletonItinerary,
    updatedAt: new Date().toISOString(),
  };
  groupTours[index] = updated;
  await persistTourFixture("groupTours");
  return {
    message: "Skeleton itinerary updated successfully",
    groupTourId: id,
    data: buildGroupTourDetail(updated),
  };
};

const updateGroupTourPrice = async (groupTourId, entries) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const index = groupTours.findIndex((item) => Number(item.groupTourId) === id);
  if (index === -1) {
    return null;
  }
  const existing = groupTours[index];
  const tourPrice = normalizeRoomSharingPriceInput(entries, existing.tourPrice || roomSharingPriceTemplate);
  const updated = {
    ...existing,
    tourPrice,
    updatedAt: new Date().toISOString(),
  };
  groupTours[index] = updated;
  await persistTourFixture("groupTours");
  return {
    message: "Group tour price updated successfully",
    groupTourId: id,
    data: buildGroupTourDetail(updated),
  };
};

const updateGroupTourTravelDetails = async (groupTourId, payload = {}) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const index = groupTours.findIndex((item) => Number(item.groupTourId) === id);
  if (index === -1) {
    return null;
  }
  const existing = groupTours[index];
  const flightDetails = normalizeFlightDetailsInput(
    payload.flightdetails !== undefined ? payload.flightdetails : payload.flightDetails,
    existing.flightDetails || flightDetailsTemplate
  );
  const trainDetails = normalizeTrainDetailsInput(
    payload.traindetails !== undefined ? payload.traindetails : payload.trainDetails,
    existing.trainDetails || trainDetailsTemplate
  );
  const dtod = normalizeDtodInput(payload.d2dtime !== undefined ? payload.d2dtime : payload.dtod, existing.dtod || []);
  const updated = {
    ...existing,
    flightDetails,
    trainDetails,
    dtod,
    visaDocuments: payload.visaDocuments ?? existing.visaDocuments ?? "",
    visaFee: payload.visaFee ?? existing.visaFee ?? "",
    visaInstruction: payload.visaInstruction ?? existing.visaInstruction ?? "",
    visaAlerts: payload.visaAlerts ?? existing.visaAlerts ?? "",
    insuranceDetails: payload.insuranceDetails ?? existing.insuranceDetails ?? "",
    euroTrainDetails: payload.euroTrainDetails ?? existing.euroTrainDetails ?? "",
    nriOriForDetails: payload.nriOriForDetails ?? existing.nriOriForDetails ?? "",
    updatedAt: new Date().toISOString(),
  };
  groupTours[index] = updated;
  await persistTourFixture("groupTours");
  return {
    message: "Travel details updated successfully",
    groupTourId: id,
    data: buildGroupTourDetail(updated),
  };
};

const updateGroupTourDetailedItinerary = async (groupTourId, entries) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const index = groupTours.findIndex((item) => Number(item.groupTourId) === id);
  if (index === -1) {
    return null;
  }
  const existing = groupTours[index];
  const detailedItinerary = normalizeDetailedItineraryInput(
    entries,
    existing.detailedItinerary || detailedItineraryTemplate
  );
  const grouptouritineraryimages = buildItineraryImagesByType(
    detailedItinerary,
    existing.grouptouritineraryimages || grouptourItineraryImagesTemplate
  );
  const updated = {
    ...existing,
    detailedItinerary,
    grouptouritineraryimages,
    updatedAt: new Date().toISOString(),
  };
  groupTours[index] = updated;
  await persistTourFixture("groupTours");
  return {
    message: "Detailed itinerary updated successfully",
    groupTourId: id,
    data: buildGroupTourDetail(updated),
  };
};

const updateGroupTourInfo = async (groupTourId, payload = {}) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const index = groupTours.findIndex((item) => Number(item.groupTourId) === id);
  if (index === -1) {
    return null;
  }
  const existing = groupTours[index];
  const inclusions = normalizeDescriptionEntries(
    payload.inclusions,
    existing.inclusions && existing.inclusions.length ? existing.inclusions : inclusionsTemplate
  );
  const exclusions = normalizeDescriptionEntries(
    payload.exclusions,
    existing.exclusions && existing.exclusions.length ? existing.exclusions : exclusionsTemplate
  );
  const notes = normalizeNotes(
    payload.note !== undefined ? payload.note : payload.notes !== undefined ? payload.notes : existing.notes,
    existing.notes && existing.notes.length ? existing.notes : notesTemplate
  );
  const updated = {
    ...existing,
    inclusions,
    exclusions,
    notes,
    updatedAt: new Date().toISOString(),
  };
  groupTours[index] = updated;
  await persistTourFixture("groupTours");
  return {
    message: "Group tour info updated successfully",
    groupTourId: id,
    data: buildGroupTourDetail(updated),
  };
};

const getGroupTourById = (groupTourId) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return null;
  }
  const tour = groupTours.find((item) => Number(item.groupTourId) === id);
  if (!tour) {
    return null;
  }
  return buildGroupTourDetail(tour);
};

const getGroupTourPublicDetails = (groupTourId) => {
  const detail = getGroupTourById(groupTourId);
  if (!detail) {
    return null;
  }
  return buildGroupTourPublicPayload(detail);
};

const getTailorMadeById = (tailorMadeId) => {
  const id = toPositiveInt(tailorMadeId, null);
  if (!id) {
    return null;
  }
  const tour = tailorMadeTours.find((item) => Number(item.tailorMadeId) === id);
  if (!tour) {
    return null;
  }
  return buildTailorMadeDetail(tour);
};

const getTailorMadePublicDetails = (tailorMadeId) => {
  const detail = getTailorMadeById(tailorMadeId);
  if (!detail) {
    return null;
  }
  return buildTailorMadePublicPayload(detail);
};

const updateTailorMadeTour = (tailorMadeId, payload = {}) => {
  const id = toPositiveInt(tailorMadeId, null);
  if (!id) {
    return null;
  }
  const index = tailorMadeTours.findIndex((item) => Number(item.tailorMadeId) === id);
  if (index === -1) {
    return null;
  }
  const existing = tailorMadeTours[index];
  const existingOverride = tailorMadeDetailOverrides[id] || {};
  const now = new Date().toISOString();
  const cityIdsInput = parseCityIds(payload.cityIds || payload.cityId);
  const resolvedCityIds =
    cityIdsInput.length
      ? cityIdsInput
      : existingOverride.cityIds || existing.cityIds || (existing.cityId ? [existing.cityId] : []);
  const cityId = resolvedCityIds[0] || existing.cityId || null;
  const tourTypeId = toPositiveInt(payload.tourTypeId, existing.tourTypeId);
  const tourType = tourTypes.find((item) => item.tourTypeId === tourTypeId);
  const departureTypeId = toPositiveInt(payload.departureTypeId, existing.departureTypeId);
  const departureType = departureTypes.find((item) => item.departureTypeId === departureTypeId);
  const destinationId = toPositiveInt(
    payload.destinationId,
    existing.destinationId ?? existingOverride.destinationId ?? destinations[0].destinationId
  );
  const countryId = toPositiveInt(
    payload.countryId,
    existing.countryId ?? existingOverride.countryId ?? countries[0].countryId
  );
  const stateId = toPositiveInt(
    payload.stateId,
    existing.stateId ?? existingOverride.stateId ?? states[0].stateId
  );
  const mealPlanId = toPositiveInt(
    payload.mealPlanId,
    existing.mealPlanId ?? existingOverride.mealPlanId ?? mealPlans[0].mealPlanId
  );
  const totalSeats = toPositiveInt(payload.totalSeats, existing.totalSeats || existingOverride.totalSeats || 0) ||
    existing.totalSeats ||
    0;
  const seatsBook = existing.seatsBook || 0;
  const daysValue = toPositiveInt(payload.days, null);
  const nightValue = toPositiveInt(payload.night || payload.nights, null);
  const days = daysValue ?? existing.days ?? existingOverride.days ?? null;
  const night = nightValue ?? existing.night ?? existingOverride.night ?? null;
  const duration =
    days && night ? `${days}D-${night}N` : days ? `${days}D` : night ? `${night}N` : existing.duration;
  const updatedBase = {
    ...existing,
    tourName: payload.tourName ?? existing.tourName,
    tourCode: payload.tourCode ?? existing.tourCode,
    tourTypeId,
    tourTypeName: tourType ? tourType.tourTypeName : existing.tourTypeName,
    category: normalizeCategory(tourType ? tourType.category : existing.category),
    departureTypeId,
    departureType: departureType ? departureType.departureName || departureType.departureTypeName : existing.departureType,
    destinationId,
    countryId,
    stateId,
    totalSeats,
    seatsAval: Math.max(0, totalSeats - seatsBook),
    days,
    night,
    totalDuration: days || night || existing.totalDuration || null,
    duration,
    cityId,
    cityIds: resolvedCityIds,
    mealPlanId,
    uniqueExperience: payload.uniqueExperience ?? existing.uniqueExperience,
    shopping: payload.shopping ?? existing.shopping,
    weather: payload.weather ?? existing.weather,
    websiteDescription: payload.websiteDescription ?? existing.websiteDescription,
    bgImage: payload.bgImage ?? existing.bgImage,
    websiteBanner: payload.websiteBanner ?? existing.websiteBanner,
    updatedAt: now,
  };
  tailorMadeTours[index] = updatedBase;
  const hotelPrice = formatTailorMadeHotelPriceOverride(
    payload.hotelprice,
    existingOverride.tourPrice || tailorMadeHotelPriceTemplate
  );
  const detailedItinerary = formatTailorMadeItineraryOverride(
    payload.detailedItinerary,
    existingOverride.detailedItinerary || detailedItineraryTemplate
  );
  const inclusions = normalizeArrayInput(
    payload.tailormadeinclusions,
    existingOverride.tailormadeinclusions || inclusionsTemplate
  );
  const exclusions = normalizeArrayInput(
    payload.tailormadeexclusions,
    existingOverride.tailormadeexclusions || exclusionsTemplate
  );
  const notesSource =
    payload.note !== undefined
      ? payload.note
      : existingOverride.notes || existingOverride.note || notesTemplate;
  const notes = normalizeNotes(notesSource, existingOverride.notes || notesTemplate);
  const overridePayload = {
    ...existingOverride,
    destinationId,
    countryId,
    stateId,
    mealPlanId,
    cityIds: resolvedCityIds,
    tourPrice: hotelPrice,
    detailedItinerary,
    tailormadeinclusions: inclusions,
    tailormadeexclusions: exclusions,
    notes,
    note: notes,
    uniqueExperience: payload.uniqueExperience ?? existingOverride.uniqueExperience ?? updatedBase.uniqueExperience,
    shopping: payload.shopping ?? existingOverride.shopping ?? updatedBase.shopping,
    weather: payload.weather ?? existingOverride.weather ?? updatedBase.weather,
    visaDocuments: payload.visaDocuments ?? existingOverride.visaDocuments,
    visaFee: payload.visaFee ?? existingOverride.visaFee,
    visaInstruction: payload.visaInstruction ?? existingOverride.visaInstruction,
    visaAlerts: payload.visaAlerts ?? existingOverride.visaAlerts,
    insuranceDetails: payload.insuranceDetails ?? existingOverride.insuranceDetails,
    euroTrainDetails: payload.euroTrainDetails ?? existingOverride.euroTrainDetails,
    nriOriForDetails: payload.nriOriForDetails ?? existingOverride.nriOriForDetails,
    bgImage: payload.bgImage ?? existingOverride.bgImage,
    websiteBanner: payload.websiteBanner ?? existingOverride.websiteBanner,
    websiteDescription: payload.websiteDescription ?? existingOverride.websiteDescription,
    updatedAt: now,
  };
  tailorMadeDetailOverrides[id] = overridePayload;
  return {
    message: "Tailor-made tour updated successfully",
    tailorMadeId: id,
    data: getTailorMadeById(id),
  };
};

const getCustomizedEnquiryDetails = (enquiryCustomId) => buildCustomEnquiryDetail(enquiryCustomId);

const listCustomizedPackages = (enquiryCustomId) => listCustomEnquiryPackages(enquiryCustomId);

const listGroupTourGuests = (groupTourId) => {
  const id = toPositiveInt(groupTourId, null);
  if (!id) {
    return { groupTourId: null, data: [], total: 0, message: "Invalid groupTourId" };
  }
  const sourceList =
    Array.isArray(groupTourGuests[id]) && groupTourGuests[id].length
      ? groupTourGuests[id]
      : groupTourGuestTemplate;
  const normalized = cloneValue(sourceList, groupTourGuestTemplate).map((guest, index) => ({
    guestId: guest.guestId ?? index + 1,
    familyHeadName: guest.familyHeadName || `Guest ${index + 1}`,
    gender: guest.gender || "NA",
    contact: guest.contact || "",
    address: guest.address || "",
    dob: guest.dob || "",
    adharNo: guest.adharNo || "",
    email: guest.email || "",
    passportNo: guest.passportNo || "",
    city: guest.city || "",
    state: guest.state || "",
  }));
  return {
    groupTourId: id,
    total: normalized.length,
    data: normalized,
    message: "Group tour guests fetched successfully",
  };
};

module.exports = {
  toPositiveInt,
  listGroupFollowUps,
  listCustomFollowUps,
  listPlanEnquiryUsersGt,
  listPlanEnquiryUsersCt,
  listFutureEnquiryAllListing,
  listFutureEnquirySelfListing,
  listPendingGroupPayments,
  listPendingCustomPayments,
  listConfirmedCustomPayments,
  listGroupTourDropdown,
  listPriorityOptions,
  listNamePrefixes,
  listEnquiryReferences,
  listGuestReferenceDropdown,
  listGroupTours,
  listTailorMadeTours,
  listCustomTours,
  listConfirmGroupTours,
  listConfirmCustomTours,
  listGroupBookingRecords,
  listAllGroupBookingRecords,
  listCustomBookingRecords,
  listAllCustomBookingRecords,
  listTourTypes,
  listCities,
  listDestinations,
  listVehicles,
  listMealPlans,
  listMealTypes,
  listKitchens,
  listDepartureTypes,
  listCountries,
  getGroupEnquiryDetails,
  listFamilyHeadData,
  getFamilyHeadEnquiryDetail,
  listFamilyHeadRoomShare,
  listRoomPriceOptions,
  listTravelModeOptions,
  listGroupGuestsForCancellation,
  getGroupCancellationProcessData,
  getFamilyHeadGuestDetails,
  listGuestDocumentRecords,
  getGuestCouponUsage,
  checkGuestExists,
  listPaymentModeOptions,
  listOnlineTypeOptions,
  listCardTypeOptions,
  getGroupTourCostDetails,
  getGroupPaymentDetails,
  getPaymentCalculationDetails,
  getGroupBillView,
  getGroupTourCompletionStatus,
  getGroupTotalCallCount,
  listCallStatusOptions,
  listCallFollowHistory,
  listLostGroupEnquiries,
  listAllLostGroupEnquiries,
  listLostCustomEnquiries,
  listAllLostCustomEnquiries,
  createGroupTour,
  updateGroupTourSkeleton,
  updateGroupTourPrice,
  updateGroupTourTravelDetails,
  updateGroupTourDetailedItinerary,
  updateGroupTourInfo,
  getGroupTourById,
  getGroupTourPublicDetails,
  getTailorMadeById,
  getTailorMadePublicDetails,
  updateTailorMadeTour,
  getCustomizedEnquiryDetails,
  listCustomizedPackages,
  listGroupTourGuests,
  listGroupGuestDetails,
  listCustomGuestDetails,
};
