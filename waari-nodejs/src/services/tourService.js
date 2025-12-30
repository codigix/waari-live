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

const listGroupTourDropdown = () =>
  groupTours
    .map((tour) => ({
      groupTourId: tour.groupTourId,
      tourName: tour.tourName,
      status: tour.status,
      category: tour.category,
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
    category: tourType ? tourType.category : existing.category,
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
  listGroupTourDropdown,
  listPriorityOptions,
  listNamePrefixes,
  listEnquiryReferences,
  listGuestReferenceDropdown,
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
  getGroupTourPublicDetails,
  getTailorMadeById,
  getTailorMadePublicDetails,
  updateTailorMadeTour,
  getCustomizedEnquiryDetails,
  listCustomizedPackages,
  listGroupTourGuests,
};
