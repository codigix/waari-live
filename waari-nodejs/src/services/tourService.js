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
  hotelCategories,
  namePrefixes,
  enquiryReferences,
  guestReferenceDropdown,
  groupTourEnquiries,
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
  manualGuestDirectory,
  loyaltyStatusOverrides,
  groupFamilyHeadOverrides,
  groupPaymentOverrides,
  customPaymentOverrides,
  customCallFollowUps,
  customVoucherRecords,
  customEnquiryDetailTemplate,
  customEnquiryDetails,
  customPackageTemplate,
  customEnquiryPackages,
  customCancellationOverrides,
  customEnquiryCancellationLogs,
  groupCallFollowUps,
  groupCancellationOverrides,
  groupEnquiryCancellationLogs,
  groupPlanEnquiryAssignments,
  customPlanEnquiryAssignments,
} = require("../data/tourDataStore");
const { persistTourFixture } = require("../data/toursDataLoader");
const pool = require("../../database/pool");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const normalize = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");
const trimTextValue = (value) => (typeof value === "string" ? value.trim() : "");
const slugify = (value, fallback = "waari") => {
  const normalized = (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
};

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
  if (Number(tour.cityId) === parsed) {
    return true;
  }
  if (Array.isArray(tour.cityIds)) {
    return tour.cityIds.some((value) => Number(value) === parsed);
  }
  return false;
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

const WEBSITE_CONTACT_ENTRIES = [
  {
    contactUsId: 101,
    fullName: "Aarav Kulkarni",
    email: "aarav.kulkarni@waari.travel",
    phoneNo: "9823456781",
    Date: "2025-01-03",
    city: "Pune",
    message: "Planning a Ladakh road trip for six friends in April.",
    source: "Website",
    status: "NEW",
  },
  {
    contactUsId: 102,
    fullName: "Riya Patankar",
    email: "riya.patankar@gmail.com",
    phoneNo: "9890123472",
    Date: "2025-01-05",
    city: "Mumbai",
    message: "Need honeymoon suggestions with beach and adventure mix.",
    source: "Landing Page",
    status: "FOLLOW_UP",
  },
  {
    contactUsId: 103,
    fullName: "Siddharth Vernekar",
    email: "siddharth.v@waari.travel",
    phoneNo: "9812339076",
    Date: "2025-01-06",
    city: "Bengaluru",
    message: "Corporate outing for 40 members to Dubai in March.",
    source: "Referral",
    status: "QUALIFIED",
  },
  {
    contactUsId: 104,
    fullName: "Meera Deshpande",
    email: "meera.deshpande@yahoo.com",
    phoneNo: "9822100345",
    Date: "2025-01-08",
    city: "Nashik",
    message: "Family pilgrimage with elders requiring assistance.",
    source: "Website",
    status: "NEW",
  },
  {
    contactUsId: 105,
    fullName: "Imran Shaikh",
    email: "imran.shaikh@live.com",
    phoneNo: "9833011223",
    Date: "2025-01-10",
    city: "Hyderabad",
    message: "Backpacking idea for Scandinavian countries in May.",
    source: "WhatsApp CTA",
    status: "FOLLOW_UP",
  },
];

const HOME_PAGE_JOURNEY_LAYOUT = [
  {
    selectionId: 1,
    groupTourId: 901,
    tourName: "Signature Europe Explorer",
    heroImageUrl:
      "https://images.pexels.com/photos/221493/pexels-photo-221493.jpeg?auto=compress&cs=tinysrgb&w=1260",
    badge: "Popular",
    highlight: "9N/10D Paris · Interlaken · Rome",
    priceFrom: 139999,
    duration: "10 Days",
    sequence: 1,
  },
  {
    selectionId: 2,
    groupTourId: 902,
    tourName: "Himalayan Odyssey",
    heroImageUrl:
      "https://images.pexels.com/photos/551816/pexels-photo-551816.jpeg?auto=compress&cs=tinysrgb&w=1260",
    badge: "Trending",
    highlight: "7N/8D Srinagar · Kargil · Leh",
    priceFrom: 82999,
    duration: "8 Days",
    sequence: 2,
  },
  {
    selectionId: 3,
    groupTourId: 903,
    tourName: "Bali Beyond Beaches",
    heroImageUrl:
      "https://images.pexels.com/photos/916620/pexels-photo-916620.jpeg?auto=compress&cs=tinysrgb&w=1260",
    badge: "Seasonal",
    highlight: "5N/6D Ubud · Seminyak · Nusa Penida",
    priceFrom: 68999,
    duration: "6 Days",
    sequence: 3,
  },
  {
    selectionId: 4,
    groupTourId: 904,
    tourName: "South African Panorama",
    heroImageUrl:
      "https://images.pexels.com/photos/1369210/pexels-photo-1369210.jpeg?auto=compress&cs=tinysrgb&w=1260",
    badge: "Limited",
    highlight: "8N/9D Cape Town · Garden Route · Safari",
    priceFrom: 189999,
    duration: "9 Days",
    sequence: 4,
  },
];

const TOP_FIVE_GROUP_JOURNEY_LAYOUT = [
  {
    topFiveGroupJourneyId: 1,
    title: "Snow-Capped Europe",
    subTitle: "Swiss and Austrian Alps",
    topFiveGroupJourneyImageUrl:
      "https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=600",
    topFiveGroupJourneyPathUrl: "https://waari.travel/journeys/snow-capped-europe",
    sequence: 1,
  },
  {
    topFiveGroupJourneyId: 2,
    title: "Mediterranean Cruise",
    subTitle: "Spain · France · Italy",
    topFiveGroupJourneyImageUrl:
      "https://images.pexels.com/photos/327337/pexels-photo-327337.jpeg?auto=compress&cs=tinysrgb&w=600",
    topFiveGroupJourneyPathUrl: "https://waari.travel/journeys/mediterranean-cruise",
    sequence: 2,
  },
  {
    topFiveGroupJourneyId: 3,
    title: "Canadian Rockies",
    subTitle: "Banff and Jasper",
    topFiveGroupJourneyImageUrl:
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
    topFiveGroupJourneyPathUrl: "https://waari.travel/journeys/canadian-rockies",
    sequence: 3,
  },
  {
    topFiveGroupJourneyId: 4,
    title: "Jordan Explorer",
    subTitle: "Amman · Petra · Wadi Rum",
    topFiveGroupJourneyImageUrl:
      "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=600",
    topFiveGroupJourneyPathUrl: "https://waari.travel/journeys/jordan-explorer",
    sequence: 4,
  },
  {
    topFiveGroupJourneyId: 5,
    title: "Festive USA East Coast",
    subTitle: "New York · DC · Niagara",
    topFiveGroupJourneyImageUrl:
      "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600",
    topFiveGroupJourneyPathUrl: "https://waari.travel/journeys/usa-east-coast",
    sequence: 5,
  },
];

const WEBSITE_REVIEW_ENTRIES = [
  {
    reviewId: 401,
    customerName: "Isha Bhadane",
    tourCode: "GT-209",
    type: 1,
    tourName: "Highlights of Turkey",
    tourDate: "2024-12-05",
    title: "Seamless and scenic",
    rating: 4.8,
    imageUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
    status: "PUBLISHED",
    createdAt: "2025-01-04",
  },
  {
    reviewId: 402,
    customerName: "Devendra Patil",
    tourCode: "GT-311",
    type: 2,
    tourName: "Kenyan Safari Custom",
    tourDate: "2024-11-18",
    title: "Private game drives were worth it",
    rating: 4.6,
    imageUrl: "https://images.pexels.com/photos/240040/pexels-photo-240040.jpeg?auto=compress&cs=tinysrgb&w=200",
    status: "PUBLISHED",
    createdAt: "2025-01-06",
  },
  {
    reviewId: 403,
    customerName: "Nidhi Kamble",
    tourCode: "GT-118",
    type: 1,
    tourName: "Enchanting Scandinavia",
    tourDate: "2024-10-02",
    title: "Auroras delivered!",
    rating: 5,
    imageUrl: "https://images.pexels.com/photos/1672813/pexels-photo-1672813.jpeg?auto=compress&cs=tinysrgb&w=200",
    status: "PUBLISHED",
    createdAt: "2024-12-20",
  },
  {
    reviewId: 404,
    customerName: "Samir Choksi",
    tourCode: "GT-412",
    type: 2,
    tourName: "Australia Signature",
    tourDate: "2024-09-12",
    title: "Kids loved Gold Coast",
    rating: 4.5,
    imageUrl: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
    status: "PUBLISHED",
    createdAt: "2024-11-29",
  },
  {
    reviewId: 405,
    customerName: "Carlos Lopes",
    tourCode: "GT-510",
    type: 1,
    tourName: "Patagonia Trails",
    tourDate: "2024-08-22",
    title: "Challenging but rewarding",
    rating: 4.9,
    imageUrl: "https://images.pexels.com/photos/91224/pexels-photo-91224.jpeg?auto=compress&cs=tinysrgb&w=200",
    status: "PUBLISHED",
    createdAt: "2024-11-10",
  },
];

let websiteReviewSequence = WEBSITE_REVIEW_ENTRIES.reduce(
  (max, entry) => Math.max(max, Number(entry && entry.reviewId) || 0),
  0
);

let tourTypeSequence = tourTypes.reduce(
  (max, entry) => Math.max(max, Number(entry && entry.tourTypeId) || 0),
  tourTypes.length
);

const OFFICE_DETAIL_ENTRIES = [
  {
    officedetailId: 1,
    cityName: "Pune",
    address: "5th Floor, Seasons Business Square, Magarpatta Road",
    officeTiming: "Mon-Sat 10:00 AM - 7:00 PM",
    contactNo: "02071234567",
    email: "pune.office@waari.travel",
  },
  {
    officedetailId: 2,
    cityName: "Mumbai",
    address: "Unit 803, Nariman Point Corporate Park, Marine Drive",
    officeTiming: "Mon-Sat 9:30 AM - 6:30 PM",
    contactNo: "02288997744",
    email: "mumbai.office@waari.travel",
  },
  {
    officedetailId: 3,
    cityName: "Bengaluru",
    address: "11th Cross, Indiranagar 2nd Stage",
    officeTiming: "Mon-Sat 10:00 AM - 6:00 PM",
    contactNo: "08061234567",
    email: "blr.office@waari.travel",
  },
  {
    officedetailId: 4,
    cityName: "Hyderabad",
    address: "Plot 64, Kavuri Hills, Madhapur",
    officeTiming: "Mon-Sat 10:30 AM - 7:30 PM",
    contactNo: "04066778899",
    email: "hyd.office@waari.travel",
  },
  {
    officedetailId: 5,
    cityName: "Ahmedabad",
    address: "405 Titanium Square, Thaltej Cross Road",
    officeTiming: "Mon-Sat 10:00 AM - 6:30 PM",
    contactNo: "07966554433",
    email: "ahm.office@waari.travel",
  },
];

let officeDetailSequence = OFFICE_DETAIL_ENTRIES.reduce(
  (max, entry) => Math.max(max, Number(entry && entry.officedetailId) || 0),
  OFFICE_DETAIL_ENTRIES.length
);

const deriveInitialGroupPaymentSequence = () => {
  if (!groupPaymentOverrides || typeof groupPaymentOverrides !== "object") {
    return 900000;
  }
  const keys = Object.keys(groupPaymentOverrides);
  if (!keys.length) {
    return 900000;
  }
  return Math.max(
    900000,
    keys.reduce((max, key) => {
      const numericKey = Number(key);
      if (Number.isFinite(numericKey) && numericKey > max) {
        return numericKey;
      }
      const storedId = Number(groupPaymentOverrides[key]?.groupPaymentDetailId);
      return Number.isFinite(storedId) && storedId > max ? storedId : max;
    }, 900000)
  );
};

let groupPaymentDetailSequence = deriveInitialGroupPaymentSequence();

const nextGroupPaymentDetailId = () => {
  groupPaymentDetailSequence += 1;
  return groupPaymentDetailSequence;
};

const BILLING_DEFAULT_METRICS = {
  loyaltyBooking: 9,
  welcomeBooking: 4,
  referralRate: 37,
  nextRankCount: 5,
  topTenRankCount: 8,
  topFiveRankCount: 3,
  currentBookingCount: 42,
};

const DEFAULT_BIRTHDAY_SEEDS = [
  {
    familyHeadName: "Amit Sharma",
    contact: "+91 9823012345",
    dobOffsetDays: -12000,
    marriageOffsetDays: -3200,
  },
  {
    familyHeadName: "Priya Patel",
    contact: "+91 9876544110",
    dobOffsetDays: -11800,
    marriageOffsetDays: -2900,
  },
  {
    familyHeadName: "Rohan Kulkarni",
    contact: "+91 9811122233",
    dobOffsetDays: -11550,
    marriageOffsetDays: -2500,
  },
];

const BILLING_DEFAULT_TOP_SALES = [
  {
    userName: "Sales Admin",
    domesticCountGt: 6,
    internationalCountGt: 2,
    total_count_gt: 8,
    domesticCountCt: 4,
    internationalCountCt: 1,
    total_count_ct: 5,
    total_count_overall: 13,
    todaysBooking: 1,
    isFirst: true,
  },
  {
    userName: "Neeraj Joshi",
    domesticCountGt: 4,
    internationalCountGt: 1,
    total_count_gt: 5,
    domesticCountCt: 3,
    internationalCountCt: 1,
    total_count_ct: 4,
    total_count_overall: 9,
    todaysBooking: 0,
  },
  {
    userName: "Anita Rao",
    domesticCountGt: 3,
    internationalCountGt: 2,
    total_count_gt: 5,
    domesticCountCt: 2,
    internationalCountCt: 1,
    total_count_ct: 3,
    total_count_overall: 8,
    todaysBooking: 1,
  },
];

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
  const primaryCityId = cityIds.length ? cityIds[0] : null;
  const enquiryDetailCustomId =
    toPositiveInt(override.enquiryDetailCustomId, null) ||
    toPositiveInt(base.enquiryDetailCustomId, null) ||
    toPositiveInt(customEnquiryDetailTemplate.enquiryDetailCustomId, null) ||
    Number(`${id}01`);

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
    cityId: override.cityId ?? base.cityId ?? primaryCityId,
    enquiryDetailCustomId,
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

const DEFAULT_ASSIGNABLE_USERS = [
  {
    userId: DEFAULT_FOLLOW_UP_USER_ID,
    userName: "Ananya Sharma",
    roleName: "Senior Travel Consultant",
    email: "ananya.sharma@waari.travel",
    contact: "9767807070",
    department: "Presales",
    location: "Pune",
    availability: "Available",
    ongoingLeads: 8,
  },
  {
    userId: 9002,
    userName: "Vikram Rao",
    roleName: "Group Tour Specialist",
    email: "vikram.rao@waari.travel",
    contact: "9822334455",
    department: "Group Tours",
    location: "Mumbai",
    availability: "In Follow-up",
    ongoingLeads: 6,
  },
  {
    userId: 9003,
    userName: "Lisa Pereira",
    roleName: "Custom Experience Lead",
    email: "lisa.pereira@waari.travel",
    contact: "9811122233",
    department: "Custom Tours",
    location: "Bengaluru",
    availability: "Available",
    ongoingLeads: 5,
  },
  {
    userId: 9004,
    userName: "Rahul Menon",
    roleName: "Corporate Travel Manager",
    email: "rahul.menon@waari.travel",
    contact: "9890098900",
    department: "Corporate",
    location: "Hyderabad",
    availability: "Reviewing",
    ongoingLeads: 7,
  },
  {
    userId: 9005,
    userName: "Sia Kapadia",
    roleName: "Luxury Journey Advisor",
    email: "sia.kapadia@waari.travel",
    contact: "9833112233",
    department: "Premium",
    location: "Delhi",
    availability: "Available",
    ongoingLeads: 4,
  },
];

let assignableUsersCache = [];

const mapDefaultAssignableUsers = () =>
  DEFAULT_ASSIGNABLE_USERS.map((user, index) => ({
    userId: user.userId,
    userName: user.userName,
    roleName: user.roleName,
    email: user.email,
    contact: user.contact,
    department: user.department,
    location: user.location,
    availability: user.availability,
    ongoingLeads: user.ongoingLeads,
    priority: index + 1,
  }));

const setAssignableUsersCache = (users) => {
  assignableUsersCache = users && users.length ? users : mapDefaultAssignableUsers();
  return assignableUsersCache;
};

const getAssignableUsersCache = () => {
  if (!assignableUsersCache || !assignableUsersCache.length) {
    assignableUsersCache = mapDefaultAssignableUsers();
  }
  return assignableUsersCache;
};

const formatAssignableUserRow = (row, index = 0) => {
  const locationParts = [trimTextValue(row.city), trimTextValue(row.state)].filter(Boolean);
  return {
    userId: row.userId,
    userName: trimTextValue(row.userName) || trimTextValue(row.fullName) || `User ${row.userId}`,
    roleName: trimTextValue(row.roleName),
    email: trimTextValue(row.email),
    contact: trimTextValue(row.contact),
    department: trimTextValue(row.departmentName),
    location: locationParts.join(", "),
    availability: row.status ? "Available" : "Unavailable",
    ongoingLeads: 0,
    priority: index + 1,
  };
};

const listAssignToUsers = async () => {
  const [rows] = await pool.query(`
    SELECT
      u.userId,
      u.userName,
      TRIM(CONCAT(u.firstName, ' ', u.lastName)) AS fullName,
      u.email,
      u.contact,
      u.status,
      u.city,
      u.state,
      r.roleName,
      d.departmentName
    FROM users u
    LEFT JOIN roles r ON r.roleId = u.roleId
    LEFT JOIN departments d ON d.departmentId = u.departmentId
    WHERE u.status = 1
    ORDER BY COALESCE(NULLIF(u.userName, ''), NULLIF(fullName, ''), u.email, u.contact) ASC
  `);
  const users = rows.length ? rows.map((row, index) => formatAssignableUserRow(row, index)) : mapDefaultAssignableUsers();
  return setAssignableUsersCache(users);
};

const resolveAssignableUserMeta = (userId) => {
  const options = getAssignableUsersCache();
  if (!options.length) {
    return { userId: DEFAULT_FOLLOW_UP_USER_ID, userName: "Waari Team" };
  }
  if (!userId) {
    return options[0];
  }
  return options.find((user) => Number(user.userId) === Number(userId)) || options[0];
};

const fetchAssignableUserMeta = async (userId) => {
  if (!userId) {
    const options = getAssignableUsersCache();
    return options[0] || { userId: DEFAULT_FOLLOW_UP_USER_ID, userName: "Waari Team" };
  }
  const options = getAssignableUsersCache();
  const cached = options.find((user) => Number(user.userId) === Number(userId));
  if (cached) {
    return cached;
  }
  const [rows] = await pool.query(`
    SELECT
      u.userId,
      u.userName,
      TRIM(CONCAT(u.firstName, ' ', u.lastName)) AS fullName,
      u.email,
      u.contact,
      u.status,
      u.city,
      u.state,
      r.roleName,
      d.departmentName
    FROM users u
    LEFT JOIN roles r ON r.roleId = u.roleId
    LEFT JOIN departments d ON d.departmentId = u.departmentId
    WHERE u.userId = ?
    LIMIT 1
  `, [userId]);
  if (!rows.length) {
    return { userId, userName: `User ${userId}` };
  }
  const cache = getAssignableUsersCache();
  const user = formatAssignableUserRow(rows[0], cache.length);
  setAssignableUsersCache([...cache, user]);
  return user;
};

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
    enquiryCustomId: 304,
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: "Ananya Sharma",
    nextFollowUpOffset: -1,
    enquiryDateOffset: -20,
    nextFollowUpTime: "04:15 PM",
  },
];

const MANUAL_GROUP_ENQUIRY_OFFSET = 600000;

const nextManualGroupEnquiryId = () =>
  groupTourEnquiries.reduce(
    (max, record) => Math.max(max, Number(record && record.enquiryGroupId) || 0),
    MANUAL_GROUP_ENQUIRY_OFFSET
  ) + 1;

const normalizeFollowUpDate = (value, fallbackDate = startOfToday()) => {
  const parsed = toDate(value);
  if (parsed) {
    return formatDateOnly(parsed);
  }
  if (typeof value === "string" && value.trim()) {
    const normalized = new Date(value);
    if (!Number.isNaN(normalized.getTime())) {
      return formatDateOnly(normalized);
    }
  }
  return formatDateOnly(fallbackDate);
};
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

const selectSanitizedValue = (value, fallback = "") => {
  if (value === undefined || value === null) {
    return fallback;
  }
  const text = sanitizeText(value);
  return text || fallback;
};

const toSortableTimestamp = (value) => {
  if (!value) {
    return 0;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

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

const resolvePriorityMeta = (priorityId, fallbackName = "") => {
  const id = toPositiveInt(priorityId, null);
  if (!id) {
    return { priorityId: null, priorityName: fallbackName }; 
  }
  const priority = priorities.find((item) => Number(item.priorityId) === id);
  return { priorityId: id, priorityName: priority ? priority.priorityName : fallbackName || `Priority ${id}` };
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
  const enquiryDetail = buildGroupEnquiryDetail(enquiryGroupId) || {};
  const priorityMeta = resolvePriorityMeta(enquiryDetail.priorityId, enquiryDetail.priorityName || "");
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
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    guestRefId: enquiryDetail.guestRefId || "",
    familyHeadNo: toPositiveInt(enquiryDetail.familyHeadNo, null) || 1,
    startDate: tour.startDate,
    endDate: tour.endDate,
    enquiryDate: formatDateOnly(addDaysToDate(baseDate, enquiryOffset)),
    nextFollowUp: formatDateOnly(addDaysToDate(baseDate, followUpOffset)),
    nextFollowUpTime: plan.nextFollowUpTime || "10:00 AM",
    assignedUserId: assignedMeta.assignedUserId,
    assignedUserName: assignedMeta.assignedUserName,
    notes: plan.notes || "",
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
  const priorityMeta = resolvePriorityMeta(plan.priorityId || detail.priorityId, detail.priorityName || "Medium");
  const assignedMeta =
    plan.assignedUserId || plan.assignedUserName
      ? {
          assignedUserId: toPositiveInt(plan.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
          assignedUserName: plan.assignedUserName || "Waari Team",
        }
      : resolveAssignableUserMeta(plan.assignedUserId);
  const familyHeadNo = toPositiveInt(plan.familyHeadNo, null) || toPositiveInt(detail.familyHeadNo, null) || 1;
  const nextFollowUpOffset = plan.nextFollowUpOffset ?? index + 1;
  const nextFollowUp = plan.nextFollowUp || formatDateOnly(addDaysToDate(baseDate, nextFollowUpOffset));
  const nextFollowUpTime = plan.nextFollowUpTime || "10:00 AM";
  const enquiryDate = plan.enquiryDate || formatDateOnly(addDaysToDate(baseDate, -(index + 1)));
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
    destinationId: detail.destinationId || null,
    destinationName: detail.destinationName || "",
    countryId: detail.countryId || null,
    countryName: detail.countryName || "",
    stateId: detail.stateId || null,
    stateName: detail.stateName || "",
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    familyHeadNo,
    nextFollowUp,
    nextFollowUpTime,
    enquiryDate,
    assignedUserId: assignedMeta.userId,
    assignedUserName: assignedMeta.userName,
    mealPlanId: toPositiveInt(plan.mealPlanId, null) || detail.mealPlanId || null,
    hotelCatId: toPositiveInt(plan.hotelCatId, null) || detail.hotelCatId || null,
    rooms: toPositiveInt(plan.rooms, null) || toPositiveInt(detail.rooms, null) || null,
    notes: plan.notes || detail.notes || "",
  };
};

const applyGroupPlanAssignmentOverride = (record) => {
  const override = groupPlanEnquiryAssignments[record.planEnqId];
  if (!override) {
    return record;
  }
  const priorityMeta = override.priorityId
    ? resolvePriorityMeta(override.priorityId, override.priorityName || record.priorityName)
    : { priorityId: record.priorityId, priorityName: record.priorityName };
  const referenceMeta = override.enquiryReferId
    ? resolvePlanEnquiryReference({ enquiryReferId: override.enquiryReferId }, record.enquiryReferId)
    : { enquiryReferId: record.enquiryReferId, enquiryReferName: record.enquiryReferName };
  const assignedMeta = override.assignedUserId || override.assignedUserName
    ? {
        assignedUserId: toPositiveInt(override.assignedUserId, record.assignedUserId) || record.assignedUserId,
        assignedUserName:
          override.assignedUserName ||
          resolveAssignableUserMeta(override.assignedUserId || record.assignedUserId).userName,
      }
    : { assignedUserId: record.assignedUserId, assignedUserName: record.assignedUserName };
  const adults = toPositiveInt(override.adults, null);
  const child = toPositiveInt(override.child, null);
  const paxOverride = toPositiveInt(override.noOfTravelPeople, null);
  const totalPax = Math.max(
    1,
    paxOverride || (adults || 0) + (child || 0) || record.noOfTravelPeople || 1
  );
  return {
    ...record,
    firstName: override.firstName || record.firstName,
    groupName: override.groupName || record.groupName,
    contactNo: override.contactNo || record.contactNo,
    email: override.email || record.email,
    noOfTravelPeople: totalPax,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    guestRefId: override.guestRefId || record.guestRefId,
    familyHeadNo: toPositiveInt(override.familyHeadNo, null) || record.familyHeadNo || 1,
    nextFollowUp: override.nextFollowUp || record.nextFollowUp,
    nextFollowUpTime: override.nextFollowUpTime || record.nextFollowUpTime,
    assignedUserId: assignedMeta.assignedUserId,
    assignedUserName: assignedMeta.assignedUserName,
    notes: override.notes || record.notes,
  };
};

const applyCustomPlanAssignmentOverride = (record) => {
  const override = customPlanEnquiryAssignments[record.planEnqId];
  if (!override) {
    return record;
  }
  const priorityMeta = override.priorityId
    ? resolvePriorityMeta(override.priorityId, override.priorityName || record.priorityName)
    : { priorityId: record.priorityId, priorityName: record.priorityName };
  const referenceMeta = override.enquiryReferId
    ? resolvePlanEnquiryReference({ enquiryReferId: override.enquiryReferId }, record.enquiryReferId)
    : { enquiryReferId: record.enquiryReferId, enquiryReferName: record.enquiryReferName };
  const assignedMeta = override.assignedUserId || override.assignedUserName
    ? {
        assignedUserId: toPositiveInt(override.assignedUserId, record.assignedUserId) || record.assignedUserId,
        assignedUserName:
          override.assignedUserName ||
          resolveAssignableUserMeta(override.assignedUserId || record.assignedUserId).userName,
      }
    : { assignedUserId: record.assignedUserId, assignedUserName: record.assignedUserName };
  const paxOverride = toPositiveInt(override.noOfTravelPeople, null);
  return {
    ...record,
    firstName: override.firstName || record.firstName,
    groupName: override.groupName || record.groupName,
    contactNo: override.contactNo || record.contactNo,
    email: override.email || record.email,
    destinationId: override.destinationId || record.destinationId,
    destinationName: override.destinationName || record.destinationName,
    countryId: override.countryId || record.countryId,
    countryName: override.countryName || record.countryName,
    stateId: override.stateId || record.stateId,
    stateName: override.stateName || record.stateName,
    noOfTravelPeople: Math.max(1, paxOverride || record.noOfTravelPeople || 1),
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    familyHeadNo: toPositiveInt(override.familyHeadNo, null) || record.familyHeadNo || 1,
    nextFollowUp: override.nextFollowUp || record.nextFollowUp,
    nextFollowUpTime: override.nextFollowUpTime || record.nextFollowUpTime,
    assignedUserId: assignedMeta.assignedUserId,
    assignedUserName: assignedMeta.assignedUserName,
    hotelCatId: override.hotelCatId || record.hotelCatId,
    mealPlanId: override.mealPlanId || record.mealPlanId,
    rooms: override.rooms || record.rooms,
    notes: override.notes || record.notes,
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
  return seeds
    .map((plan, index) => createGroupPlanEnquiryRecord(plan, baseDate, index))
    .filter(Boolean)
    .map((record) => applyGroupPlanAssignmentOverride(record));
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
  return seeds
    .map((plan, index) => createCustomPlanEnquiryRecord(plan, baseDate, index))
    .filter(Boolean)
    .map((record) => applyCustomPlanAssignmentOverride(record));
};

const findGroupPlanEnquiryById = (planEnqId) => {
  const id = toPositiveInt(planEnqId, null);
  if (!id) {
    return null;
  }
  return buildGroupPlanEnquiryRecords().find((entry) => Number(entry.planEnqId) === id) || null;
};

const findCustomPlanEnquiryById = (planEnqId) => {
  const id = toPositiveInt(planEnqId, null);
  if (!id) {
    return null;
  }
  return buildCustomPlanEnquiryRecords().find((entry) => Number(entry.planEnqId) === id) || null;
};

const buildGroupPlanEnquiryView = (record) => {
  if (!record) {
    return null;
  }
  const tour = resolveGroupTourRecord(record.groupTourId);
  const detail = buildGroupEnquiryDetail(record.enquiryGroupId) || {};
  const paxFallback =
    toPositiveInt(record.noOfTravelPeople, null) ||
    toPositiveInt(detail.adults, null) + toPositiveInt(detail.child, null) ||
    resolveGroupPaxCount(tour) ||
    1;
  const priorityMeta = resolvePriorityMeta(record.priorityId || detail.priorityId, record.priorityName || detail.priorityName || "");
  const referenceMeta = resolvePlanEnquiryReference({ enquiryReferId: record.enquiryReferId }, detail.enquiryReferId);
  const familyHeadNo = toPositiveInt(record.familyHeadNo, null) || toPositiveInt(detail.familyHeadNo, null) || 1;
  const adults = record.adults ?? toPositiveInt(detail.adults, null) ?? null;
  const child = record.child ?? toPositiveInt(detail.child, null) ?? null;
  return {
    planEnqId: record.planEnqId,
    enquiryGroupId: record.enquiryGroupId,
    groupTourId: record.groupTourId,
    tourName: record.tourName || tour?.tourName || detail.tourName || "",
    groupName: record.groupName || detail.groupName || tour?.groupName || tour?.tourName || "",
    firstName: record.firstName || detail.fullName || deriveGuestName(tour),
    contactNo: record.contactNo || detail.contact || resolveContact(tour),
    email: record.email || detail.email || tour?.email || "",
    noOfTravelPeople: paxFallback,
    adults,
    child,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    hearAbout: referenceMeta.enquiryReferId,
    guestRefId: record.guestRefId || detail.guestRefId || "",
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    familyHeadNo,
    nextFollowUp: record.nextFollowUp || null,
    nextFollowUpTime: record.nextFollowUpTime || "",
    enquiryDate: record.enquiryDate || null,
    startDate: record.startDate || tour?.startDate || null,
    endDate: record.endDate || tour?.endDate || null,
    assignedUserId: record.assignedUserId || null,
    assignedUserName: record.assignedUserName || "Waari Team",
    notes: record.notes || "",
    cityName: tour?.cityName || "",
    destinationId: tour?.destinationId || null,
    countryId: tour?.countryId || null,
    stateId: tour?.stateId || null,
  };
};

const buildCustomPlanEnquiryView = (record) => {
  if (!record) {
    return null;
  }
  const detail = buildCustomEnquiryDetail(record.enquiryCustomId) || {};
  const startDate = record.startDate || detail.startDate || null;
  const endDate = record.endDate || detail.endDate || null;
  const priorityMeta = resolvePriorityMeta(
    record.priorityId || detail.priorityId,
    record.priorityName || detail.priorityName || "Medium"
  );
  const referenceMeta = resolvePlanEnquiryReference({ enquiryReferId: record.enquiryReferId }, detail.enquiryReferId);
  const familyHeadNo = toPositiveInt(record.familyHeadNo, null) || toPositiveInt(detail.familyHeadNo, null) || 1;
  return {
    planEnqId: record.planEnqId,
    enquiryCustomId: record.enquiryCustomId,
    firstName: record.firstName || detail.fullName || detail.contactName || "",
    groupName: record.groupName || detail.groupName || detail.tourName || "",
    contactNo: record.contactNo || detail.contact || detail.phoneNo || "",
    email: record.email || detail.mailId || "",
    destinationId: record.destinationId || detail.destinationId || null,
    destinationName: record.destinationName || detail.destinationName || "",
    countryId: record.countryId || detail.countryId || null,
    countryName: record.countryName || detail.countryName || "",
    stateId: record.stateId || detail.stateId || null,
    stateName: record.stateName || detail.stateName || "",
    startDate,
    endDate,
    noOfTravelPeople: toPositiveInt(record.noOfTravelPeople, null) || toPositiveInt(detail.adults, null) || 2,
    adults: detail.adults || null,
    child: detail.child || null,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    hearAbout: referenceMeta.enquiryReferId,
    cityIds: detail.cityIds || [],
    cities: detail.cities || "[]",
    requirements: detail.requirements || [],
    experiences: detail.experiences || [],
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    familyHeadNo,
    nextFollowUp: record.nextFollowUp || null,
    nextFollowUpTime: record.nextFollowUpTime || "",
    assignedUserId: record.assignedUserId || null,
    assignedUserName: record.assignedUserName || "Waari Team",
    hotelCatId: toPositiveInt(record.hotelCatId, null) || null,
    mealPlanId: toPositiveInt(record.mealPlanId, null) || null,
    rooms: toPositiveInt(record.rooms, null) || null,
    notes: record.notes || "",
    enquiryDate: record.enquiryDate || null,
  };
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

const buildManualGroupFollowUpRecords = () => {
  if (!groupTourEnquiries.length) {
    return [];
  }
  return groupTourEnquiries.map((entry) => {
    const tour = resolveGroupTourRecord(entry.groupTourId || entry.enquiryGroupId);
    const assigned =
      entry.assignedUserId || entry.assignedUserName
        ? {
            assignedUserId: toPositiveInt(entry.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) ||
              DEFAULT_FOLLOW_UP_USER_ID,
            assignedUserName: entry.assignedUserName || "Waari Team",
          }
        : resolveAssignedUser(tour || {});
    const nextFollowUp = normalizeFollowUpDate(entry.nextFollowUp);
    const enquiryDate = entry.enquiryDate ? normalizeFollowUpDate(entry.enquiryDate) : nextFollowUp;
    const adults = toPositiveInt(entry.adults, null) || 0;
    const child = toPositiveInt(entry.child, null) || 0;
    const paxNo = toPositiveInt(entry.paxNo, null) || Math.max(1, adults + child || 1);
    return {
      type: "GROUP",
      enquiryGroupId: entry.enquiryGroupId,
      uniqueEnqueryId: entry.uniqueEnqueryId,
      groupName: entry.groupName || tour?.groupName || tour?.tourName || "Group Enquiry",
      tourName: tour?.tourName || entry.groupName || "Group Tour",
      guestName: entry.fullName || entry.guestName || "Primary Guest",
      userName: assigned.assignedUserName,
      assignedUserId: assigned.assignedUserId,
      assignedUserName: assigned.assignedUserName,
      paxNo,
      nextFollowUp,
      nextFollowUpTime: entry.nextFollowUpTime || "10:00 AM",
      enquiryDate,
      startDate: tour?.startDate || null,
      endDate: tour?.endDate || null,
      cityName: tour?.cityName || "",
      status: entry.status || "ENQUIRY",
      workflowStage: entry.workflowStage || "ENQUIRY",
      category: tour?.category || "GROUP",
      tourTypeName: tour?.tourTypeName || "",
    };
  });
};

const buildGroupFollowUpRecords = () => {
  const baseDate = startOfToday();
  const manualRecords = buildManualGroupFollowUpRecords();
  const seededRecords = groupFollowUpPlan.map((plan) => createGroupFollowUpRecord(plan, baseDate)).filter(Boolean);
  return [...manualRecords, ...seededRecords];
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

const getPlanEnquiryUserDataGt = ({ planEnqId } = {}) => {
  const record = findGroupPlanEnquiryById(planEnqId);
  if (!record) {
    return { data: {}, message: "Group plan enquiry not found" };
  }
  const data = buildGroupPlanEnquiryView(record) || {};
  return {
    data,
    message: "Group plan enquiry fetched successfully",
  };
};

const getPlanEnquiryUserDataCt = ({ planEnqId } = {}) => {
  const record = findCustomPlanEnquiryById(planEnqId);
  if (!record) {
    return { data: {}, message: "Custom plan enquiry not found" };
  }
  const data = buildCustomPlanEnquiryView(record) || {};
  return {
    data,
    message: "Custom plan enquiry fetched successfully",
  };
};

const assignUserToPlanEnquiryGt = async (payload = {}) => {
  const planEnqId = toPositiveInt(payload.planEnqId, null);
  if (!planEnqId) {
    return null;
  }
  const record = findGroupPlanEnquiryById(planEnqId);
  if (!record) {
    return null;
  }
  const assignedMeta = await fetchAssignableUserMeta(payload.assignTo ?? payload.assignedUserId);
  const adults = toPositiveInt(payload.adults, null);
  const child = toPositiveInt(payload.child, null);
  const paxOverride = toPositiveInt(payload.noOfTravelPeople, null);
  const totalPax = Math.max(
    1,
    paxOverride || (adults || 0) + (child || 0) || record.noOfTravelPeople || 1
  );
  const priorityInput = payload.priorityId !== undefined ? payload.priorityId : record.priorityId;
  const priorityMeta = resolvePriorityMeta(priorityInput, payload.priorityName || record.priorityName || "");
  const referenceMeta =
    payload.enquiryReferId !== undefined
      ? resolvePlanEnquiryReference({ enquiryReferId: payload.enquiryReferId }, record.enquiryReferId)
      : { enquiryReferId: record.enquiryReferId, enquiryReferName: record.enquiryReferName };
  const nextFollow = normalizeFollowUpDate(payload.nextFollowUp, toDate(record.nextFollowUp) || startOfToday());
  const override = groupPlanEnquiryAssignments[planEnqId] || {};
  groupPlanEnquiryAssignments[planEnqId] = {
    ...override,
    planEnqId,
    assignedUserId: assignedMeta.userId,
    assignedUserName: assignedMeta.userName,
    firstName: sanitizeText(payload.fullName) || record.firstName,
    groupName: sanitizeText(payload.groupName) || record.groupName,
    contactNo: sanitizeText(payload.contact) || record.contactNo,
    email: sanitizeText(payload.mail) || record.email,
    noOfTravelPeople: totalPax,
    adults,
    child,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    guestRefId: payload.guestRefId || record.guestRefId || "",
    familyHeadNo: toPositiveInt(payload.familyHeadNo, null) || record.familyHeadNo || 1,
    nextFollowUp: nextFollow,
    nextFollowUpTime: payload.nextFollowUpTime || record.nextFollowUpTime || "10:00 AM",
    notes: sanitizeText(payload.note || payload.notes) || record.notes || "",
    updatedAt: new Date().toISOString(),
  };
  await persistTourFixture("groupPlanEnquiryAssignments");
  const updatedRecord = applyGroupPlanAssignmentOverride(findGroupPlanEnquiryById(planEnqId));
  return {
    planEnqId,
    assignedUserId: assignedMeta.userId,
    assignedUserName: assignedMeta.userName,
    nextFollowUp: updatedRecord?.nextFollowUp || nextFollow,
    nextFollowUpTime: updatedRecord?.nextFollowUpTime || payload.nextFollowUpTime || record.nextFollowUpTime || "10:00 AM",
    data: buildGroupPlanEnquiryView(updatedRecord || record),
    message: "Plan enquiry assignment updated successfully",
  };
};

const assignUserToPlanEnquiryCt = async (payload = {}) => {
  const planEnqId = toPositiveInt(payload.planEnqId, null);
  if (!planEnqId) {
    return null;
  }
  const record = findCustomPlanEnquiryById(planEnqId);
  if (!record) {
    return null;
  }
  const assignedMeta = await fetchAssignableUserMeta(payload.assignTo ?? payload.assignedUserId);
  const paxOverride = toPositiveInt(payload.noOfTravelPeople, null);
  const totalPax = Math.max(1, paxOverride || record.noOfTravelPeople || 1);
  const priorityInput = payload.priorityId !== undefined ? payload.priorityId : record.priorityId;
  const priorityMeta = resolvePriorityMeta(priorityInput, payload.priorityName || record.priorityName || "");
  const referenceMeta =
    payload.enquiryReferId !== undefined
      ? resolvePlanEnquiryReference({ enquiryReferId: payload.enquiryReferId }, record.enquiryReferId)
      : { enquiryReferId: record.enquiryReferId, enquiryReferName: record.enquiryReferName };
  const nextFollow = normalizeFollowUpDate(payload.nextFollowUp, toDate(record.nextFollowUp) || startOfToday());
  const override = customPlanEnquiryAssignments[planEnqId] || {};
  customPlanEnquiryAssignments[planEnqId] = {
    ...override,
    planEnqId,
    assignedUserId: assignedMeta.userId,
    assignedUserName: assignedMeta.userName,
    firstName: sanitizeText(payload.fullName) || record.firstName,
    groupName: sanitizeText(payload.groupName) || record.groupName,
    contactNo: sanitizeText(payload.contact) || record.contactNo,
    email: sanitizeText(payload.mail) || record.email,
    destinationId: toPositiveInt(payload.destinationId, null) || record.destinationId || null,
    countryId: toPositiveInt(payload.countryId, null) || record.countryId || null,
    stateId: toPositiveInt(payload.stateId, null) || record.stateId || null,
    noOfTravelPeople: totalPax,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    familyHeadNo: toPositiveInt(payload.familyHeadNo, null) || record.familyHeadNo || 1,
    nextFollowUp: nextFollow,
    nextFollowUpTime: payload.nextFollowUpTime || record.nextFollowUpTime || "10:00 AM",
    hotelCatId: toPositiveInt(payload.hotelCatId, null) || record.hotelCatId || null,
    mealPlanId: toPositiveInt(payload.mealPlanId, null) || record.mealPlanId || null,
    rooms: toPositiveInt(payload.rooms, null) || record.rooms || null,
    notes: sanitizeText(payload.note || payload.notes) || record.notes || "",
    updatedAt: new Date().toISOString(),
  };
  await persistTourFixture("customPlanEnquiryAssignments");
  const updatedRecord = applyCustomPlanAssignmentOverride(findCustomPlanEnquiryById(planEnqId));
  return {
    planEnqId,
    assignedUserId: assignedMeta.userId,
    assignedUserName: assignedMeta.userName,
    nextFollowUp: updatedRecord?.nextFollowUp || nextFollow,
    nextFollowUpTime: updatedRecord?.nextFollowUpTime || payload.nextFollowUpTime || record.nextFollowUpTime || "10:00 AM",
    data: buildCustomPlanEnquiryView(updatedRecord || record),
    message: "Custom plan enquiry assignment updated successfully",
  };
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

const resolveCustomPaymentSummary = (enquiryCustomId) =>
  buildCustomPaymentSummaries().find((entry) => Number(entry.enquiryCustomId) === Number(enquiryCustomId));

const resolveCustomDetailFromIds = ({ enquiryDetailCustomId, enquiryCustomId } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (id) {
    const detail = buildCustomEnquiryDetail(id);
    if (detail) {
      return detail;
    }
  }
  const detailId = toPositiveInt(enquiryDetailCustomId, null);
  if (detailId) {
    const matchedId = collectCustomEnquiryIds().find((value) => {
      const record = buildCustomEnquiryDetail(value);
      return record && Number(record.enquiryDetailCustomId) === detailId;
    });
    if (matchedId) {
      return buildCustomEnquiryDetail(matchedId);
    }
  }
  return null;
};

const getCustomPaymentOverrides = (detailId) => {
  const id = toPositiveInt(detailId, null);
  if (!id) {
    return {};
  }
  if (!customPaymentOverrides[id]) {
    customPaymentOverrides[id] = {};
  }
  return customPaymentOverrides[id];
};

const buildCustomAdvancePayments = (detail, summary) => {
  const overrides = getCustomPaymentOverrides(detail.enquiryDetailCustomId);
  const baseDate = toDate(summary.startDate) || new Date();
  const entries = [];
  const primaryPaymentId = Number(`${detail.enquiryDetailCustomId}1`);
  entries.push({
    customPayDetailId: primaryPaymentId,
    enquiryDetailCustomId: detail.enquiryDetailCustomId,
    enquiryCustomId: detail.enquiryCustomId,
    advancePayment: summary.advancePayment,
    status: 1,
    paymentModeId: 1,
    onlineTypeId: 1,
    paymentDate: summary.startDate,
    transactionId: `UPI${primaryPaymentId}`,
    transactionProof: `${DOCUMENT_BASE_URL}/payments/custom-${primaryPaymentId}.pdf`,
    receiptNo: `${summary.uniqueEnqueryId}-R1`,
  });
  if (summary.balance > 0) {
    const secondaryId = Number(`${detail.enquiryDetailCustomId}2`);
    entries.push({
      customPayDetailId: secondaryId,
      enquiryDetailCustomId: detail.enquiryDetailCustomId,
      enquiryCustomId: detail.enquiryCustomId,
      advancePayment: Math.min(summary.balance, summary.advancePayment / 2),
      status: 0,
      paymentModeId: 2,
      paymentDate: formatDateOnly(addDaysToDate(baseDate, 5)),
      bankName: "Waari Finance Bank",
      chequeNo: `CQ${secondaryId}`,
      receiptNo: `${summary.uniqueEnqueryId}-R2`,
    });
  }
  return entries.map((entry, index) => {
    const override = overrides[entry.customPayDetailId] || {};
    const paymentModeMeta = resolvePaymentModeMeta(override.paymentModeId ?? entry.paymentModeId);
    const onlineMeta = resolveOnlineTypeMeta(override.onlineTypeId ?? entry.onlineTypeId);
    const cardMeta = resolveCardTypeMeta(override.cardTypeId ?? entry.cardTypeId);
    return {
      ...entry,
      ...override,
      status: override.status ?? entry.status,
      paymentModeId: paymentModeMeta.paymentModeId,
      paymentModeName: override.paymentModeName || paymentModeMeta.paymentModeName,
      paymentMode: override.paymentModeName || paymentModeMeta.paymentModeName,
      onlineTypeId: onlineMeta.onlineTypeId,
      onlineTypeName: override.onlineTypeName || onlineMeta.onlineTypeName,
      cardTypeId: cardMeta.cardTypeId,
      cardTypeName: override.cardTypeName || cardMeta.cardTypeName,
      paymentDate: override.paymentDate || entry.paymentDate,
      bankName: override.bankName || entry.bankName || "Waari Bank",
      chequeNo: override.chequeNo || entry.chequeNo || "",
      transactionId: override.transactionId || entry.transactionId || `TXN${entry.customPayDetailId}`,
      transactionProof:
        override.transactionProof || entry.transactionProof || `${DOCUMENT_BASE_URL}/payments/custom-${entry.customPayDetailId}.pdf`,
    };
  });
};

const buildCustomBillingData = (detail, summary) => {
  const advancePayments = buildCustomAdvancePayments(detail, summary);
  const paidAmount = advancePayments
    .filter((payment) => Number(payment.status) === 1)
    .reduce((total, payment) => total + toNumber(payment.advancePayment, 0), 0);
  const balance = Math.max(0, summary.grandTotal - paidAmount);
  return {
    enquiryCustomId: detail.enquiryCustomId,
    enquiryDetailCustomId: detail.enquiryDetailCustomId,
    billingName: detail.billingName || detail.groupName || detail.contactName || detail.fullName || "Travel Guest",
    address: detail.address || `${detail.stateName || detail.destinationName || "Pune"}, ${detail.countryName || "India"}`,
    phoneNumber: detail.contact || detail.phoneNo || COMPANY_PROFILE.phone,
    gstIn: detail.gstIn || COMPANY_PROFILE.gstIn,
    panNumber: detail.panNumber || COMPANY_PROFILE.panNo,
    grandTotal: summary.grandTotal,
    balance,
    isPaymentDone: balance <= 0,
    advancePayments,
  };
};

const getCustomBillView = ({ enquiryDetailCustomId, enquiryCustomId } = {}) => {
  const detail = resolveCustomDetailFromIds({ enquiryDetailCustomId, enquiryCustomId });
  if (!detail) {
    return { data: {}, message: "Customized enquiry not found" };
  }
  const summary = resolveCustomPaymentSummary(detail.enquiryCustomId) || {
    enquiryCustomId: detail.enquiryCustomId,
    grandTotal: 0,
    advancePayment: 0,
    balance: 0,
    uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${detail.enquiryCustomId}`,
  };
  const data = buildCustomBillingData(detail, summary);
  return {
    enquiryCustomId: detail.enquiryCustomId,
    enquiryDetailCustomId: detail.enquiryDetailCustomId,
    data,
    message: "Customized bill fetched successfully",
  };
};

const listCustomNewPayments = ({ enquiryDetailCustomId, enquiryCustomId } = {}) => {
  const detail = resolveCustomDetailFromIds({ enquiryDetailCustomId, enquiryCustomId });
  if (!detail) {
    return { data: [], message: "Customized enquiry not found" };
  }
  const summary = resolveCustomPaymentSummary(detail.enquiryCustomId) || {
    enquiryCustomId: detail.enquiryCustomId,
    grandTotal: 0,
    advancePayment: 0,
    balance: 0,
    uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${detail.enquiryCustomId}`,
  };
  const billing = buildCustomBillingData(detail, summary);
  const pending = billing.advancePayments.filter((payment) => Number(payment.status) === 0);
  return {
    enquiryCustomId: detail.enquiryCustomId,
    enquiryDetailCustomId: detail.enquiryDetailCustomId,
    data: pending,
    total: pending.length,
    message: pending.length ? "Pending customized payments fetched successfully" : "No pending payments found",
  };
};

const resolveCustomPaymentEntry = (customPayDetailId) => {
  const paymentId = toPositiveInt(customPayDetailId, null);
  if (!paymentId) {
    return null;
  }
  const contexts = collectCustomEnquiryIds()
    .map((id) => {
      const detail = buildCustomEnquiryDetail(id);
      if (!detail) {
        return null;
      }
      const summary = resolveCustomPaymentSummary(id) || {
        enquiryCustomId: id,
        grandTotal: 0,
        advancePayment: 0,
        balance: 0,
        uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${id}`,
      };
      const billing = buildCustomBillingData(detail, summary);
      return { detail, summary, billing };
    })
    .filter(Boolean);
  for (const context of contexts) {
    const payment = context.billing.advancePayments.find(
      (entry) => Number(entry.customPayDetailId) === paymentId
    );
    if (payment) {
      return { ...context, payment };
    }
  }
  return null;
};

const getCustomReceiptDetails = ({ customPayDetailId } = {}) => {
  const context = resolveCustomPaymentEntry(customPayDetailId);
  if (!context) {
    return { message: "Receipt not found" };
  }
  const { detail, payment } = context;
  return {
    customPayDetailId: payment.customPayDetailId,
    enquiryCustomId: detail.enquiryCustomId,
    enquiryDetailCustomId: detail.enquiryDetailCustomId,
    receiptNo: payment.receiptNo,
    paymentDate: payment.paymentDate,
    paymentMode: payment.paymentModeName,
    transactionMode: payment.onlineTypeName || "",
    transactionId: payment.transactionId || "",
    bankName: payment.bankName || "",
    chequeNo: payment.chequeNo || "",
    billingName: context.billing.billingName,
    address: context.billing.address,
    phoneNo: context.billing.phoneNumber,
    gstIn: context.billing.gstIn,
    gstin: context.billing.gstIn,
    panNo: context.billing.panNumber,
    destination: detail.destinationName || detail.countryName || "Customized Tour",
    groupName: detail.groupName || detail.tourName || `Custom Tour ${detail.enquiryCustomId}`,
    days: detail.days,
    nights: detail.nights,
    adults: detail.adults,
    child: detail.child,
    advancePayment: payment.advancePayment,
    message: "Customized receipt fetched successfully",
  };
};

const updateCustomPaymentStatus = async ({ enquiryDetailCustomId, customPayDetailId } = {}) => {
  const detailId = toPositiveInt(enquiryDetailCustomId, null);
  const paymentId = toPositiveInt(customPayDetailId, null);
  if (!detailId || !paymentId) {
    const error = new Error("enquiryDetailCustomId and customPayDetailId are required");
    error.status = 400;
    throw error;
  }
  const context = resolveCustomPaymentEntry(paymentId);
  if (!context || Number(context.detail.enquiryDetailCustomId) !== detailId) {
    const error = new Error("Payment detail not found");
    error.status = 404;
    throw error;
  }
  const overrides = getCustomPaymentOverrides(detailId);
  overrides[paymentId] = {
    ...overrides[paymentId],
    status: 1,
    paymentDate: formatDateOnly(new Date()),
    paymentModeId: overrides[paymentId]?.paymentModeId || context.payment.paymentModeId || 1,
    transactionId: overrides[paymentId]?.transactionId || context.payment.transactionId || `TXN${paymentId}`,
    transactionProof:
      overrides[paymentId]?.transactionProof ||
      context.payment.transactionProof ||
      `${DOCUMENT_BASE_URL}/payments/custom-${paymentId}.pdf`,
  };
  await persistTourFixture("customPaymentOverrides");
  return {
    enquiryDetailCustomId: detailId,
    customPayDetailId: paymentId,
    message: "Customized payment status updated successfully",
  };
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
  const enquiryIds = collectCustomEnquiryIds();
  let records = enquiryIds.map((id) => buildCustomEnquiryDetail(id)).filter(Boolean);
  if (records.length) {
    const toursWithoutId = customTours.filter((tour) => !toPositiveInt(tour.enquiryCustomId, null));
    if (toursWithoutId.length) {
      records = [...records, ...toursWithoutId];
    }
  } else {
    records = customTours.slice();
  }
  const filtered = filterCustomTours(records, filters).filter((tour) => {
    if (normalizedCategory && normalizeCategory(tour.category || "CUSTOMIZED") !== normalizedCategory) {
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

const deriveEnquiryIdFromPayment = (paymentId) => {
  const id = toPositiveInt(paymentId, null);
  if (!id) {
    return null;
  }
  const value = String(id);
  if (value.length <= 1) {
    return id;
  }
  return toPositiveInt(value.slice(0, -1), id) || id;
};

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

const buildMonthlyCountArray = (records = [], fallbackBase = 4) => {
  const counts = Array(12).fill(0);
  if (Array.isArray(records) && records.length) {
    records.forEach((record, index) => {
      const date = toDate(record.travelDate) || toDate(record.startDate) || toDate(record.bookingDate);
      const monthIndex = date ? date.getMonth() : index % 12;
      counts[monthIndex] += 1;
    });
    if (counts.some((value) => value > 0)) {
      return counts;
    }
  }
  return counts.map((_, index) => fallbackBase + (index % 5));
};

const buildEnquiryGraphFromCounts = (counts = []) => {
  const totals = counts.map((value) => Math.max(0, value));
  const confirmed = totals.map((value, index) => Math.min(value, Math.round(value * 0.68) + (index % 2)));
  const lost = totals.map((value, index) => {
    const tentative = Math.round(value * 0.18) + (index % 3);
    return Math.min(value - confirmed[index], Math.max(0, tentative));
  });
  return {
    totals,
    confirmed,
    lost,
  };
};

const buildEnquirySummaryRows = (totals, confirmed, lost) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const previousMonth = (currentMonth + 11) % 12;
  const currentTotal = totals[currentMonth] || 0;
  const confirmedCurrent = confirmed[currentMonth] || 0;
  const lostCurrent = lost[currentMonth] || 0;
  const ongoing = Math.max(0, currentTotal - confirmedCurrent - lostCurrent);
  const conversionRate = currentTotal > 0 ? Math.min(100, Math.round((confirmedCurrent / currentTotal) * 100)) : 0;
  return [
    {
      previousMonthTotal: totals[previousMonth] || 0,
      currentMonthTotal: currentTotal,
      ongoing,
      confirmed: confirmedCurrent,
      lost: lostCurrent,
      conversionRate,
    },
  ];
};

const buildMonthlyTargetGraphSeries = (counts, baseTarget = 50, baseStep = 4) => {
  let runningTarget = baseTarget;
  let runningAchieve = Math.round(baseTarget * 0.7);
  const targetEntries = [];
  const achieveEntries = [];
  counts.forEach((count, index) => {
    runningTarget += Math.max(baseStep, count + index);
    targetEntries.push(Math.round(runningTarget));
    const achievedStep = Math.max(baseStep - 1, Math.round(count * 0.6));
    runningAchieve = Math.min(runningTarget, runningAchieve + achievedStep);
    achieveEntries.push(Math.round(runningAchieve));
  });
  return {
    targetSeries: [0, ...targetEntries],
    achieveSeries: [0, ...achieveEntries],
  };
};

const buildTargetSummaryMetrics = (counts, baseTarget, suffix) => {
  const today = new Date();
  const monthIndex = today.getMonth();
  const quarterStart = Math.floor(monthIndex / 3) * 3;
  const monthCount = counts[monthIndex] || 0;
  const quarterCount = counts.slice(quarterStart, quarterStart + 3).reduce((sum, value) => sum + value, 0);
  const yearCount = counts.reduce((sum, value) => sum + value, 0);
  const monthlyTarget = Math.max(baseTarget, monthCount + Math.round(baseTarget * 0.5));
  const quarterlyTarget = Math.max(baseTarget * 3, quarterCount + baseTarget);
  const yearlyTarget = Math.max(baseTarget * 12, yearCount + baseTarget * 2);
  const result = {
    monthlyTarget: Math.round(monthlyTarget),
    quarterlyTarget: Math.round(quarterlyTarget),
    yearlyTarget: Math.round(yearlyTarget),
  };
  result[`achieveMonthlyTarget${suffix}`] = Math.round(
    Math.min(monthlyTarget, Math.max(monthCount, monthlyTarget * 0.75))
  );
  result[`achieveQuarterTarget${suffix}`] = Math.round(
    Math.min(quarterlyTarget, Math.max(quarterCount, quarterlyTarget * 0.7))
  );
  result[`achieveYearTarget${suffix}`] = Math.round(
    Math.min(yearlyTarget, Math.max(yearCount, yearlyTarget * 0.65))
  );
  result[`remainingMonthlyTarget${suffix}`] = Math.max(
    0,
    result.monthlyTarget - result[`achieveMonthlyTarget${suffix}`]
  );
  result[`remainingQuarterTarget${suffix}`] = Math.max(
    0,
    result.quarterlyTarget - result[`achieveQuarterTarget${suffix}`]
  );
  result[`remainingYearTarget${suffix}`] = Math.max(
    0,
    result.yearlyTarget - result[`achieveYearTarget${suffix}`]
  );
  return result;
};

const buildBookingMetricSnapshot = () => {
  const groupRecords = buildGroupBookingRecords();
  const customRecords = buildCustomBookingRecords();
  const totalRecords = groupRecords.length + customRecords.length;
  if (!totalRecords) {
    return { ...BILLING_DEFAULT_METRICS };
  }
  const loyaltyBooking = Math.max(3, Math.round(groupRecords.length * 0.4));
  const welcomeBooking = Math.max(2, Math.round(customRecords.length * 0.35));
  const referralRate = Math.min(95, Math.max(12, Math.round((loyaltyBooking / totalRecords) * 100)));
  const currentBookingCount = totalRecords;
  const nextRankCount = Math.max(0, Math.round(Math.max(4, currentBookingCount * 0.12)));
  const topTenRankCount = Math.max(0, Math.round(Math.max(6, currentBookingCount * 0.2)));
  const topFiveRankCount = Math.max(0, Math.round(Math.max(3, currentBookingCount * 0.15)));
  return {
    loyaltyBooking,
    welcomeBooking,
    referralRate,
    currentBookingCount,
    nextRankCount,
    topTenRankCount,
    topFiveRankCount,
  };
};

const isDomesticDestination = (name = "") => {
  const normalizedName = normalize(name);
  if (!normalizedName) {
    return true;
  }
  const domesticKeywords = [
    "india",
    "goa",
    "kerala",
    "kashmir",
    "ladakh",
    "sikkim",
    "jaipur",
    "rajasthan",
    "pune",
    "delhi",
    "agra",
    "mumbai",
    "hyderabad",
    "kolkata",
    "assam",
    "gujarat",
    "manali",
    "shimla",
  ];
  return domesticKeywords.some((keyword) => normalizedName.includes(keyword));
};

const buildSalesPartnerStats = () => {
  const todayStr = formatDateOnly(startOfToday());
  const statsMap = new Map();
  const registerPartner = (userName) => {
    const key = userName || "Waari Team";
    if (!statsMap.has(key)) {
      statsMap.set(key, {
        userName: key,
        domesticCountGt: 0,
        internationalCountGt: 0,
        total_count_gt: 0,
        domesticCountCt: 0,
        internationalCountCt: 0,
        total_count_ct: 0,
        total_count_overall: 0,
        todaysBooking: 0,
      });
    }
    return statsMap.get(key);
  };
  buildGroupBookingRecords().forEach((record) => {
    const partner = registerPartner(record.assignedUserName);
    const international = !isDomesticDestination(record.destinationName || record.tourName);
    if (international) {
      partner.internationalCountGt += 1;
    } else {
      partner.domesticCountGt += 1;
    }
    partner.total_count_gt += 1;
    partner.total_count_overall += 1;
    if (record.bookingDate === todayStr) {
      partner.todaysBooking += 1;
    }
  });
  buildCustomBookingRecords().forEach((record) => {
    const partner = registerPartner(record.assignedUserName);
    const international = !isDomesticDestination(record.destinationName || record.tourName);
    if (international) {
      partner.internationalCountCt += 1;
    } else {
      partner.domesticCountCt += 1;
    }
    partner.total_count_ct += 1;
    partner.total_count_overall += 1;
    if (record.bookingDate === todayStr) {
      partner.todaysBooking += 1;
    }
  });
  const stats = Array.from(statsMap.values()).filter((entry) => entry.total_count_overall > 0);
  if (!stats.length) {
    return cloneValue(BILLING_DEFAULT_TOP_SALES, []);
  }
  stats.sort((a, b) => b.total_count_overall - a.total_count_overall);
  stats[0].isFirst = true;
  return stats.slice(0, 5);
};

const buildBirthdayGuestRecords = () => {
  const baseDate = startOfToday();
  const directory = buildFamilyHeadDirectory();
  if (!directory.length) {
    return DEFAULT_BIRTHDAY_SEEDS.map((seed) => ({
      familyHeadName: seed.familyHeadName,
      contact: seed.contact,
      dob: formatDateOnly(addDaysToDate(baseDate, seed.dobOffsetDays || -11000)),
      marriageDate: formatDateOnly(addDaysToDate(baseDate, seed.marriageOffsetDays || -3200)),
    }));
  }
  return directory.slice(0, 60).map((head, index) => {
    const name = `${head.firstName} ${head.lastName}`.trim();
    const tour = resolveGroupTourRecord(head.enquiryGroupId);
    const contact = head.contact || resolveContact(tour || {});
    const dobDays = -((25 + (index % 15)) * 365 + index * 3);
    const marriageDays = -((5 + (index % 9)) * 365 + index);
    return {
      familyHeadName: name,
      contact,
      dob: formatDateOnly(addDaysToDate(baseDate, dobDays)),
      marriageDate: formatDateOnly(addDaysToDate(baseDate, marriageDays)),
    };
  });
};

const listBillingBirthdayGuests = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildBirthdayGuestRecords();
  const pagination = paginate(records, pageNumber, perPageNumber);
  return {
    message: pagination.total ? "Birthday list fetched successfully" : "No birthday data available",
    page: pagination.page,
    perPage: pagination.perPage,
    total: pagination.total,
    lastPage: pagination.lastPage,
    guestsWithDOB: pagination.data,
    data: pagination.data,
  };
};

const getLoyaltyBookingMetric = () => {
  const metrics = buildBookingMetricSnapshot();
  return {
    loyaltyBooking: metrics.loyaltyBooking,
    message: "Loyalty booking count fetched successfully",
  };
};

const getWelcomeBookingMetric = () => {
  const metrics = buildBookingMetricSnapshot();
  return {
    welcomeBooking: metrics.welcomeBooking,
    message: "Welcome booking count fetched successfully",
  };
};

const getReferralRateMetric = () => {
  const metrics = buildBookingMetricSnapshot();
  return {
    referralRate: metrics.referralRate,
    message: "Referral rate fetched successfully",
  };
};

const getMoreBookingCounts = () => {
  const metrics = buildBookingMetricSnapshot();
  return {
    nextRankCount: metrics.nextRankCount,
    topTenRankCount: metrics.topTenRankCount,
    topFiveRankCount: metrics.topFiveRankCount,
    currentBookingCount: metrics.currentBookingCount,
    message: "Booking progress counts fetched successfully",
  };
};

const listTopSalesPartners = () => {
  const topSales = buildSalesPartnerStats();
  return {
    topSales,
    generatedOn: formatDateOnly(startOfToday()),
    message: topSales.length ? "Top sales partners fetched successfully" : "No sales data available",
  };
};

const getMonthlyTargetGraphGt = () => {
  const counts = buildMonthlyCountArray(buildGroupBookingRecords(), 8);
  const graph = buildMonthlyTargetGraphSeries(counts, 60, 5);
  return {
    gtGraphArray: graph.targetSeries,
    gtAchieveArray: graph.achieveSeries,
  };
};

const getGroupTargetSummary = () => {
  const counts = buildMonthlyCountArray(buildGroupBookingRecords(), 8);
  return buildTargetSummaryMetrics(counts, 60, "Gt");
};

const getGroupEnquiryGraphStats = () => {
  const counts = buildMonthlyCountArray(buildGroupBookingRecords(), 8);
  const graph = buildEnquiryGraphFromCounts(counts);
  return {
    totalEnquiriesGt: graph.totals,
    confirmedEnquiriesGt: graph.confirmed,
    lostEnquiriesGt: graph.lost,
  };
};

const getGroupEnquiryTable = () => {
  const counts = buildMonthlyCountArray(buildGroupBookingRecords(), 8);
  const graph = buildEnquiryGraphFromCounts(counts);
  return {
    enquiriesGT: buildEnquirySummaryRows(graph.totals, graph.confirmed, graph.lost),
  };
};

const getMonthlyTargetGraphCt = () => {
  const counts = buildMonthlyCountArray(buildCustomBookingRecords(), 6);
  const graph = buildMonthlyTargetGraphSeries(counts, 45, 4);
  return {
    ctTargetArray: graph.targetSeries,
    ctAchieveArray: graph.achieveSeries,
  };
};

const getCustomTargetSummary = () => {
  const counts = buildMonthlyCountArray(buildCustomBookingRecords(), 6);
  return buildTargetSummaryMetrics(counts, 45, "Ct");
};

const getCustomEnquiryGraphStats = () => {
  const counts = buildMonthlyCountArray(buildCustomBookingRecords(), 6);
  const graph = buildEnquiryGraphFromCounts(counts);
  return {
    totalEnquiriesCt: graph.totals,
    confirmedEnquiriesCt: graph.confirmed,
    lostEnquiriesCt: graph.lost,
  };
};

const getCustomEnquiryTable = () => {
  const counts = buildMonthlyCountArray(buildCustomBookingRecords(), 6);
  const graph = buildEnquiryGraphFromCounts(counts);
  return {
    enquiriesCt: buildEnquirySummaryRows(graph.totals, graph.confirmed, graph.lost),
  };
};

const getGroupTourCountMetric = () => {
  const bookingCount = buildGroupBookingRecords().length;
  const fallbackCount = groupTours.length || BILLING_DEFAULT_METRICS.currentBookingCount;
  const groupTourCount = bookingCount || fallbackCount;
  return {
    groupTourCount,
    message: groupTourCount ? "Group tour count fetched successfully" : "No group tours available",
  };
};

const buildSalesProfitEntries = () => {
  const entries = buildCustomPaymentSummaries();
  if (entries.length) {
    return entries;
  }
  const baseDate = startOfToday();
  return buildCustomBookingRecords().slice(0, 8).map((record, index) => {
    const amount = Math.max(45000, (index + 4) * 12500);
    const payment = buildPaymentBreakdown(amount);
    const startDate = record.startDate || formatDateOnly(addDaysToDate(baseDate, index * 4));
    const endDate = record.endDate || formatDateOnly(addDaysToDate(toDate(startDate) || baseDate, 5));
    return {
      enquiryCustomId: record.enquiryId || Number(`${index + 1}01`),
      groupName: record.tourName,
      contactName: record.guestName,
      destination: record.destinationName,
      pax: record.pax,
      startDate,
      endDate,
      status: index % 2 === 0 ? "PENDING" : "CONFIRMED",
      ...payment,
    };
  });
};

const buildSalesProfitRows = () =>
  buildSalesProfitEntries().map((entry, index) => {
    const detail = buildCustomEnquiryDetail(entry.enquiryCustomId) || {};
    const purchasePrice = roundCurrency(
      toNumber(entry.discounted, 0) ||
        toNumber(entry.tourPrice, 0) ||
        toNumber(entry.grandTotal, 0) * 0.85
    );
    const sale = roundCurrency(Math.max(purchasePrice, toNumber(entry.grandTotal, purchasePrice)));
    const profit = roundCurrency(Math.max(0, sale - purchasePrice));
    const profitPer = purchasePrice ? Math.min(100, Math.round((profit / purchasePrice) * 100)) : 0;
    const adults = toPositiveInt(detail.adults, 0) || 0;
    const child = toPositiveInt(detail.child, 0) || 0;
    const pax =
      toPositiveInt(entry.pax, null) ||
      adults + child ||
      Math.max(2, toPositiveInt(detail.paxNo, null) || 2);
    return {
      saleId: entry.enquiryCustomId || Number(`${index + 1}01`),
      enquiryCustomId: entry.enquiryCustomId || Number(`${index + 1}01`),
      groupName: entry.groupName || detail.groupName || detail.tourName || `Custom Journey ${index + 1}`,
      guestName: entry.contactName || detail.contactName || detail.guestName || `Guest ${index + 1}`,
      destination: entry.destination || detail.destinationName || "Custom Destination",
      pax,
      startDate: entry.startDate || detail.startDate || formatDateOnly(startOfToday()),
      endDate: entry.endDate || detail.endDate || formatDateOnly(startOfToday()),
      purchasePrice,
      sale,
      profit,
      profitPer,
    };
  });

const listSalesProfitSummary = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const rows = buildSalesProfitRows();
  const pagination = paginate(rows, pageNumber, perPageNumber);
  return {
    page: pagination.page,
    perPage: pagination.perPage,
    total: pagination.total,
    lastPage: pagination.lastPage,
    data: pagination.data,
    message: pagination.total ? "Sales profit list fetched successfully" : "No sales profit data available",
  };
};

const getBookingSalesAmountGraphCt = () => {
  const counts = buildMonthlyCountArray(buildCustomBookingRecords(), 5);
  let target = 18;
  let achieve = 12;
  const targetArray = [0];
  const ctAchieveArray = [0];
  counts.forEach((count, index) => {
    const normalized = Math.max(4, Math.min(28, count + index));
    target = Math.min(35, Math.max(target + Math.max(2, normalized - 1), 10));
    achieve = Math.min(target - 1, Math.max(8, achieve + Math.max(1, normalized - 3)));
    targetArray.push(Math.round(target));
    ctAchieveArray.push(Math.round(achieve));
  });
  return {
    targetArray,
    ctAchieveArray,
    message: "Booking sales amount graph fetched successfully",
  };
};

const computeProfitPercent = (entries) => {
  if (!entries.length) {
    return 0;
  }
  const totals = entries.reduce(
    (acc, entry) => {
      const sale = toNumber(entry.grandTotal, 0);
      const purchase = toNumber(entry.tourPrice, 0) || toNumber(entry.discounted, 0);
      return {
        sale: acc.sale + sale,
        purchase: acc.purchase + purchase,
      };
    },
    { sale: 0, purchase: 0 }
  );
  if (!totals.purchase) {
    return 0;
  }
  const profit = Math.max(0, totals.sale - totals.purchase);
  return Math.min(100, Math.round((profit / totals.purchase) * 100));
};

const getCustomProfitMetrics = () => {
  const entries = buildSalesProfitEntries();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthEntries = entries.filter((entry) => {
    const date = toDate(entry.startDate);
    return date && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const quarterStart = Math.floor(currentMonth / 3) * 3;
  const quarterEntries = entries.filter((entry) => {
    const date = toDate(entry.startDate);
    if (!date || date.getFullYear() !== currentYear) {
      return false;
    }
    const month = date.getMonth();
    return month >= quarterStart && month < quarterStart + 3;
  });
  const yearEntries = entries.filter((entry) => {
    const date = toDate(entry.startDate);
    return date && date.getFullYear() === currentYear;
  });
  const packageWise =
    entries.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            entries.reduce((sum, entry) => {
              const sale = toNumber(entry.grandTotal, 0);
              const purchase = toNumber(entry.tourPrice, 0) || toNumber(entry.discounted, 0);
              if (!purchase) {
                return sum;
              }
              const profit = Math.max(0, sale - purchase);
              return sum + Math.min(100, (profit / purchase) * 100);
            }, 0) / entries.length
          )
        );
  return {
    profitPer: packageWise,
    profitPerMonth: computeProfitPercent(monthEntries.length ? monthEntries : entries),
    profitPerQuarter: computeProfitPercent(quarterEntries.length ? quarterEntries : entries),
    profitPerYear: computeProfitPercent(yearEntries.length ? yearEntries : entries),
    message: entries.length ? "Profit metrics fetched successfully" : "No profit data available",
  };
};

const resolveBillingCounters = () => {
  const groupRecords = buildGroupConfirmRecords();
  const customEntries = buildSalesProfitEntries();
  const totalBilling = groupRecords.length + customEntries.length;
  const groupApproved = groupRecords.filter((record) => toNumber(record.balance, 0) <= 0).length;
  const customApproved = customEntries.filter(
    (entry) => toNumber(entry.balance, 0) <= 0 || normalize(entry.status) === "confirmed"
  ).length;
  const totalBillApproved = groupApproved + customApproved;
  const totalBillPending = Math.max(0, totalBilling - totalBillApproved);
  return { totalBilling, totalBillApproved, totalBillPending };
};

const getTotalBillingSummary = () => {
  const counters = resolveBillingCounters();
  return {
    totalBilling: counters.totalBilling,
    message: counters.totalBilling ? "Total billing fetched successfully" : "No billing data available",
  };
};

const getTotalBillApprovedSummary = () => {
  const counters = resolveBillingCounters();
  return {
    totalBillApproved: counters.totalBillApproved,
    message: counters.totalBillApproved ? "Approved billing fetched successfully" : "No approved bills available",
  };
};

const getTotalBillPendingSummary = () => {
  const counters = resolveBillingCounters();
  return {
    totalBillPending: counters.totalBillPending,
    message: counters.totalBillPending ? "Pending billing fetched successfully" : "No pending bills available",
  };
};

const buildWebsiteContactEntries = () =>
  WEBSITE_CONTACT_ENTRIES.map((entry, index) => ({
    contactUsId: entry.contactUsId || index + 101,
    fullName: entry.fullName,
    email: entry.email,
    phoneNo: entry.phoneNo,
    Date: entry.Date,
    city: entry.city || "",
    message: entry.message || "",
    source: entry.source || "Website",
    status: entry.status || "NEW",
  }));

const listWebsiteContactEntries = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const entries = buildWebsiteContactEntries();
  return buildListResponse(
    entries,
    pageNumber,
    perPageNumber,
    {},
    entries.length ? "Contact enquiries fetched successfully" : "No contact enquiries available"
  );
};

const buildHomePageJourneyRecords = () => {
  const tourMap = new Map();
  groupTours.forEach((tour) => {
    if (tour && tour.groupTourId) {
      tourMap.set(Number(tour.groupTourId), tour);
    }
  });
  return HOME_PAGE_JOURNEY_LAYOUT.map((entry, index) => {
    const tour = tourMap.get(Number(entry.groupTourId));
    const title = tour?.tourName || entry.tourName || `Featured Journey ${index + 1}`;
    const path = slugify(title, `journey-${index + 1}`);
    return {
      selectionId: entry.selectionId || index + 1,
      groupTourId: tour?.groupTourId || entry.groupTourId || index + 1,
      tourName: title,
      heroImageUrl: entry.heroImageUrl || tour?.bannerImage || tour?.heroImageUrl || DEFAULT_WEBSITE_BANNER,
      badge: entry.badge || tour?.badge || "Popular",
      highlight: entry.highlight || tour?.summary || "",
      priceFrom: entry.priceFrom || tour?.startingPrice || tour?.priceFrom || 0,
      duration: entry.duration || tour?.duration || "",
      sequence: entry.sequence || index + 1,
      detailPath: `/journeys/${path}`,
    };
  }).sort((a, b) => a.sequence - b.sequence);
};

const listHomePageJourneys = () => {
  const data = buildHomePageJourneyRecords();
  return {
    data,
    total: data.length,
    selectedIds: data.map((entry) => entry.groupTourId),
    message: data.length ? "Home page journeys fetched successfully" : "No journeys configured",
  };
};

const updateHomePageJourneys = (payload = {}) => {
  const uniqueIds = Array.from(new Set(parseIdList(payload.groupTourIds || payload.groupTourId))).filter(Boolean);
  if (!uniqueIds.length) {
    return { data: null, message: "groupTourIds are required" };
  }
  const slotCount = Math.max(HOME_PAGE_JOURNEY_LAYOUT.length, uniqueIds.length);
  for (let index = 0; index < slotCount; index += 1) {
    const selectionId = index + 1;
    const groupTourId = uniqueIds[index] || null;
    const base = HOME_PAGE_JOURNEY_LAYOUT[index] || {};
    const tour = groupTourId ? groupTours.find((item) => Number(item.groupTourId) === groupTourId) : null;
    const title = tour?.tourName || base.tourName || `Featured Journey ${selectionId}`;
    const detailPath = `/journeys/${slugify(title, `journey-${selectionId}`)}`;
    HOME_PAGE_JOURNEY_LAYOUT[index] = {
      selectionId: base.selectionId || selectionId,
      groupTourId,
      tourName: title,
      heroImageUrl: tour?.bannerImage || tour?.heroImageUrl || base.heroImageUrl || DEFAULT_WEBSITE_BANNER,
      badge: tour?.badge || base.badge || "Popular",
      highlight: tour?.summary || base.highlight || "",
      priceFrom: tour?.startingPrice || tour?.priceFrom || base.priceFrom || 0,
      duration: tour?.duration || base.duration || "",
      sequence: selectionId,
      detailPath,
    };
  }
  const response = listHomePageJourneys();
  return { ...response, message: "Home page journeys updated successfully" };
};

const buildTopFiveGroupJourneyRecords = () => {
  const tourMap = new Map();
  groupTours.forEach((tour) => {
    if (tour && tour.groupTourId) {
      tourMap.set(Number(tour.groupTourId), tour);
    }
  });
  return TOP_FIVE_GROUP_JOURNEY_LAYOUT.map((entry, index) => {
    const tour = entry.groupTourId ? tourMap.get(Number(entry.groupTourId)) : null;
    const title = entry.title || tour?.tourName || `Journey ${index + 1}`;
    return {
      topFiveGroupJourneyId: entry.topFiveGroupJourneyId || index + 1,
      groupTourId: entry.groupTourId || tour?.groupTourId || null,
      title,
      subTitle: entry.subTitle || tour?.summary || "",
      topFiveGroupJourneyImageUrl:
        entry.topFiveGroupJourneyImageUrl || tour?.bannerImage || tour?.heroImageUrl || DEFAULT_WEBSITE_BANNER,
      topFiveGroupJourneyPathUrl:
        entry.topFiveGroupJourneyPathUrl || `https://waari.travel/journeys/${slugify(title)}`,
      sequence: entry.sequence || index + 1,
    };
  }).sort((a, b) => a.sequence - b.sequence);
};

const findTopFiveGroupJourneyIndex = (journeyId) =>
  TOP_FIVE_GROUP_JOURNEY_LAYOUT.findIndex(
    (entry) => toPositiveInt(entry.topFiveGroupJourneyId, null) === journeyId
  );

const normalizeTopFiveGroupJourneyRecord = (entry, fallbackId) => {
  const id = toPositiveInt(entry.topFiveGroupJourneyId, fallbackId) || fallbackId || 1;
  const title = selectSanitizedValue(entry.title, entry.tourName || `Journey ${id}`);
  const image =
    entry.topFiveGroupJourneyImageUrl || entry.topFiveGroupJourneyImage || entry.imageUrl || DEFAULT_WEBSITE_BANNER;
  const pathUrl =
    entry.topFiveGroupJourneyPathUrl || entry.topFiveGroupJourneyPath || entry.detailPath;
  return {
    topFiveGroupJourneyId: id,
    groupTourId: toPositiveInt(entry.groupTourId, null) || null,
    title,
    subTitle: selectSanitizedValue(entry.subTitle, ""),
    topFiveGroupJourneyImageUrl: selectSanitizedValue(image, DEFAULT_WEBSITE_BANNER),
    topFiveGroupJourneyPathUrl:
      selectSanitizedValue(pathUrl, `https://waari.travel/journeys/${slugify(title, `journey-${id}`)}`),
    sequence: toPositiveInt(entry.sequence, fallbackId) || fallbackId || 1,
  };
};

const updateTopFiveGroupJourney = (payload = {}) => {
  const id = toPositiveInt(payload.topFiveGroupJourneyId, null);
  if (!id) {
    return { data: null, message: "topFiveGroupJourneyId is required" };
  }
  const index = findTopFiveGroupJourneyIndex(id);
  if (index === -1) {
    return { data: null, message: "Top five journey not found" };
  }
  const normalized = normalizeTopFiveGroupJourneyRecord(
    { ...TOP_FIVE_GROUP_JOURNEY_LAYOUT[index], ...payload, topFiveGroupJourneyId: id },
    id
  );
  TOP_FIVE_GROUP_JOURNEY_LAYOUT[index] = normalized;
  return { data: cloneValue(normalized, {}), message: "Top five journey updated successfully" };
};

const listTopFiveGroupJourneys = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildTopFiveGroupJourneyRecords();
  return buildListResponse(
    records,
    pageNumber,
    perPageNumber,
    {},
    records.length ? "Top five journeys fetched successfully" : "No top five journeys configured"
  );
};

const getTopFiveGroupJourney = (topFiveGroupJourneyId) => {
  const id = toPositiveInt(topFiveGroupJourneyId, null);
  if (!id) {
    return { data: null, message: "topFiveGroupJourneyId is required" };
  }
  const records = buildTopFiveGroupJourneyRecords();
  const record = records.find((entry) => Number(entry.topFiveGroupJourneyId) === id);
  if (!record) {
    return { data: null, message: "Top five journey not found" };
  }
  return { data: cloneValue(record, {}), message: "Top five journey fetched successfully" };
};

const normalizeWebsiteReviewRecord = (entry, fallbackId) => {
  const id = toPositiveInt(entry.reviewId, fallbackId) || fallbackId || 1;
  const title = selectSanitizedValue(entry.title, `Review ${id}`);
  const createdAt = selectSanitizedValue(entry.createdAt, entry.tourDate || formatDateOnly(startOfToday()));
  const ratingValue = toNumber(entry.rating, 5);
  const rating = Math.min(5, Math.max(1, ratingValue));
  const typeValue = Number(entry.type);
  return {
    reviewId: id,
    customerName: selectSanitizedValue(entry.customerName, `Customer ${id}`),
    tourCode: selectSanitizedValue(entry.tourCode, `GT-${id}`),
    type: Number.isNaN(typeValue) ? 1 : typeValue,
    tourName: selectSanitizedValue(entry.tourName, entry.tourCode || title),
    tourDate: selectSanitizedValue(entry.tourDate, createdAt),
    title,
    content: selectSanitizedValue(entry.content, entry.message || ""),
    rating,
    imageUrl: selectSanitizedValue(entry.imageUrl, DEFAULT_WEBSITE_BANNER),
    status: selectSanitizedValue(entry.status, "PUBLISHED"),
    createdAt,
  };
};

const nextWebsiteReviewId = () => {
  if (websiteReviewSequence < 400) {
    websiteReviewSequence = 400;
  }
  websiteReviewSequence += 1;
  return websiteReviewSequence;
};

const nextTourTypeId = () => {
  if (tourTypeSequence < 1) {
    tourTypeSequence = 1;
  }
  tourTypeSequence += 1;
  return tourTypeSequence;
};

const buildWebsiteReviewRecords = () =>
  WEBSITE_REVIEW_ENTRIES.map((entry, index) =>
    normalizeWebsiteReviewRecord(entry, entry.reviewId || index + 401)
  ).sort((a, b) => new Date(b.createdAt || b.tourDate || 0) - new Date(a.createdAt || a.tourDate || 0));

const listWebsiteReviews = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const reviews = buildWebsiteReviewRecords();
  return buildListResponse(
    reviews,
    pageNumber,
    perPageNumber,
    {},
    reviews.length ? "Reviews fetched successfully" : "No reviews available"
  );
};

const addWebsiteReview = (payload = {}) => {
  const reviewId = toPositiveInt(payload.reviewId, null) || nextWebsiteReviewId();
  const createdAt = selectSanitizedValue(payload.createdAt, formatDateOnly(startOfToday()));
  const record = normalizeWebsiteReviewRecord({ ...payload, reviewId, createdAt }, reviewId);
  WEBSITE_REVIEW_ENTRIES.push(record);
  return { data: cloneValue(record, {}), message: "Review added successfully" };
};

const findWebsiteReviewIndex = (reviewId) =>
  WEBSITE_REVIEW_ENTRIES.findIndex((entry) => toPositiveInt(entry.reviewId, null) === reviewId);

const getWebsiteReview = (reviewId) => {
  const id = toPositiveInt(reviewId, null);
  if (!id) {
    return { data: null, message: "reviewId is required" };
  }
  const index = findWebsiteReviewIndex(id);
  if (index === -1) {
    return { data: null, message: "Review not found" };
  }
  const record = normalizeWebsiteReviewRecord(WEBSITE_REVIEW_ENTRIES[index], id);
  return { data: cloneValue(record, {}), message: "Review fetched successfully" };
};

const updateWebsiteReview = (payload = {}) => {
  const id = toPositiveInt(payload.reviewId, null);
  if (!id) {
    return { data: null, message: "reviewId is required" };
  }
  const index = findWebsiteReviewIndex(id);
  if (index === -1) {
    return { data: null, message: "Review not found" };
  }
  const updated = normalizeWebsiteReviewRecord(
    { ...WEBSITE_REVIEW_ENTRIES[index], ...payload, reviewId: id },
    id
  );
  WEBSITE_REVIEW_ENTRIES[index] = updated;
  return { data: cloneValue(updated, {}), message: "Review updated successfully" };
};

const normalizeTourTypeRecord = (entry, fallbackId) => {
  const id = toPositiveInt(entry.tourTypeId, fallbackId) || fallbackId || 1;
  const tourTypeName = selectSanitizedValue(entry.tourTypeName, `Tour Type ${id}`);
  const image = selectSanitizedValue(
    entry.tourTypeImage || entry.imageUrl || entry.image || entry.tourTypeImageUrl,
    DEFAULT_WEBSITE_BANNER
  );
  const category = normalizeCategory(entry.category || entry.categoryName || entry.type || "GROUP");
  const isActive = entry.isActive !== undefined ? Boolean(entry.isActive) : true;
  return {
    tourTypeId: id,
    tourTypeName,
    tourTypeImage: image,
    tourTypeImageUrl: image,
    category,
    type: category,
    isActive,
  };
};

const addTourType = (payload = {}) => {
  const tourTypeId = toPositiveInt(payload.tourTypeId, null) || nextTourTypeId();
  const record = normalizeTourTypeRecord({ ...payload, tourTypeId }, tourTypeId);
  tourTypes.push(record);
  return { data: cloneValue(record, {}), message: "Tour type added successfully" };
};

const getTourType = (tourTypeId) => {
  const id = toPositiveInt(tourTypeId, null);
  if (!id) {
    return { data: null, message: "tourTypeId is required" };
  }
  const record = tourTypes.find((entry) => Number(entry.tourTypeId) === id);
  if (!record) {
    return { data: null, message: "Tour type not found" };
  }
  return { data: cloneValue(record, {}), message: "Tour type fetched successfully" };
};

const nextOfficeDetailId = () => {
  officeDetailSequence += 1;
  return officeDetailSequence;
};

const normalizeOfficeDetailRecord = (entry, fallbackId) => {
  const id = toPositiveInt(entry.officedetailId, fallbackId) || fallbackId;
  return {
    officedetailId: id,
    cityName: selectSanitizedValue(entry.cityName, `City ${id}`),
    address: selectSanitizedValue(entry.address, ""),
    officeTiming: selectSanitizedValue(entry.officeTiming, ""),
    contactNo: selectSanitizedValue(entry.contactNo, ""),
    email: selectSanitizedValue(entry.email, ""),
  };
};

const buildOfficeDetailRecords = () =>
  OFFICE_DETAIL_ENTRIES.map((entry, index) => normalizeOfficeDetailRecord(entry, index + 1));

const listOfficeDetails = ({ page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = buildOfficeDetailRecords();
  return buildListResponse(
    records,
    pageNumber,
    perPageNumber,
    {},
    records.length ? "Sales offices fetched successfully" : "No sales offices available"
  );
};

const getOfficeDetail = (officedetailId) => {
  const id = toPositiveInt(officedetailId, null);
  if (!id) {
    return { data: null, message: "officedetailId is required" };
  }
  const records = buildOfficeDetailRecords();
  const record = records.find((entry) => Number(entry.officedetailId) === id);
  if (!record) {
    return { data: null, message: "Sales office not found" };
  }
  return { data: record, message: "Sales office fetched successfully" };
};

const addOfficeDetail = (payload = {}) => {
  const id = nextOfficeDetailId();
  const record = normalizeOfficeDetailRecord({ ...payload, officedetailId: id }, id);
  OFFICE_DETAIL_ENTRIES.push(record);
  return { data: cloneValue(record, {}), message: "Sales office added successfully" };
};

const updateOfficeDetail = (payload = {}) => {
  const id = toPositiveInt(payload.officedetailId, null);
  if (!id) {
    return { data: null, message: "officedetailId is required" };
  }
  const index = OFFICE_DETAIL_ENTRIES.findIndex((entry) => toPositiveInt(entry.officedetailId, null) === id);
  if (index === -1) {
    return { data: null, message: "Sales office not found" };
  }
  const updated = normalizeOfficeDetailRecord({ ...OFFICE_DETAIL_ENTRIES[index], ...payload, officedetailId: id }, id);
  OFFICE_DETAIL_ENTRIES[index] = updated;
  return { data: cloneValue(updated, {}), message: "Sales office updated successfully" };
};

const deleteOfficeDetail = (officedetailId) => {
  const id = toPositiveInt(officedetailId, null);
  if (!id) {
    return { data: null, message: "officedetailId is required" };
  }
  const index = OFFICE_DETAIL_ENTRIES.findIndex((entry) => toPositiveInt(entry.officedetailId, null) === id);
  if (index === -1) {
    return { data: null, message: "Sales office not found" };
  }
  const [removed] = OFFICE_DETAIL_ENTRIES.splice(index, 1);
  return { data: normalizeOfficeDetailRecord(removed, id), message: "Sales office deleted successfully" };
};

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

const LOYALTY_CARD_OPTIONS = [
  { cardId: 1, cardName: "Silver", minPoints: 0 },
  { cardId: 2, cardName: "Gold", minPoints: 250 },
  { cardId: 3, cardName: "Platinum", minPoints: 450 },
  { cardId: 4, cardName: "Diamond", minPoints: 650 },
];

const MANUAL_GUEST_ID_OFFSET = 700000;

const getManualGuestEntries = () => cloneValue(manualGuestDirectory, []);

const resolveNamePrefixById = (preFixId) => {
  const id = toPositiveInt(preFixId, null);
  if (!id) {
    return { preFixId: null, preFixName: "" };
  }
  const dataset = namePrefixes.length ? namePrefixes : DEFAULT_NAME_PREFIXES;
  const match = dataset.find((entry) => Number(entry.preFixId) === id);
  if (match) {
    return { preFixId: match.preFixId, preFixName: match.preFixName };
  }
  const fallback = dataset[(id - 1) % dataset.length];
  return { preFixId: id, preFixName: fallback?.preFixName || (id % 2 === 0 ? "Ms." : "Mr.") };
};

const resolveManualGuestCard = (cardId, cardName) => {
  const id = toPositiveInt(cardId, null);
  if (id) {
    const match = LOYALTY_CARD_OPTIONS.find((option) => Number(option.cardId) === id);
    if (match) {
      return match;
    }
  }
  if (cardName) {
    const match = LOYALTY_CARD_OPTIONS.find((option) => normalize(option.cardName) === normalize(cardName));
    if (match) {
      return match;
    }
  }
  return null;
};

const nextManualGuestId = () =>
  manualGuestDirectory.reduce(
    (max, record) => Math.max(max, Number(record && record.guestId) || 0),
    MANUAL_GUEST_ID_OFFSET
  ) + 1;

const DEFAULT_GUEST_DIRECTORY_SEEDS = [
  {
    guestId: 7010,
    firstName: "Anita",
    lastName: "Iyer",
    guestName: "Anita Iyer",
    contact: "9823001100",
    assignedUserId: DEFAULT_FOLLOW_UP_USER_ID,
  },
  {
    guestId: 7011,
    firstName: "Rahul",
    lastName: "Kulkarni",
    guestName: "Rahul Kulkarni",
    contact: "9890700700",
    assignedUserId: 9002,
  },
  {
    guestId: 7012,
    firstName: "Sneha",
    lastName: "Patel",
    guestName: "Sneha Patel",
    contact: "9860006600",
    assignedUserId: 9003,
  },
  {
    guestId: 7013,
    firstName: "Vikram",
    lastName: "Desai",
    guestName: "Vikram Desai",
    contact: "9811122234",
    assignedUserId: 9004,
  },
];

const selectLoyaltyCardByPoints = (points) => {
  let matched = LOYALTY_CARD_OPTIONS[0];
  LOYALTY_CARD_OPTIONS.forEach((card) => {
    if (points >= card.minPoints) {
      matched = card;
    }
  });
  return matched;
};

const buildGuestLoyaltyDirectory = () => {
  const combined = [...getManualGuestEntries(), ...buildGroupGuestDirectory(), ...buildCustomGuestDirectory()];
  const source = combined.length ? combined : DEFAULT_GUEST_DIRECTORY_SEEDS;
  const list = cloneValue(source, []);
  const today = startOfToday();
  return list.map((record, index) => {
    const guestId = toPositiveInt(record.guestId, index + 1) || index + 1;
    const fullNameSource = record.guestName || `${record.firstName || "Guest"} ${record.lastName || guestId}`;
    const [firstNameFallback, lastNameFallback] = splitNameParts(fullNameSource);
    const firstName = record.firstName || firstNameFallback;
    const lastName = record.lastName || lastNameFallback;
    const guestName = record.guestName || `${firstName} ${lastName}`.trim();
    const contact =
      record.contact ||
      record.phone ||
      record.mobile ||
      `98${String(guestId).padStart(8, "0")}`;
    const enquiryCount = Math.max(1, record.enquiryCount || record.paxPerHead || ((index % 7) + 1));
    const computedPoints = Math.max(
      50,
      Math.min(
        1200,
        enquiryCount * 40 +
          (index % 5) * 15 +
          (toPositiveInt(record.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) % 7) * 10
      )
    );
    const loyaltyPoints = toPositiveInt(record.loyaltyPoints, null) || computedPoints;
    const card = resolveManualGuestCard(record.cardId, record.cardName) || selectLoyaltyCardByPoints(loyaltyPoints);
    const userId = toPositiveInt(record.userId, guestId) || guestId;
    const statusOverride = (loyaltyStatusOverrides && loyaltyStatusOverrides[userId]) || {};
    const basePrintedStatus =
      record.printedStatus !== undefined ? Boolean(record.printedStatus) : index % 3 === 0;
    const baseDeliveryStatus =
      record.deliveryStatus !== undefined ? Boolean(record.deliveryStatus) : index % 4 === 0;
    const printedStatus =
      statusOverride.printedStatus !== undefined ? Boolean(statusOverride.printedStatus) : basePrintedStatus;
    const deliveryStatus =
      statusOverride.deliveryStatus !== undefined ? Boolean(statusOverride.deliveryStatus) : baseDeliveryStatus;
    return {
      ...record,
      guestId,
      userId,
      firstName,
      lastName: lastName ? lastName.trim() : "",
      guestName,
      userName: guestName,
      contact,
      enquiryCount,
      loyaltyPoints,
      cardId: card.cardId,
      cardName: card.cardName,
      loyaltyCard: card.cardName,
      referralId: record.referralId || `WR-${String(guestId).padStart(5, "0")}`,
      printedStatus,
      printedStatusName: printedStatus ? "Printed" : "Pending",
      deliveryStatus,
      deliveryStatusName: deliveryStatus ? "Delivered" : "Awaiting Dispatch",
      date: record.date || formatDateOnly(addDaysToDate(today, -(index % 45) - 2)),
      assignedUserId: toPositiveInt(record.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
    };
  });
};

const getGuestCountMetric = () => {
  const guestCount = buildGuestLoyaltyDirectory().length;
  return {
    guestCount,
    message: guestCount ? "Guest count fetched successfully" : "No guest data available",
  };
};

const parseGuestIdentifier = (value) => {
  const text = (value || "").toString().trim();
  if (!text) {
    return { guestId: null, referralId: null };
  }
  const direct = toPositiveInt(text, null);
  if (direct) {
    return { guestId: direct, referralId: text.toUpperCase() || null };
  }
  const digitsOnly = text.replace(/[^0-9]/g, "");
  const guestId = toPositiveInt(digitsOnly, null);
  return { guestId, referralId: text.toUpperCase() || null };
};

const resolveGuestDirectoryRecord = (guestIdentifier) => {
  const directory = buildGuestLoyaltyDirectory();
  if (!directory.length) {
    return {
      ...DEFAULT_GUEST_DIRECTORY_SEEDS[0],
      guestId: DEFAULT_GUEST_DIRECTORY_SEEDS[0]?.guestId || 1,
      referralId: DEFAULT_GUEST_DIRECTORY_SEEDS[0]?.referralId || "WR-10001",
    };
  }
  const { guestId, referralId } = parseGuestIdentifier(guestIdentifier);
  const exact =
    directory.find((entry) => guestId && Number(entry.guestId) === Number(guestId)) ||
    directory.find(
      (entry) =>
        referralId &&
        entry.referralId &&
        normalize(entry.referralId) === normalize(referralId)
    );
  if (exact) {
    return exact;
  }
  const index = guestId ? guestId % directory.length : 0;
  return directory[index] || directory[0];
};

const buildGuestProfileSummary = (record = {}) => {
  const prefixData = resolveNamePrefixById(record.preFixId || null);
  const prefix = record.preFixName || prefixData.preFixName || "";
  const guestName = record.guestName || `${record.firstName || "Guest"} ${record.lastName || ""}`.trim();
  return {
    guestId: toPositiveInt(record.guestId, null) || nextManualGuestId(),
    referralId: record.referralId || `WR-${String(record.guestId || 1).padStart(5, "0")}`,
    guestName,
    billingName: prefix ? `${prefix} ${guestName}`.trim() : guestName,
    phoneNo: record.contact || record.phone || record.mobile || "",
    address: record.address || record.cityName || record.city || "Waari HQ, Pune",
    adharNo: record.adharNo || "",
    adharCard: record.adharCard || record.adhar || "",
    panNo: record.panNo || "",
    pan: record.pan || "",
    passportNo: record.passportNo || "",
    passport: record.passport || "",
    loyaltyCard: record.cardName || record.loyaltyCard || "Silver",
    loyaltyPoint: toPositiveInt(record.loyaltyPoints, null) || 0,
    assignedUserId: toPositiveInt(record.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID,
  };
};

const filterRecordsForGuest = (records = [], guestRecord = {}) => {
  if (!records.length) {
    return records;
  }
  const guestSeed = toPositiveInt(guestRecord.guestId, null) || 1;
  const filtered = records.filter((record, index) => {
    const key = toPositiveInt(record.historyId, null) || index + 1;
    return (key + guestSeed) % 2 === 0;
  });
  return filtered.length ? filtered : records;
};

const buildGroupGuestHistoryRecords = (guestRecord = {}) => {
  const records = groupTours.map((tour, index) => {
    const destination = findDestination(tour.destinationId || null);
    const country = findCountry(tour.countryId, destination?.destinationId);
    const state = findState(tour.stateId);
    const startDate = formatDateString(toDate(tour.startDate) || addDaysToDate(new Date(), index * 3));
    const endDate = formatDateString(
      toDate(tour.endDate) ||
        addDaysToDate(toDate(tour.startDate) || new Date(), Math.max(3, toPositiveInt(tour.days, null) || 4))
    );
    const adults = Math.max(1, toPositiveInt(tour.adults, null) || resolveGroupPaxCount(tour));
    return {
      historyId: Number(`${tour.groupTourId || 0}${index + 1}`) || index + 1,
      tourName: tour.tourName || destination?.destinationName || "Group Tour",
      countryName: country?.countryName || "India",
      stateName: state?.stateName || "Maharashtra",
      startDate,
      endDate,
      adults,
    };
  });
  if (!records.length) {
    const today = new Date();
    const fallback = DEFAULT_GUEST_DIRECTORY_SEEDS.map((seed, index) => ({
      historyId: 9000 + index + 1,
      tourName: `Signature Journey ${index + 1}`,
      countryName: "India",
      stateName: index % 2 === 0 ? "Maharashtra" : "Gujarat",
      startDate: formatDateString(addDaysToDate(today, -(index + 2) * 7)),
      endDate: formatDateString(addDaysToDate(today, -(index + 2) * 7 + 5)),
      adults: seed.paxPerHead || 2,
    }));
    return filterRecordsForGuest(fallback, guestRecord);
  }
  return filterRecordsForGuest(records, guestRecord);
};

const buildCustomGuestHistoryRecords = (guestRecord = {}) => {
  const records = collectCustomEnquiryIds()
    .map((id, index) => {
      const detail = buildCustomEnquiryDetail(id);
      if (!detail) {
        return null;
      }
      const startDate = detail.startDate || formatDateString(addDaysToDate(new Date(), index * 4));
      const endDate =
        detail.endDate ||
        formatDateString(
          addDaysToDate(toDate(detail.startDate) || new Date(), Math.max(3, toPositiveInt(detail.days, null) || 4))
        );
      const adults = Math.max(1, toPositiveInt(detail.adults, null) || 2);
      return {
        historyId: Number(`${id}${index + 1}`),
        tourName: detail.groupName || detail.tourName || `Custom Journey ${id}`,
        countryName: detail.countryName || "India",
        stateName: detail.stateName || "Maharashtra",
        startDate,
        endDate,
        adults,
      };
    })
    .filter(Boolean);
  if (!records.length) {
    const today = new Date();
    const fallback = DEFAULT_GUEST_DIRECTORY_SEEDS.map((seed, index) => ({
      historyId: 9500 + index + 1,
      tourName: `Curated Escape ${index + 1}`,
      countryName: index % 2 === 0 ? "India" : "Thailand",
      stateName: index % 2 === 0 ? "Goa" : "Bangkok",
      startDate: formatDateString(addDaysToDate(today, index * 6)),
      endDate: formatDateString(addDaysToDate(today, index * 6 + 5)),
      adults: seed.paxPerHead || 2,
    }));
    return filterRecordsForGuest(fallback, guestRecord);
  }
  return filterRecordsForGuest(records, guestRecord);
};

const LOYALTY_HISTORY_PLAN_NAMES = [
  "Referral Bonus",
  "Anniversary Reward",
  "Milestone Upgrade",
  "Festive Offer",
  "Birthday Treat",
];

const buildGuestLoyaltyHistoryRecords = (guestRecord = {}) => {
  const sources = [...buildGroupGuestHistoryRecords(guestRecord), ...buildCustomGuestHistoryRecords(guestRecord)];
  const base = sources.length
    ? sources
    : DEFAULT_GUEST_DIRECTORY_SEEDS.map((seed, index) => ({
        historyId: 9800 + index + 1,
        tourName: `Journey ${index + 1}`,
      }));
  const iterations = Math.max(6, Math.min(12, base.length));
  const entries = [];
  const basePoints = toPositiveInt(guestRecord.loyaltyPoints, null) || 180;
  for (let index = 0; index < iterations; index += 1) {
    const reference = base[index % base.length] || {};
    const planName = LOYALTY_HISTORY_PLAN_NAMES[index % LOYALTY_HISTORY_PLAN_NAMES.length];
    const points = Math.max(30, Math.round(basePoints / 6) + index * 8);
    const isDebit = index % 5 === 0;
    entries.push({
      historyId: Number(`${reference.historyId || index + 1}${index + 3}`) || index + 1,
      tour: reference.tourName || `Journey ${index + 1}`,
      planName,
      loyaltyPoint: points,
      description: `${planName} for ${reference.tourName || "recent travel"}`,
      isType: isDebit ? 1 : 2,
    });
  }
  return entries;
};

const matchesGuestFilters = (record, filters = {}) => {
  const guestNameFilter = filters.guestName || filters.name;
  if (guestNameFilter && !matchesText(record.guestName, guestNameFilter)) {
    return false;
  }
  if (filters.contact) {
    const contactQuery = filters.contact.toString().trim();
    if (contactQuery && !String(record.contact || "").includes(contactQuery)) {
      return false;
    }
  }
  const cardFilter = filters.cardName || filters.cardId;
  if (cardFilter !== undefined && cardFilter !== null && cardFilter !== "") {
    const cardIdFilter = toPositiveInt(cardFilter, null);
    if (cardIdFilter) {
      if (Number(record.cardId) !== Number(cardIdFilter)) {
        return false;
      }
    } else if (!matchesText(record.cardName, cardFilter)) {
      return false;
    }
  }
  const referralFilter = filters.referralId || filters.refferalId;
  if (referralFilter && !matchesText(record.referralId, referralFilter)) {
    return false;
  }
  return true;
};

const buildScopedGuestListing = ({
  scope = "mine",
  page = 1,
  perPage = 10,
  filters = {},
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
  message = "",
}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const records = buildGuestLoyaltyDirectory()
    .filter((record) => matchesConfirmScope(record, scope, scopedUserId))
    .filter((record) => matchesGuestFilters(record, filters));
  return buildListResponse(records, pageNumber, perPageNumber, filters, message);
};

const listGuestsDirectory = (options = {}) =>
  buildScopedGuestListing({ ...options, scope: "mine", message: "Guest list fetched successfully" });

const listAllGuestsDirectory = (options = {}) =>
  buildScopedGuestListing({ ...options, scope: "all", message: "All guest list fetched successfully" });

const searchAllGuestsDirectory = (options = {}) =>
  buildScopedGuestListing({ ...options, scope: "all", message: "Guest search fetched successfully" });

const searchGuestEmails = ({ firstName, guestName, search, email, limit = 10 } = {}) => {
  const query = sanitizeText(firstName || guestName || search || email || "");
  const numericQuery = query.replace(/[^0-9]/g, "");
  const limitNumber = Math.max(1, Math.min(50, toPositiveInt(limit, 10) || 10));
  if (!query && !numericQuery) {
    return [];
  }
  const records = buildGuestLoyaltyDirectory();
  if (!records.length) {
    return [];
  }
  const matches = [];
  for (let index = 0; index < records.length && matches.length < limitNumber; index += 1) {
    const record = records[index];
    const nameMatch =
      (query && matchesText(record.guestName, query)) ||
      (query && matchesText(record.firstName, query)) ||
      (query && matchesText(record.lastName, query)) ||
      (query && matchesText(record.userName, query)) ||
      (query && matchesText(record.email || record.mailId || "", query));
    const contactValue = (record.contact || record.phone || "").toString();
    const hasContactMatch = numericQuery ? contactValue.replace(/[^0-9]/g, "").includes(numericQuery) : false;
    if (nameMatch || hasContactMatch) {
      matches.push({
        value: record.guestId || record.userId || index + 1,
        label: record.guestName || record.userName || record.firstName || `Guest ${index + 1}`,
        email: record.email || record.mailId || "",
        contact: record.contact || record.phone || "",
      });
    }
  }
  return matches;
};

const listLoyaltyGuests = (options = {}) =>
  buildScopedGuestListing({ ...options, scope: "mine", message: "Loyalty guests fetched successfully" });

const listAllLoyaltyGuests = (options = {}) =>
  buildScopedGuestListing({ ...options, scope: "all", message: "All loyalty guests fetched successfully" });

const updateLoyaltyStatus = async ({ userId, statusType, status = true } = {}) => {
  const id = toPositiveInt(userId, null);
  if (!id) {
    const error = new Error("userId is required");
    error.status = 400;
    throw error;
  }
  const typeQuery = normalize(statusType);
  const type = typeQuery === "delivery" ? "delivery" : typeQuery === "print" ? "print" : null;
  if (!type) {
    const error = new Error("Invalid status type");
    error.status = 400;
    throw error;
  }
  const directory = buildGuestLoyaltyDirectory();
  const record = directory.find((entry) => Number(entry.userId) === id);
  if (!record) {
    const error = new Error("Guest not found");
    error.status = 404;
    throw error;
  }
  const normalizedStatus = (() => {
    if (status === undefined) {
      return true;
    }
    if (typeof status === "string") {
      const normalized = normalize(status);
      if (["false", "0", "no", "off"].includes(normalized)) {
        return false;
      }
      if (["true", "1", "yes", "on"].includes(normalized)) {
        return true;
      }
    }
    return Boolean(status);
  })();
  const overrides = loyaltyStatusOverrides[id] || {};
  if (type === "print") {
    overrides.printedStatus = normalizedStatus;
  } else {
    overrides.deliveryStatus = normalizedStatus;
  }
  loyaltyStatusOverrides[id] = overrides;
  await persistTourFixture("loyaltyStatusOverrides");
  const printedStatus = overrides.printedStatus !== undefined ? overrides.printedStatus : record.printedStatus;
  const deliveryStatus = overrides.deliveryStatus !== undefined ? overrides.deliveryStatus : record.deliveryStatus;
  return {
    message: type === "print" ? "Print status updated successfully" : "Delivery status updated successfully",
    userId: id,
    printedStatus,
    printedStatusName: printedStatus ? "Printed" : "Pending",
    deliveryStatus,
    deliveryStatusName: deliveryStatus ? "Delivered" : "Awaiting Dispatch",
  };
};

const createGroupTourEnquiry = async (payload = {}) => {
  const groupTourId = toPositiveInt(payload.groupTourId, null);
  const tour = resolveGroupTourRecord(groupTourId);
  const adults = toPositiveInt(payload.adults, 0) || 0;
  const child = toPositiveInt(payload.child, 0) || 0;
  const paxNo = Math.max(1, adults + child || 1);
  if (paxNo > 6) {
    const error = new Error("Pax size cannot exceed 6 people");
    error.status = 400;
    throw error;
  }
  const priorityId = toPositiveInt(payload.priorityId, null) || fallbackPriorityId();
  const enquiryReferId = toPositiveInt(payload.enquiryReferId, null) || fallbackEnquiryReferenceId();
  const guestRefId = payload.guestRefId || fallbackGuestReferenceId();
  const nextFollowUp = normalizeFollowUpDate(payload.nextFollowUp);
  const enquiryDate = payload.enquiryDate ? normalizeFollowUpDate(payload.enquiryDate) : formatDateOnly(startOfToday());
  const assignedSource =
    payload.assignedUserId || payload.assignedUserName ? payload : tour || { assignedUserId: DEFAULT_FOLLOW_UP_USER_ID };
  const assigned = resolveAssignedUser(assignedSource);
  const contact = (payload.contact || "").toString().trim();
  const email = (payload.mail || payload.email || "").toString().trim();
  const fullName = (payload.fullName || payload.contactName || "Primary Guest").toString().trim();
  const groupName = (payload.groupName || tour?.groupName || tour?.tourName || fullName || "Group Enquiry").toString().trim();
  const nextFollowUpTime = (payload.nextFollowUpTime || "10:00 AM").toString().trim() || "10:00 AM";
  const enquiryGroupId = nextManualGroupEnquiryId();
  const entry = {
    enquiryGroupId,
    uniqueEnqueryId: `GT-ENQ-${enquiryGroupId}`,
    groupTourId: tour?.groupTourId || groupTourId || enquiryGroupId,
    groupName,
    fullName,
    contact,
    email,
    adults,
    child,
    paxNo,
    priorityId,
    enquiryReferId,
    guestRefId,
    familyHeadNo: toPositiveInt(payload.familyHeadNo, 1) || 1,
    nextFollowUp,
    nextFollowUpTime,
    enquiryDate,
    assignedUserId: assigned.assignedUserId,
    assignedUserName: assigned.assignedUserName,
    status: "ENQUIRY",
    workflowStage: "ENQUIRY",
    source: payload.source || "dashboard",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  groupTourEnquiries.push(entry);
  await persistTourFixture("groupTourEnquiries");
  return {
    message: "Group tour enquiry added successfully",
    enquiryGroupId: entry.enquiryGroupId,
    uniqueEnqueryId: entry.uniqueEnqueryId,
    data: entry,
  };
};

const updateGroupTourEnquiry = async (payload = {}) => {
  const enquiryGroupId = toPositiveInt(payload.enquiryGroupId, null);
  if (!enquiryGroupId) {
    const error = new Error("enquiryGroupId is required");
    error.status = 400;
    throw error;
  }
  const index = groupTourEnquiries.findIndex((entry) => Number(entry.enquiryGroupId) === enquiryGroupId);
  if (index === -1) {
    return null;
  }
  const existing = groupTourEnquiries[index];
  const adultsInput = payload.adults !== undefined ? toPositiveInt(payload.adults, 0) : null;
  const childInput = payload.child !== undefined ? toPositiveInt(payload.child, 0) : null;
  const adults = adultsInput !== null ? adultsInput : toPositiveInt(existing.adults, 0) || 0;
  const child = childInput !== null ? childInput : toPositiveInt(existing.child, 0) || 0;
  const paxNo = Math.max(1, adults + child || existing.paxNo || 1);
  if (paxNo > 6) {
    const error = new Error("Pax size cannot exceed 6 people");
    error.status = 400;
    throw error;
  }
  const priorityMeta =
    payload.priorityId !== undefined
      ? resolvePriorityMeta(payload.priorityId, existing.priorityName || "")
      : resolvePriorityMeta(existing.priorityId, existing.priorityName || "");
  const referenceMeta =
    payload.enquiryReferId !== undefined
      ? resolvePlanEnquiryReference({ enquiryReferId: payload.enquiryReferId }, existing.enquiryReferId)
      : resolvePlanEnquiryReference({ enquiryReferId: existing.enquiryReferId }, existing.enquiryReferId);
  const nextGroupTourId =
    payload.groupTourId !== undefined
      ? toPositiveInt(payload.groupTourId, existing.groupTourId) || existing.groupTourId
      : existing.groupTourId;
  const emailInput = payload.mail !== undefined ? payload.mail : payload.email;
  const updatedRecord = {
    ...existing,
    groupTourId: nextGroupTourId,
    groupName: payload.groupName !== undefined ? selectSanitizedValue(payload.groupName, existing.groupName) : existing.groupName,
    fullName: payload.fullName !== undefined ? selectSanitizedValue(payload.fullName, existing.fullName) : existing.fullName,
    contact: payload.contact !== undefined ? selectSanitizedValue(payload.contact, existing.contact) : existing.contact,
    email: emailInput !== undefined ? selectSanitizedValue(emailInput, existing.email) : existing.email,
    adults,
    child,
    paxNo,
    priorityId: priorityMeta.priorityId,
    priorityName: priorityMeta.priorityName,
    enquiryReferId: referenceMeta.enquiryReferId,
    enquiryReferName: referenceMeta.enquiryReferName,
    guestRefId:
      payload.guestRefId !== undefined ? selectSanitizedValue(payload.guestRefId, existing.guestRefId || "") : existing.guestRefId,
    familyHeadNo: toPositiveInt(payload.familyHeadNo, null) || existing.familyHeadNo || 1,
    updatedAt: new Date().toISOString(),
  };
  groupTourEnquiries[index] = updatedRecord;
  await persistTourFixture("groupTourEnquiries");
  return {
    message: "Group tour enquiry updated successfully",
    enquiryGroupId: updatedRecord.enquiryGroupId,
    uniqueEnqueryId: updatedRecord.uniqueEnqueryId,
    data: updatedRecord,
  };
};

const resolveReportYear = (value) => {
  const currentYear = new Date().getFullYear();
  const parsed = toPositiveInt(value, null);
  if (parsed) {
    return Math.max(2018, Math.min(currentYear + 1, parsed));
  }
  if (typeof value === "string") {
    const digits = value.replace(/[^0-9]/g, "");
    const numeric = toPositiveInt(digits, null);
    if (numeric) {
      return Math.max(2018, Math.min(currentYear + 1, numeric));
    }
  }
  return currentYear;
};

const resolveReportMonth = (value) => {
  const fallback = new Date().getMonth() + 1;
  const parsed = toPositiveInt(value, null);
  if (parsed && parsed >= 1 && parsed <= 12) {
    return parsed;
  }
  if (typeof value === "string") {
    const digits = value.replace(/[^0-9]/g, "");
    const numeric = toPositiveInt(digits, null);
    if (numeric && numeric >= 1 && numeric <= 12) {
      return numeric;
    }
  }
  return fallback;
};

const buildCommissionReportEntries = ({ year, month } = {}) => {
  const targetYear = resolveReportYear(year);
  const targetMonth = resolveReportMonth(month);
  const dataset = buildGuestLoyaltyDirectory();
  if (!dataset.length) {
    return [];
  }
  const baseFactor = (targetYear % 7) + targetMonth;
  return dataset.map((record, index) => {
    const enquiryCounter = index + 1;
    const enquiryId = `ENQ-${targetYear}${String(targetMonth).padStart(2, "0")}-${String(enquiryCounter).padStart(4, "0")}`;
    const enquiryMultiplier = Math.max(1, record.enquiryCount || 1);
    const inrCost = 32000 + ((index + baseFactor) % 12) * 3600 + enquiryMultiplier * 1400;
    const forexFactor = 1.1 + ((index + baseFactor) % 5) * 0.03;
    const totalCost = Math.round(inrCost * forexFactor);
    const commissionRate = Number((4 + ((index + baseFactor) % 5)).toFixed(1));
    const commission = Math.round((totalCost * commissionRate) / 100);
    return {
      enquiryId,
      guestName: record.guestName,
      inrCost,
      totalCost,
      commission,
      commissionRate,
    };
  });
};

const getCommissionReport = ({ page = 1, perPage = 10, year, month } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const targetYear = resolveReportYear(year);
  const targetMonth = resolveReportMonth(month);
  const entries = buildCommissionReportEntries({ year: targetYear, month: targetMonth });
  return buildListResponse(entries, pageNumber, perPageNumber, { year: targetYear, month: targetMonth }, "Commission report fetched successfully");
};

const buildWaariSelectReportEntries = ({ year } = {}) => {
  const targetYear = resolveReportYear(year);
  const dataset = buildGuestLoyaltyDirectory();
  if (!dataset.length) {
    return [];
  }
  const bonusSeed = (targetYear % 5) + 3;
  return dataset.map((record, index) => {
    const selfBooking = (index % 4) + 1;
    const selfTourSale = selfBooking * 45000 + (record.loyaltyPoints % 7) * 600;
    const selfBookingPoints = selfBooking * 30 + bonusSeed * 4;
    const referredGuest = Math.max(1, (record.enquiryCount || 1) - 1 + (index % 2));
    const referredGuestSale = referredGuest * 42000 + (index % 3) * 3800;
    const pointsEarnedTroughReferral = referredGuest * 22 + (record.loyaltyPoints % 45);
    const totalPointsEarned = Math.round(selfBookingPoints + pointsEarnedTroughReferral + (record.loyaltyPoints || 0) * 0.25);
    const pointsReedem = Math.round(Math.min(totalPointsEarned * 0.4, record.loyaltyPoints || totalPointsEarned));
    return {
      userName: record.userName,
      referralId: record.referralId,
      selfBooking,
      selfTourSale,
      selfBookingPoints,
      referredGuest,
      referredGuestSale,
      pointsEarnedTroughReferral,
      totalPointsEarned,
      pointsReedem,
    };
  });
};

const listWaariSelectReport = ({ page = 1, perPage = 10, year } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const targetYear = resolveReportYear(year);
  const entries = buildWaariSelectReportEntries({ year: targetYear });
  return buildListResponse(entries, pageNumber, perPageNumber, { year: targetYear }, "Waari select report fetched successfully");
};

const downloadWaariSelectReport = ({ year } = {}) => {
  const targetYear = resolveReportYear(year);
  return buildWaariSelectReportEntries({ year: targetYear });
};

const addGuestUser = async (payload = {}) => {
  const firstName = (payload.firstName || "").toString().trim();
  const lastName = (payload.lastName || "").toString().trim();
  const contact = (payload.phone || payload.contact || "").toString().trim();
  if (!firstName || !lastName || !contact) {
    const error = new Error("First name, last name, and phone are required");
    error.status = 400;
    throw error;
  }
  const guestId = nextManualGuestId();
  const prefix = resolveNamePrefixById(payload.preFixId || payload.namePreFix);
  const assignedUserId =
    toPositiveInt(payload.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const card = resolveManualGuestCard(payload.cardId, payload.cardName);
  const record = {
    guestId,
    preFixId: prefix.preFixId,
    preFixName: prefix.preFixName,
    firstName,
    lastName,
    guestName: `${firstName} ${lastName}`.trim(),
    email: (payload.email || "").toString().trim(),
    contact,
    dob: payload.dob || "",
    dom: payload.dom || "",
    adharNo: (payload.adharNo || "").toString().trim(),
    adhar: (payload.adhar || "").toString().trim(),
    pan: (payload.pan || "").toString().trim(),
    panNo: (payload.panNo || "").toString().trim(),
    passport: (payload.passport || "").toString().trim(),
    passportNo: (payload.passportNo || "").toString().trim(),
    cardId: (card && card.cardId) || toPositiveInt(payload.cardId, null) || null,
    cardName: (card && card.cardName) || payload.cardName || "",
    loyaltyPoints: toPositiveInt(payload.loyaltyPoint, null) || null,
    enquiryCount: Math.max(1, toPositiveInt(payload.enquiryCount, 1) || 1),
    referralId: payload.referralId || payload.refferalId || `WR-${String(guestId).padStart(5, "0")}`,
    assignedUserId,
    source: "manual",
    createdAt: new Date().toISOString(),
  };
  manualGuestDirectory.push(record);
  await persistTourFixture("manualGuestDirectory");
  return {
    message: "Guest added successfully",
    guestId,
    data: record,
  };
};

const getGuestTravelDetails = ({ guestId, tab = 1, page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const tabNumber = Number(tab) === 2 ? 2 : 1;
  const guestRecord = resolveGuestDirectoryRecord(guestId);
  const profile = buildGuestProfileSummary(guestRecord);
  const history =
    tabNumber === 2 ? buildCustomGuestHistoryRecords(guestRecord) : buildGroupGuestHistoryRecords(guestRecord);
  const message = tabNumber === 2
    ? "Custom guest travel history fetched successfully"
    : "Group guest travel history fetched successfully";
  const response = buildListResponse(history, pageNumber, perPageNumber, { guestId: guestId || profile.referralId, tab: tabNumber }, message);
  return {
    ...response,
    guestId: profile.guestId,
    referralId: profile.referralId,
    billingName: profile.billingName,
    phoneNo: profile.phoneNo,
    address: profile.address,
    adharNo: profile.adharNo,
    adharCard: profile.adharCard,
    panNo: profile.panNo,
    pan: profile.pan,
    passportNo: profile.passportNo,
    passport: profile.passport,
    loyaltyCard: profile.loyaltyCard,
    loyaltyPoint: profile.loyaltyPoint,
  };
};

const getGuestLoyaltyHistory = ({ guestId, page = 1, perPage = 10 } = {}) => {
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const guestRecord = resolveGuestDirectoryRecord(guestId);
  const profile = buildGuestProfileSummary(guestRecord);
  const history = buildGuestLoyaltyHistoryRecords(guestRecord);
  const response = buildListResponse(history, pageNumber, perPageNumber, { guestId: guestId || profile.referralId }, "Loyalty history fetched successfully");
  return {
    ...response,
    guestId: profile.guestId,
    referralId: profile.referralId,
    billingName: profile.billingName,
    phoneNo: profile.phoneNo,
    loyaltyCard: profile.loyaltyCard,
    loyaltyPoint: profile.loyaltyPoint,
  };
};

const buildRefereeLeaderboard = ({
  scope = "mine",
  currentUserId = DEFAULT_FOLLOW_UP_USER_ID,
  metric = "enquiryCount",
} = {}) => {
  const scopedUserId = toPositiveInt(currentUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const dataset = buildGuestLoyaltyDirectory().filter((record) => matchesConfirmScope(record, scope, scopedUserId));
  return dataset
    .slice()
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, 5)
    .map((record) => ({
      userId: record.userId,
      firstName: record.firstName,
      lastName: record.lastName,
      guestName: record.guestName,
      enquiryCount: record.enquiryCount,
      loyaltyPoints: record.loyaltyPoints,
      contact: record.contact,
    }));
};

const getRefereeGuestCounts = (options = {}) => ({
  message: "Top referee guests fetched successfully",
  generatedOn: formatDateOnly(startOfToday()),
  scope: "mine",
  refereeGuests: buildRefereeLeaderboard({ ...options, scope: "mine", metric: "enquiryCount" }),
});

const getAllRefereeGuestCounts = (options = {}) => ({
  message: "All referee guests fetched successfully",
  generatedOn: formatDateOnly(startOfToday()),
  scope: "all",
  refereeGuests: buildRefereeLeaderboard({ ...options, scope: "all", metric: "enquiryCount" }),
});

const getRefereeGuestSales = (options = {}) => ({
  message: "Top referee guest sales fetched successfully",
  generatedOn: formatDateOnly(startOfToday()),
  scope: "mine",
  refereeGuestsSales: buildRefereeLeaderboard({ ...options, scope: "mine", metric: "loyaltyPoints" }),
});

const getAllRefereeGuestSales = (options = {}) => ({
  message: "All referee guest sales fetched successfully",
  generatedOn: formatDateOnly(startOfToday()),
  scope: "all",
  refereeGuestsSales: buildRefereeLeaderboard({ ...options, scope: "all", metric: "loyaltyPoints" }),
});

const DEFAULT_CALL_STATUS_OPTIONS = [
  { callStatusId: 1, callStatusName: "Interested" },
  { callStatusId: 2, callStatusName: "Follow-up Scheduled" },
  { callStatusId: 3, callStatusName: "Not Reachable" },
  { callStatusId: 4, callStatusName: "Converted" },
  { callStatusId: 5, callStatusName: "Not Interested" },
];
const resolveCallStatusMeta = (callStatusId) => {
  const id = toPositiveInt(callStatusId, null);
  if (!id) {
    return DEFAULT_CALL_STATUS_OPTIONS[0];
  }
  return DEFAULT_CALL_STATUS_OPTIONS.find((option) => Number(option.callStatusId) === id) || DEFAULT_CALL_STATUS_OPTIONS[0];
};
const DEFAULT_ROOM_SHARING_OPTIONS = [
  { roomShareId: 1, roomShareName: "Twin Sharing", tourPrice: 22000, offerPrice: 20500 },
  { roomShareId: 2, roomShareName: "Triple Sharing", tourPrice: 21000, offerPrice: 19500 },
  { roomShareId: 3, roomShareName: "Single Sharing", tourPrice: 26000, offerPrice: 25000 },
];
const DEFAULT_NAME_PREFIXES = [
  { preFixId: 1, preFixName: "Mr." },
  { preFixId: 2, preFixName: "Mrs." },
  { preFixId: 3, preFixName: "Ms." },
  { preFixId: 4, preFixName: "Dr." },
  { preFixId: 5, preFixName: "Prof." },
];
const DEFAULT_HOTEL_CATEGORY_OPTIONS = [
  { hotelCatId: 1, hotelCatName: "Budget" },
  { hotelCatId: 2, hotelCatName: "Standard" },
  { hotelCatId: 3, hotelCatName: "Deluxe" },
  { hotelCatId: 4, hotelCatName: "Premium" },
  { hotelCatId: 5, hotelCatName: "Luxury" },
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
const DEFAULT_VOUCHER_TYPES = [
  { voucherTypeId: 1, voucherName: "Flight Tickets" },
  { voucherTypeId: 2, voucherName: "Hotel Confirmation" },
  { voucherTypeId: 3, voucherName: "Transport Voucher" },
  { voucherTypeId: 4, voucherName: "Sightseeing Itinerary" },
];
const DOCUMENT_BASE_URL = "https://files.waari.travel/documents";
const COMPANY_PROFILE = {
  companyName: "Musmade Hospitality Pvt. Ltd.",
  address: "Shop no: 7, LaCasita Complex, Near TJSB Bank, Sector - 32A, Ravet, Pune - 412101",
  phone: "9767807070",
  gstIn: "27AAPCM4986P1Z9",
  panNo: "AAPCM4986P",
};

const resolvePaymentModeMeta = (modeId) => {
  const id = toPositiveInt(modeId, null);
  const fallback = PAYMENT_MODE_OPTIONS[0];
  if (!id) {
    return fallback;
  }
  return PAYMENT_MODE_OPTIONS.find((option) => Number(option.paymentModeId) === id) || fallback;
};

const resolveOnlineTypeMeta = (typeId) => {
  const id = toPositiveInt(typeId, null);
  const fallback = ONLINE_TYPE_OPTIONS[0];
  if (!id) {
    return fallback;
  }
  return ONLINE_TYPE_OPTIONS.find((option) => Number(option.onlineTypeId) === id) || fallback;
};

const resolveCardTypeMeta = (typeId) => {
  const id = toPositiveInt(typeId, null);
  const fallback = CARD_TYPE_OPTIONS[0];
  if (!id) {
    return fallback;
  }
  return CARD_TYPE_OPTIONS.find((option) => Number(option.cardTypeId) === id) || fallback;
};

const resolveVoucherTypeMeta = (voucherTypeId) => {
  const id = toPositiveInt(voucherTypeId, null);
  return DEFAULT_VOUCHER_TYPES.find((option) => Number(option.voucherTypeId) === id) || DEFAULT_VOUCHER_TYPES[0];
};

const listVoucherTypeOptions = () => {
  const data = DEFAULT_VOUCHER_TYPES.map((entry) => ({ ...entry }));
  return {
    total: data.length,
    data,
    message: data.length ? "Voucher types fetched successfully" : "No voucher types available",
  };
};

const ensureCustomVoucherRecords = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return [];
  }
  if (!Array.isArray(customVoucherRecords[id]) || !customVoucherRecords[id].length) {
    customVoucherRecords[id] = DEFAULT_VOUCHER_TYPES.map((type, index) => ({
      customVoucherId: Number(`${id}${type.voucherTypeId}${index + 1}`),
      enquiryCustomId: id,
      voucherTypeId: type.voucherTypeId,
      voucherName: type.voucherName,
      vouchers: `${DOCUMENT_BASE_URL}/vouchers/${slugify(type.voucherName, "voucher")}-${id}-${index + 1}.pdf`,
      uploadedAt: new Date(Date.now() - index * 3600000).toISOString(),
    }));
  }
  return customVoucherRecords[id];
};

const listCustomVouchers = ({ enquiryCustomId, page = 1, perPage = 10 } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return {
      enquiryCustomId: null,
      total: 0,
      data: [],
      page: 1,
      perPage: perPage,
      lastPage: 1,
      message: "Invalid enquiryCustomId",
    };
  }
  const store = ensureCustomVoucherRecords(id).slice();
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  return {
    enquiryCustomId: id,
    ...buildListResponse(store, pageNumber, perPageNumber, { enquiryCustomId: id }, "Vouchers fetched successfully"),
  };
};

const uploadCustomVouchers = async ({ enquiryCustomId, voucherTypeId, file } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    const error = new Error("enquiryCustomId is required");
    error.status = 400;
    throw error;
  }
  const voucherType = resolveVoucherTypeMeta(voucherTypeId);
  const files = Array.isArray(file) ? file : [];
  const normalizedFiles = files
    .map((entry) => toStringValue(entry?.vouchers || entry?.filePath || entry?.url))
    .filter(Boolean);
  if (!normalizedFiles.length) {
    const error = new Error("file is required");
    error.status = 400;
    throw error;
  }
  const store = ensureCustomVoucherRecords(id);
  const created = normalizedFiles.map((url, index) => {
    const customVoucherId = Number(`${id}${Date.now()}${index + 1}`);
    const payload = {
      customVoucherId,
      enquiryCustomId: id,
      voucherTypeId: voucherType.voucherTypeId,
      voucherName: voucherType.voucherName,
      vouchers: url,
      uploadedAt: new Date().toISOString(),
    };
    store.push(payload);
    return payload;
  });
  customVoucherRecords[id] = store;
  await persistTourFixture("customVoucherRecords");
  return {
    message: "Vouchers uploaded successfully",
    totalUploaded: created.length,
    data: created,
  };
};

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
  const dataset = namePrefixes.length ? namePrefixes : DEFAULT_NAME_PREFIXES;
  const entry = dataset[index % dataset.length] || {};
  return {
    preFixId: entry.preFixId || index + 1,
    preFixName: entry.preFixName || (index % 2 === 0 ? "Mr." : "Ms."),
  };
};

const computeFamilyHeadPaxShare = (tour, familyCount, index) => {
  const total = Math.max(1, resolveGroupPaxCount(tour));
  const baseShare = Math.floor(total / familyCount);
  const remainder = total % familyCount;
  return Math.max(1, baseShare + (index < remainder ? 1 : 0));
};

const createFamilyHeadRecord = (tour, index, familyCount, override = {}) => {
  if (!tour || !tour.groupTourId) {
    return null;
  }
  const overrideEntry = override && typeof override === "object" ? override : {};
  const fallbackName = `${tour.groupName || tour.tourName || "Family"} ${index + 1}`;
  const fallbackPrefix = resolveNamePrefixByIndex(index);
  const prefixSource = resolveNamePrefixById(
    overrideEntry.preFixId ?? overrideEntry.namePreFix ?? overrideEntry.preFix
  );
  const prefix = {
    preFixId: prefixSource.preFixId || fallbackPrefix.preFixId,
    preFixName: overrideEntry.preFixName || prefixSource.preFixName || fallbackPrefix.preFixName,
  };
  const manualName = (
    overrideEntry.familyHeadName ||
    `${overrideEntry.firstName || ""} ${overrideEntry.lastName || ""}`
  ).trim();
  const [fallbackFirst, fallbackLast] = splitNameParts(fallbackName);
  const [manualFirst, manualLast] = splitNameParts(manualName || fallbackName);
  const safeFirstName = (overrideEntry.firstName || manualFirst || fallbackFirst || "Guest").toString().trim();
  const lastNameCandidate =
    overrideEntry.lastName !== undefined
      ? overrideEntry.lastName.toString().trim()
      : (manualName ? manualLast : fallbackLast).toString().trim();
  const safeLastName = lastNameCandidate || "";
  const destinationId = toPositiveInt(overrideEntry.destinationId, tour.destinationId);
  const destination = destinations.find((item) => Number(item.destinationId) === Number(destinationId));
  const paxPerHead = Math.max(
    1,
    toPositiveInt(overrideEntry.paxPerHead, null) || computeFamilyHeadPaxShare(tour, familyCount, index)
  );
  const familyHeadGtId =
    toPositiveInt(overrideEntry.familyHeadGtId, null) || generateFamilyHeadId(tour, index);
  const guestId =
    toPositiveInt(overrideEntry.guestId, null) || Number(`${tour.groupTourId || 0}${index + 1}`);
  const addressParts = [
    overrideEntry.address,
    overrideEntry.cityName,
    overrideEntry.stateName,
    overrideEntry.countryName,
    tour.cityName,
    destination ? destination.destinationName : "",
  ].filter(Boolean);
  const assignedUser = resolveAssignedUser({ ...tour, ...overrideEntry });
  const contact = overrideEntry.contact || resolveContact({ ...overrideEntry, ...tour });
  const emailLocal = (safeFirstName || "guest").toLowerCase();
  const emailSuffix = (safeLastName || "family").toLowerCase();
  const generatedEmail = `${emailLocal}.${emailSuffix}@waari.travel`;
  const email = (overrideEntry.email || tour.email || generatedEmail).trim();
  return {
    familyHeadGtId,
    enquiryGroupId: tour.groupTourId,
    preFixId: prefix.preFixId,
    preFixName: prefix.preFixName,
    firstName: safeFirstName,
    lastName: safeLastName,
    guestId,
    paxPerHead,
    destinationId: destination ? destination.destinationId : destinationId || null,
    destinationName: destination ? destination.destinationName : "",
    loyaltyPoints: 50 * (index + 1),
    address: addressParts.join(", ") || "Waari HQ, Pune",
    contact,
    email,
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
    const overrides = Array.isArray(groupFamilyHeadOverrides[tour.groupTourId])
      ? groupFamilyHeadOverrides[tour.groupTourId]
      : [];
    if (overrides.length) {
      overrides.forEach((override, index) => {
        const record = createFamilyHeadRecord(tour, index, overrides.length, override);
        if (record) {
          records.push(record);
        }
      });
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

const sanitizeFamilyHeadEntries = (entries = []) => {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const firstName = (entry.firstName || "").toString().trim();
      const lastName = (entry.lastName || "").toString().trim();
      if (!firstName && !lastName) {
        return null;
      }
      const prefixData = resolveNamePrefixById(entry.preFixId ?? entry.namePreFix ?? entry.preFix);
      return {
        preFixId: prefixData.preFixId,
        preFixName: entry.preFixName || prefixData.preFixName,
        firstName: firstName || (lastName ? "Guest" : ""),
        lastName,
        paxPerHead: toPositiveInt(entry.paxPerHead, null),
        guestId: toPositiveInt(entry.guestId, null),
      };
    })
    .filter(Boolean);
};

const resolveCustomTotalPax = (detail = {}) => {
  const adults = toPositiveInt(detail.adults, null) || 0;
  const child = toPositiveInt(detail.child, null) || 0;
  const paxOverride = toPositiveInt(detail.paxNo, null);
  return Math.max(1, paxOverride || adults + child || 1);
};

const computeCustomFamilyHeadShare = (detail, familyCount, index) => {
  const total = resolveCustomTotalPax(detail);
  const baseShare = Math.floor(total / Math.max(1, familyCount));
  const remainder = total % Math.max(1, familyCount);
  return Math.max(1, baseShare + (index < remainder ? 1 : 0));
};

const createCustomFamilyHeadRecord = (detail, index, familyCount, override = {}) => {
  if (!detail) {
    return null;
  }
  const fallbackPrefix = resolveNamePrefixByIndex(index);
  const prefixSource = resolveNamePrefixById(
    override.preFixId ?? detail.preFixId ?? fallbackPrefix.preFixId
  );
  const prefixName = override.preFixName || prefixSource.preFixName || fallbackPrefix.preFixName;
  const manualName = `${override.firstName || ""} ${override.lastName || ""}`.trim();
  const baseName = manualName || detail.fullName || detail.contactName || detail.groupName || `Custom Family ${index + 1}`;
  const [firstNameFallback, lastNameFallback] = splitNameParts(baseName);
  const firstName = (override.firstName || firstNameFallback || "Guest").trim();
  const lastName = (override.lastName || lastNameFallback || "").trim();
  const paxPerHead =
    toPositiveInt(override.paxPerHead, null) ||
    computeCustomFamilyHeadShare(detail, Math.max(1, familyCount), index);
  const enquiryDetailCustomId =
    toPositiveInt(override.enquiryDetailCustomId, null) ||
    Number(`${detail.enquiryDetailCustomId || detail.enquiryCustomId}${index + 1}`);
  const guestId = toPositiveInt(override.guestId, null) || Number(`${detail.enquiryCustomId}${index + 1}`);
  return {
    enquiryCustomId: detail.enquiryCustomId,
    enquiryDetailCustomId,
    familyHeadCtId: enquiryDetailCustomId,
    preFixId: prefixSource.preFixId,
    preFixName: prefixName,
    firstName,
    lastName,
    paxPerHead,
    guestId,
    status: override.status !== undefined ? Number(Boolean(override.status)) : undefined,
  };
};

const buildCustomFamilyHeadRecords = (enquiryCustomId) => {
  const detail = buildCustomEnquiryDetail(enquiryCustomId);
  if (!detail) {
    return [];
  }
  const override = customEnquiryDetails[detail.enquiryCustomId] || {};
  const manualEntries = Array.isArray(override.familyHead)
    ? sanitizeFamilyHeadEntries(override.familyHead)
    : [];
  if (manualEntries.length) {
    return manualEntries
      .map((entry, index) => createCustomFamilyHeadRecord(detail, index, manualEntries.length, entry))
      .filter(Boolean);
  }
  const familyCount = Math.max(1, toPositiveInt(detail.familyHeadNo, null) || 1);
  const records = [];
  for (let index = 0; index < familyCount; index += 1) {
    const record = createCustomFamilyHeadRecord(detail, index, familyCount);
    if (record) {
      records.push(record);
    }
  }
  return records;
};

const resolveCustomBillingContext = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return null;
  }
  const detail = buildCustomEnquiryDetail(id);
  if (!detail) {
    return null;
  }
  const summary =
    resolveCustomPaymentSummary(id) || {
      enquiryCustomId: id,
      grandTotal: 0,
      advancePayment: 0,
      balance: 0,
      uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${id}`,
    };
  const billing = buildCustomBillingData(detail, summary);
  return { detail, summary, billing };
};

const listCustomFamilyHeadData = ({ enquiryCustomId } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return {
      enquiryCustomId: null,
      total: 0,
      data: [],
      message: "No family head data available",
    };
  }
  const records = buildCustomFamilyHeadRecords(id);
  const billingContext = resolveCustomBillingContext(id);
  const isPaymentDone = billingContext ? billingContext.billing.balance <= 0 : false;
  const data = records.map((record, index) => ({
    ...record,
    status: record.status ?? (index === 0 && isPaymentDone ? 1 : 0),
  }));
  return {
    enquiryCustomId: id,
    total: data.length,
    data,
    message: data.length ? "Family head data fetched successfully" : "No family head data available",
  };
};

const resolveCustomFamilyHeadContext = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  const detailId = toPositiveInt(enquiryDetailCustomId, null);
  const listing = id ? listCustomFamilyHeadData({ enquiryCustomId: id }) : { data: [] };
  let familyHead = null;
  if (detailId) {
    familyHead =
      listing.data.find(
        (record) =>
          Number(record.enquiryDetailCustomId) === detailId || Number(record.familyHeadCtId) === detailId
      ) || null;
  }
  if (!familyHead) {
    familyHead = listing.data[0] || null;
  }
  const resolvedCustomId = familyHead?.enquiryCustomId || id || null;
  let detail = resolvedCustomId ? buildCustomEnquiryDetail(resolvedCustomId) : null;
  if (!familyHead && detail) {
    const familyCount = Math.max(1, toPositiveInt(detail.familyHeadNo, null) || 1);
    familyHead = createCustomFamilyHeadRecord(detail, 0, familyCount);
  }
  if (!detail && familyHead?.enquiryCustomId) {
    detail = buildCustomEnquiryDetail(familyHead.enquiryCustomId);
  }
  return {
    enquiryCustomId: detail?.enquiryCustomId || familyHead?.enquiryCustomId || id || null,
    enquiryDetailCustomId: familyHead?.enquiryDetailCustomId || detail?.enquiryDetailCustomId || null,
    familyHead,
    detail,
  };
};

const resolveCustomRoomShareOptions = (detail = {}) => {
  const id = toPositiveInt(detail?.enquiryCustomId, null);
  const source = (id && customEnquiryPackages[id]) || customPackageTemplate;
  if (Array.isArray(source) && source.length) {
    return source.map((pkg, index) => ({
      roomShareType: toPositiveInt(pkg.packageCustomId || pkg.packageId, null) || index + 1,
      roomShareTypeLabel: pkg.packageLabel || pkg.packageName || `Package ${index + 1}`,
    }));
  }
  return DEFAULT_ROOM_SHARING_OPTIONS.map((option, index) => ({
    roomShareType: option.roomShareId || index + 1,
    roomShareTypeLabel: option.roomShareName || `Option ${index + 1}`,
  }));
};

const buildCustomGuestDetailRecords = (context = {}) => {
  const familyHead = context.familyHead;
  if (!familyHead) {
    return [];
  }
  const detail = context.detail || (familyHead.enquiryCustomId ? buildCustomEnquiryDetail(familyHead.enquiryCustomId) : null);
  const paxCount = Math.max(
    1,
    toPositiveInt(familyHead.paxPerHead, null) || resolveCustomTotalPax(detail || {})
  );
  const roomOptions = resolveCustomRoomShareOptions(detail || {});
  const addressFallback =
    detail?.address ||
    (Array.isArray(detail?.cityDetails) && detail.cityDetails.length ? detail.cityDetails[0].citiesName : null) ||
    detail?.destinationName ||
    "Pune, India";
  const contactSeed =
    familyHead.guestId || familyHead.enquiryDetailCustomId || familyHead.enquiryCustomId || context.enquiryCustomId || 1;
  const records = [];
  for (let index = 0; index < paxCount; index += 1) {
    const guestId = Number(`${contactSeed}${index + 1}`);
    const [firstNameRaw, lastNameRaw] = splitNameParts(
      `${familyHead.firstName} ${familyHead.lastName} ${index + 1}`
    );
    const firstName = firstNameRaw || "Guest";
    const lastName = (lastNameRaw || "").trim();
    const roomShare = roomOptions[index % roomOptions.length];
    const issueDate = addDaysToDate(new Date(), -5 * 365 - index * 11);
    const expiryDate = addDaysToDate(issueDate, 10 * 365);
    records.push({
      enquiryCustomId: detail?.enquiryCustomId || context.enquiryCustomId || null,
      enquiryDetailCustomId: familyHead.enquiryDetailCustomId,
      guestId,
      preFixId: familyHead.preFixId,
      preFixName: familyHead.preFixName,
      firstName,
      lastName,
      guestName: `${firstName} ${lastName}`.trim(),
      address: addressFallback,
      contact: detail?.contact || `98${String(guestId).padStart(8, "0")}`,
      gender: index % 2 === 0 ? "Male" : "Female",
      dob: formatDateString(addDaysToDate(new Date(), -(25 + index) * 365)),
      mailId:
        detail?.mailId ||
        `${firstName.toLowerCase()}.${(lastName || "guest").toLowerCase() || "guest"}@waari.travel`,
      roomShareType: roomShare.roomShareType,
      roomShareTypeLabel: roomShare.roomShareTypeLabel,
      adharCard: `${DOCUMENT_BASE_URL}/aadhar-${guestId}.pdf`,
      adharNo: `9999${String(guestId).padStart(8, "0")}`,
      pan: `${DOCUMENT_BASE_URL}/pan-${guestId}.pdf`,
      panNo: `WAARI${String(guestId).padStart(4, "0")}K`,
      passport: `${DOCUMENT_BASE_URL}/passport-${guestId}.pdf`,
      passportNo: `P${String(guestId).padStart(7, "0")}`,
      passport_issue_date: formatDateString(issueDate),
      passport_expiry_date: formatDateString(expiryDate),
      marriageDate: index === 0 ? formatDateString(addDaysToDate(new Date(), -2000)) : "",
    });
  }
  return records;
};

const getCustomGuestDetails = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.familyHead) {
    return {
      enquiryCustomId: context.enquiryCustomId,
      enquiryDetailCustomId: context.enquiryDetailCustomId,
      total: 0,
      data: [],
      message: "No guest details available",
    };
  }
  const records = buildCustomGuestDetailRecords(context);
  return {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead.enquiryDetailCustomId,
    total: records.length,
    data: records,
    message: "Guest details fetched successfully",
  };
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

const saveFamilyHeadDetails = async ({ enquiryGroupId, familyHead, familyHeads } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  if (!id) {
    const error = new Error("enquiryGroupId is required");
    error.status = 400;
    throw error;
  }
  const entriesInput = Array.isArray(familyHead)
    ? familyHead
    : Array.isArray(familyHeads)
    ? familyHeads
    : [];
  const normalizedEntries = sanitizeFamilyHeadEntries(entriesInput);
  if (!normalizedEntries.length) {
    const error = new Error("familyHead data is required");
    error.status = 400;
    throw error;
  }
  const tourIndex = groupTours.findIndex((tour) => Number(tour.groupTourId) === id);
  if (tourIndex === -1) {
    const error = new Error("Group tour not found");
    error.status = 404;
    throw error;
  }
  groupFamilyHeadOverrides[id] = cloneValue(normalizedEntries, []);
  const existing = groupTours[tourIndex];
  groupTours[tourIndex] = {
    ...existing,
    familyHeadNo: normalizedEntries.length,
    updatedAt: new Date().toISOString(),
  };
  await persistTourFixture("groupFamilyHeadOverrides");
  await persistTourFixture("groupTours");
  const response = listFamilyHeadData({ enquiryGroupId: id });
  return {
    ...response,
    message: "Family head details saved successfully",
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

const listCustomFamilyHeadRoomShare = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  const detail = context.detail || (context.enquiryCustomId ? buildCustomEnquiryDetail(context.enquiryCustomId) : null);
  const options = resolveCustomRoomShareOptions(detail || {});
  const paxCount = Math.max(1, context.familyHead?.paxPerHead || resolveCustomTotalPax(detail || {}));
  const data = options.map((option, index) => ({
    roomShareId: option.roomShareType || option.roomShareId || index + 1,
    roomShareName: option.roomShareTypeLabel || option.roomShareName || `Option ${index + 1}`,
    count: index === 0 ? paxCount : 0,
  }));
  return {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead?.enquiryDetailCustomId || context.enquiryDetailCustomId || null,
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

const listCustomGuestDocumentRecords = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  const records = buildCustomGuestDetailRecords(context);
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
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.enquiryDetailCustomId,
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

const resolveCustomGuestDetailId = (guest, index = 0) =>
  toPositiveInt(guest.customGuestDetailsId, null) ||
  Number(`${guest.enquiryDetailCustomId || guest.enquiryCustomId || 1}${(index % 9) + 1}`);

const attachCustomGuestDetailIds = (records = []) =>
  records.map((guest, index) => ({
    ...guest,
    customGuestDetailsId: resolveCustomGuestDetailId(guest, index),
  }));

const getGroupCancellationOverride = (groupGuestDetailId) => {
  const id = toPositiveInt(groupGuestDetailId, null);
  if (!id) {
    return {};
  }
  if (!groupCancellationOverrides[id]) {
    groupCancellationOverrides[id] = {};
  }
  return groupCancellationOverrides[id];
};

const getCustomCancellationOverride = (customGuestDetailsId) => {
  const id = toPositiveInt(customGuestDetailsId, null);
  if (!id) {
    return {};
  }
  if (!customCancellationOverrides[id]) {
    customCancellationOverrides[id] = {};
  }
  return customCancellationOverrides[id];
};

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
    const record = {
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
    const override = getGroupCancellationOverride(record.groupGuestDetailId);
    if (!override || !Object.keys(override).length) {
      return record;
    }
    return {
      ...record,
      ...override,
      cancellationReason: override.cancellationReason || record.cancellationReason,
      cancellationCharges: override.cancellationCharges ?? record.cancellationCharges,
      refundAmount: override.refundAmount ?? record.refundAmount,
      cancelType: override.cancelType ?? record.cancelType,
      status: override.status ?? record.status,
      accountName: override.accountName || record.accountName,
      accountNo: override.accountNo || record.accountNo,
      bank: override.bank || record.bank,
      branch: override.branch || record.branch,
      ifsc: override.ifsc || record.ifsc,
      refundProof: override.refundProof || record.refundProof,
      creditNote: override.creditNote || record.creditNote,
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

const buildCustomCancellationProcessRecords = (guests = []) => {
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
  return guests.slice(0, Math.max(templates.length, guests.length)).map((guest, index) => {
    const template = templates[index % templates.length];
    const refundProof =
      template.cancelType === 1
        ? template.refundProof || `${DOCUMENT_BASE_URL}/refunds/custom-${guest.customGuestDetailsId}.pdf`
        : null;
    const creditNote =
      template.cancelType === 2
        ? template.creditNote || `${DOCUMENT_BASE_URL}/credit-notes/custom-${guest.customGuestDetailsId}.pdf`
        : null;
    const record = {
      enquiryCustomId: guest.enquiryCustomId,
      enquiryDetailCustomId: guest.enquiryDetailCustomId,
      guestId: guest.guestId,
      customGuestDetailsId: guest.customGuestDetailsId,
      name: guest.guestName,
      cancellationReason: template.cancellationReason,
      cancellationCharges: template.cancellationCharges,
      refundAmount: template.refundAmount,
      cancelType: template.cancelType,
      status: template.status,
      accountName: template.accountName || guest.guestName,
      accountNo: template.accountNo || `XXXX${String(guest.customGuestDetailsId).slice(-4)}`,
      bank: template.bank || "Waari Payments Bank",
      branch: template.branch || "Head Office",
      ifsc: template.ifsc || "WAAR0000001",
      refundProof,
      creditNote,
    };
    const override = getCustomCancellationOverride(record.customGuestDetailsId);
    if (!override || !Object.keys(override).length) {
      return record;
    }
    return {
      ...record,
      ...override,
      cancellationReason: override.cancellationReason || record.cancellationReason,
      cancellationCharges: override.cancellationCharges ?? record.cancellationCharges,
      refundAmount: override.refundAmount ?? record.refundAmount,
      cancelType: override.cancelType ?? record.cancelType,
      status: override.status ?? record.status,
      accountName: override.accountName || record.accountName,
      accountNo: override.accountNo || record.accountNo,
      bank: override.bank || record.bank,
      branch: override.branch || record.branch,
      ifsc: override.ifsc || record.ifsc,
      refundProof: override.refundProof || record.refundProof,
      creditNote: override.creditNote || record.creditNote,
    };
  });
};

const resolveCustomGuestCancellationState = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.familyHead) {
    return { context, guestRecords: [], cancellationRecords: [] };
  }
  const guestRecords = attachCustomGuestDetailIds(buildCustomGuestDetailRecords(context));
  const cancellationRecords = buildCustomCancellationProcessRecords(guestRecords);
  return { context, guestRecords, cancellationRecords };
};

const listCustomGuestsForCancellation = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const { context, guestRecords, cancellationRecords } = resolveCustomGuestCancellationState({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.familyHead) {
    return {
      enquiryCustomId: context.enquiryCustomId,
      enquiryDetailCustomId: context.enquiryDetailCustomId,
      total: 0,
      data: [],
      message: "No guests found for the provided enquiry",
    };
  }
  const cancelledIds = new Set(cancellationRecords.map((record) => record.customGuestDetailsId));
  const data = guestRecords.map((guest) => ({
    customGuestDetailsId: guest.customGuestDetailsId,
    enquiryCustomId: guest.enquiryCustomId,
    enquiryDetailCustomId: guest.enquiryDetailCustomId,
    guestId: guest.guestId,
    firstName: guest.firstName,
    lastName: guest.lastName,
    isCancel: cancelledIds.has(guest.customGuestDetailsId),
  }));
  return {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead.enquiryDetailCustomId,
    total: data.length,
    data,
    message: data.length
      ? "Custom guest list fetched successfully"
      : "No guests found for the provided enquiry",
  };
};

const getCustomCancellationProcessData = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const { context, cancellationRecords } = resolveCustomGuestCancellationState({ enquiryCustomId, enquiryDetailCustomId });
  return {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.enquiryDetailCustomId,
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

const getCustomGuestCouponUsage = ({ guestId, enquiryCustomId } = {}) => {
  const id = toPositiveInt(guestId, null) || null;
  const coupon = {
    couponId: 601,
    couponName: "WAARI-CT-5",
    discountType: 2,
    discountValue: 5,
    maxDiscount: 500,
    guestId: id,
    enquiryCustomId: toPositiveInt(enquiryCustomId, null) || null,
    toDate: formatDateString(addDaysToDate(new Date(), 30)),
    description: "5% off on custom tour cost up to ₹500",
  };
  return {
    data: coupon,
    message: "Coupon usage fetched successfully",
  };
};

const uploadGroupRefundProof = async ({ enquiryGroupId, familyHeadGtId, groupGuestDetailId, refundProof } = {}) => {
  const detailId = toPositiveInt(groupGuestDetailId, null);
  if (!detailId) {
    const error = new Error("groupGuestDetailId is required");
    error.status = 400;
    throw error;
  }
  const proofLink = toStringValue(refundProof);
  if (!proofLink) {
    const error = new Error("refundProof is required");
    error.status = 400;
    throw error;
  }
  const override = getGroupCancellationOverride(detailId);
  override.refundProof = proofLink;
  if (enquiryGroupId) {
    override.enquiryGroupId = toPositiveInt(enquiryGroupId, null) || override.enquiryGroupId || null;
  }
  if (familyHeadGtId) {
    override.familyHeadGtId = toPositiveInt(familyHeadGtId, null) || override.familyHeadGtId || null;
  }
  override.updatedAt = new Date().toISOString();
  groupCancellationOverrides[detailId] = override;
  await persistTourFixture("groupCancellationOverrides");
  return {
    message: "Refund proof uploaded successfully",
    groupGuestDetailId: detailId,
    refundProof: proofLink,
  };
};

const uploadCustomRefundProof = async ({ enquiryCustomId, enquiryDetailCustomId, customGuestDetailsId, refundProof } = {}) => {
  const detailId = toPositiveInt(customGuestDetailsId, null);
  if (!detailId) {
    const error = new Error("customGuestDetailsId is required");
    error.status = 400;
    throw error;
  }
  const proofLink = toStringValue(refundProof);
  if (!proofLink) {
    const error = new Error("refundProof is required");
    error.status = 400;
    throw error;
  }
  const override = getCustomCancellationOverride(detailId);
  override.refundProof = proofLink;
  if (enquiryCustomId) {
    override.enquiryCustomId = toPositiveInt(enquiryCustomId, null) || override.enquiryCustomId || null;
  }
  if (enquiryDetailCustomId) {
    override.enquiryDetailCustomId =
      toPositiveInt(enquiryDetailCustomId, null) || override.enquiryDetailCustomId || null;
  }
  override.updatedAt = new Date().toISOString();
  customCancellationOverrides[detailId] = override;
  await persistTourFixture("customCancellationOverrides");
  return {
    message: "Refund proof uploaded successfully",
    customGuestDetailsId: detailId,
    refundProof: proofLink,
  };
};

const cancelGroupEnquiry = async ({ enquiryGroupId, closureReason, cancelledBy } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  if (!id) {
    const error = new Error("enquiryGroupId is required");
    error.status = 400;
    throw error;
  }
  const reason = toStringValue(closureReason);
  if (!reason) {
    const error = new Error("closureReason is required");
    error.status = 400;
    throw error;
  }
  const detail = buildGroupEnquiryDetail(id) || {};
  const record = {
    enquiryGroupId: id,
    groupTourId: detail.enquiryGroupId || id,
    groupName: detail.groupName || detail.tourName || `Group Tour ${id}`,
    guestName: detail.fullName || detail.contactName || detail.groupName || "Waari Guest",
    closureReason: reason,
    cancelledBy: toStringValue(cancelledBy) || "system",
    cancelledAt: new Date().toISOString(),
    uniqueEnqueryId: detail.uniqueEnqueryId || `GT-${String(id).padStart(4, "0")}`,
    status: "CANCELLED",
  };
  groupEnquiryCancellationLogs[id] = record;
  await persistTourFixture("groupEnquiryCancellationLogs");
  return {
    message: "Group enquiry cancelled successfully",
    data: record,
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

const getCustomTourCostDetails = ({ enquiryCustomId, enquiryDetailCustomId, guestId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.familyHead || !context.enquiryCustomId) {
    return { data: {}, message: "Family head data not found" };
  }
  const detail = context.detail || buildCustomEnquiryDetail(context.enquiryCustomId);
  if (!detail) {
    return { data: {}, message: "Family head data not found" };
  }
  const billingContext = resolveCustomBillingContext(context.enquiryCustomId);
  const summary =
    billingContext?.summary ||
    resolveCustomPaymentSummary(context.enquiryCustomId) || {
      enquiryCustomId: context.enquiryCustomId,
      grandTotal: 0,
      advancePayment: 0,
      balance: 0,
      uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${context.enquiryCustomId}`,
    };
  const totalPax = resolveCustomTotalPax(detail);
  const paxPerHead = Math.max(1, context.familyHead.paxPerHead || totalPax);
  const ratio = totalPax ? Math.min(1, paxPerHead / totalPax) : 1;
  const shareAmount = toNumber(summary.grandTotal, 0) * ratio;
  const payment = buildPaymentBreakdown(shareAmount);
  const coupon = getCustomGuestCouponUsage({ guestId, enquiryCustomId: context.enquiryCustomId }).data;
  const loyaltyPoints = Math.max(0, toNumber(context.familyHead.loyaltyPoints, 0));
  const points = Math.min(500, loyaltyPoints);
  const couponDiscountAmount = coupon
    ? Number(coupon.discountType) === 2
      ? Math.min(payment.discounted * (coupon.discountValue / 100), coupon.maxDiscount)
      : coupon.discountValue
    : 0;
  const data = {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead.enquiryDetailCustomId,
    guestId: toPositiveInt(guestId, context.familyHead.guestId),
    tourPrice: payment.tourPrice,
    points,
    discountprice: Math.max(0, payment.discounted - couponDiscountAmount - points),
    gst: payment.gst,
    tcs: payment.tcs,
    grandtotal: payment.grand,
    couponDiscount: couponDiscountAmount,
    couponId: coupon?.couponId || null,
    loyaltyPoints: loyaltyPoints,
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

const getCustomPaymentCalculationDetails = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.familyHead || !context.enquiryCustomId) {
    return { data: {}, message: "Family head data not found" };
  }
  const detail = context.detail || buildCustomEnquiryDetail(context.enquiryCustomId);
  if (!detail) {
    return { data: {}, message: "Family head data not found" };
  }
  const billingContext = resolveCustomBillingContext(context.enquiryCustomId);
  const summary =
    billingContext?.summary ||
    resolveCustomPaymentSummary(context.enquiryCustomId) || {
      enquiryCustomId: context.enquiryCustomId,
      grandTotal: 0,
      advancePayment: 0,
      balance: 0,
      uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${context.enquiryCustomId}`,
    };
  const billing = billingContext?.billing || buildCustomBillingData(detail, summary);
  const totalPax = resolveCustomTotalPax(detail);
  const paxPerHead = Math.max(1, context.familyHead.paxPerHead || totalPax);
  const ratio = totalPax ? Math.min(1, paxPerHead / totalPax) : 1;
  const shareAmount = toNumber(summary.grandTotal, 0) * ratio;
  const payment = buildPaymentBreakdown(shareAmount);
  const billingName = `${context.familyHead.preFixName || ""} ${context.familyHead.firstName || ""} ${
    context.familyHead.lastName || ""
  }`
    .replace(/\s+/g, " ")
    .trim() || billing.billingName;
  const address = context.familyHead.address || detail.address || billing.address;
  const phoneNo = context.familyHead.contact || detail.contact || billing.phoneNumber;
  const data = {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead.enquiryDetailCustomId,
    sameAsbillingName: billingName,
    sameAsaddress: address,
    sameAsphoneno: phoneNo,
    billingName,
    address,
    phoneNo,
    gstin: billing.gstIn || COMPANY_PROFILE.gstIn,
    panNo: billing.panNumber || COMPANY_PROFILE.panNo,
    grandTotal: Number(payment.grand.toFixed(2)),
    advancePayment: Number(payment.advancePayment.toFixed(2)),
    paymentModeId: PAYMENT_MODE_OPTIONS[0].paymentModeId,
    onlineTypeId: ONLINE_TYPE_OPTIONS[0].onlineTypeId,
    cardTypeId: CARD_TYPE_OPTIONS[0].cardTypeId,
    bankName: "Waari Payments Bank",
    chequeNo: "",
    paymentDate: formatDateString(new Date()),
    transactionId: `TXNCT${context.familyHead.enquiryDetailCustomId}`,
    transactionProof: `${DOCUMENT_BASE_URL}/payments/custom-${context.familyHead.enquiryDetailCustomId}.png`,
    balance: Number(payment.balance.toFixed(2)),
    isPaymentDone: payment.balance <= 0,
  };
  return {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.familyHead.enquiryDetailCustomId,
    data,
    message: "Payment calculation fetched successfully",
  };
};

const getGroupPaymentOverride = (groupPaymentDetailId) => {
  const id = toPositiveInt(groupPaymentDetailId, null);
  if (!id) {
    return {};
  }
  if (!groupPaymentOverrides[id]) {
    groupPaymentOverrides[id] = { groupPaymentDetailId: id };
  } else if (!groupPaymentOverrides[id].groupPaymentDetailId) {
    groupPaymentOverrides[id].groupPaymentDetailId = id;
  }
  return groupPaymentOverrides[id];
};

const normalizePaymentDate = (value) => {
  if (!value) {
    return formatDateOnly(new Date());
  }
  const parsed = toDate(value);
  return parsed ? formatDateOnly(parsed) : value;
};

const hydrateGroupPaymentEntry = (context, entry, override = {}) => {
  const resolvedId = toPositiveInt(override.groupPaymentDetailId, entry.groupPaymentDetailId);
  const paymentModeMeta = resolvePaymentModeMeta(override.paymentModeId ?? entry.paymentModeId);
  const onlineMeta = resolveOnlineTypeMeta(override.onlineTypeId ?? entry.onlineTypeId);
  return {
    ...entry,
    ...override,
    groupPaymentDetailId: resolvedId,
    enquiryGroupId: entry.enquiryGroupId || context.enquiryGroupId,
    familyHeadGtId: entry.familyHeadGtId || context.familyHead.familyHeadGtId,
    status: override.status ?? entry.status ?? 0,
    paymentModeId: paymentModeMeta.paymentModeId,
    paymentModeName: override.paymentModeName || paymentModeMeta.paymentModeName,
    paymentMode: override.paymentModeName || paymentModeMeta.paymentModeName,
    onlineTypeId: onlineMeta.onlineTypeId,
    onlineTypeName: override.onlineTypeName || onlineMeta.onlineTypeName,
    paymentDate: normalizePaymentDate(override.paymentDate || entry.paymentDate),
    bankName: selectSanitizedValue(override.bankName, entry.bankName || "Waari Bank"),
    chequeNo: selectSanitizedValue(override.chequeNo, entry.chequeNo || ""),
    transactionId: selectSanitizedValue(override.transactionId, entry.transactionId || `TXN${resolvedId}`),
    transactionProof: selectSanitizedValue(
      override.transactionProof,
      entry.transactionProof || `${DOCUMENT_BASE_URL}/payments/${resolvedId}.pdf`
    ),
    receiptNo: override.receiptNo || entry.receiptNo || `REC-${resolvedId}`,
  };
};

const buildGroupAdvancePayments = (context, payment, receiptPrefix) => {
  const entries = [];
  const baseId = context.familyHead.familyHeadGtId || context.enquiryGroupId || 0;
  const primaryId = Number(`${baseId}1`);
  entries.push({
    groupPaymentDetailId: primaryId,
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    advancePayment: payment.advancePayment,
    status: 1,
    paymentModeId: 1,
    onlineTypeId: 1,
    paymentDate: formatDateString(new Date()),
    transactionId: `TXN${primaryId}`,
    transactionProof: `${DOCUMENT_BASE_URL}/payments/${primaryId}.pdf`,
    receiptNo: `${receiptPrefix}-1`,
  });
  if (payment.balance > 0) {
    const secondaryId = Number(`${baseId}2`);
    entries.push({
      groupPaymentDetailId: secondaryId,
      enquiryGroupId: context.enquiryGroupId,
      familyHeadGtId: context.familyHead.familyHeadGtId,
      advancePayment: Math.min(payment.balance, payment.advancePayment / 2),
      status: 0,
      paymentModeId: 2,
      paymentDate: formatDateString(addDaysToDate(new Date(), 7)),
      bankName: "Waari Cooperative Bank",
      chequeNo: `CQ${secondaryId}`,
      receiptNo: `${receiptPrefix}-2`,
    });
  }
  const baseEntries = entries.map((entry) =>
    hydrateGroupPaymentEntry(context, entry, getGroupPaymentOverride(entry.groupPaymentDetailId))
  );
  const entryIds = new Set(entries.map((entry) => Number(entry.groupPaymentDetailId)));
  const manualEntries = Object.values(groupPaymentOverrides || {})
    .filter((override) => override && toPositiveInt(override.groupPaymentDetailId, null))
    .filter(
      (override) =>
        Number(override.enquiryGroupId) === Number(context.enquiryGroupId) &&
        Number(override.familyHeadGtId) === Number(context.familyHead.familyHeadGtId)
    )
    .filter((override) => !entryIds.has(Number(override.groupPaymentDetailId)))
    .map((override, index) =>
      hydrateGroupPaymentEntry(
        context,
        {
          groupPaymentDetailId: toPositiveInt(override.groupPaymentDetailId, null),
          enquiryGroupId: context.enquiryGroupId,
          familyHeadGtId: context.familyHead.familyHeadGtId,
          advancePayment: toNumber(override.advancePayment, 0),
          status: override.status ?? 0,
          paymentModeId: override.paymentModeId || 1,
          onlineTypeId: override.onlineTypeId || 1,
          paymentDate: override.paymentDate || formatDateOnly(new Date()),
          bankName: override.bankName,
          chequeNo: override.chequeNo,
          transactionId: override.transactionId || `TXN${override.groupPaymentDetailId}`,
          transactionProof: override.transactionProof || `${DOCUMENT_BASE_URL}/payments/${override.groupPaymentDetailId}.pdf`,
          receiptNo: override.receiptNo || `${receiptPrefix}-${entries.length + index + 1}`,
        },
        override
      )
    );
  const combined = [...baseEntries, ...manualEntries];
  combined.sort((a, b) => toSortableTimestamp(b.paymentDate) - toSortableTimestamp(a.paymentDate));
  return combined;
};

const buildGroupBillingPayload = (context) => {
  if (!context.familyHead || !context.tour) {
    return null;
  }
  const share = resolveFamilyHeadShare(context.tour, context.familyHead);
  const payment = buildPaymentBreakdown(share.shareAmount);
  const receiptPrefix = `REC-${context.familyHead.familyHeadGtId || context.enquiryGroupId}`;
  const advancePayments = buildGroupAdvancePayments(context, payment, receiptPrefix);
  const paidAmount = advancePayments
    .filter((entry) => Number(entry.status) === 1)
    .reduce((total, entry) => total + toNumber(entry.advancePayment, 0), 0);
  const balance = Math.max(0, payment.grand - paidAmount);
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    billingName: `${context.familyHead.preFixName} ${context.familyHead.firstName} ${context.familyHead.lastName}`.trim(),
    address: context.familyHead.address,
    phoneNumber: context.familyHead.contact,
    gstIn: COMPANY_PROFILE.gstIn,
    panNumber: COMPANY_PROFILE.panNo,
    grandTotal: payment.grand,
    balance,
    isPaymentDone: balance <= 0,
    advancePayments,
  };
};

const receiveGroupBill = async ({
  enquiryGroupId,
  familyHeadGtId,
  advancePayment,
  paymentModeId,
  onlineTypeId,
  bankName,
  chequeNo,
  paymentDate,
  transactionId,
  transactionProof,
} = {}) => {
  const groupId = toPositiveInt(enquiryGroupId, null);
  if (!groupId) {
    const error = new Error("enquiryGroupId is required");
    error.status = 400;
    throw error;
  }
  const amount = roundCurrency(toNumber(advancePayment, null));
  if (!amount || amount <= 0) {
    const error = new Error("advancePayment must be greater than zero");
    error.status = 400;
    throw error;
  }
  const context = resolveFamilyHeadContext({ enquiryGroupId: groupId, familyHeadGtId });
  if (!context.familyHead || !context.tour) {
    const error = new Error("Family head data not found");
    error.status = 404;
    throw error;
  }
  const paymentId = nextGroupPaymentDetailId();
  const paymentModeMeta = resolvePaymentModeMeta(paymentModeId);
  const onlineMeta = resolveOnlineTypeMeta(onlineTypeId);
  const normalizedDate = normalizePaymentDate(paymentDate);
  const override = {
    groupPaymentDetailId: paymentId,
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    advancePayment: amount,
    status: 0,
    paymentModeId: paymentModeMeta.paymentModeId,
    paymentModeName: paymentModeMeta.paymentModeName,
    onlineTypeId: onlineMeta.onlineTypeId,
    onlineTypeName: onlineMeta.onlineTypeName,
    bankName: selectSanitizedValue(bankName, ""),
    chequeNo: selectSanitizedValue(chequeNo, ""),
    paymentDate: normalizedDate,
    transactionId: selectSanitizedValue(transactionId, `TXN${paymentId}`),
    transactionProof: selectSanitizedValue(transactionProof, `${DOCUMENT_BASE_URL}/payments/${paymentId}.pdf`),
    receiptNo: `REC-${context.familyHead.familyHeadGtId || context.enquiryGroupId}-${paymentId}`,
    createdAt: new Date().toISOString(),
  };
  groupPaymentOverrides[paymentId] = override;
  await persistTourFixture("groupPaymentOverrides");
  const billing = buildGroupBillingPayload(context) || {};
  return {
    success: true,
    groupPaymentDetailId: paymentId,
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    balance: billing.balance,
    data: override,
    message: "Payment recorded successfully",
  };
};

const listGroupBillingSnapshots = () => {
  const directory = buildFamilyHeadDirectory();
  if (!directory.length) {
    return [];
  }
  return directory
    .map((familyHead) => {
      const context = resolveFamilyHeadContext({
        enquiryGroupId: familyHead.enquiryGroupId,
        familyHeadGtId: familyHead.familyHeadGtId,
      });
      if (!context.familyHead || !context.tour) {
        return null;
      }
      const billing = buildGroupBillingPayload(context);
      return billing
        ? {
            enquiryGroupId: context.enquiryGroupId,
            familyHead: context.familyHead,
            tour: context.tour,
            billing,
          }
        : null;
    })
    .filter(Boolean);
};

const findGroupPaymentEntry = (groupPaymentDetailId) => {
  const paymentId = toPositiveInt(groupPaymentDetailId, null);
  if (!paymentId) {
    return null;
  }
  const snapshots = listGroupBillingSnapshots();
  for (const snapshot of snapshots) {
    const payment = snapshot.billing.advancePayments.find(
      (entry) => Number(entry.groupPaymentDetailId) === paymentId
    );
    if (payment) {
      return { ...snapshot, payment };
    }
  }
  return null;
};

const getGroupBillView = ({ enquiryGroupId, familyHeadGtId } = {}) => {
  const context = resolveFamilyHeadContext({ enquiryGroupId, familyHeadGtId });
  if (!context.familyHead || !context.tour) {
    return { data: {}, message: "Family head data not found" };
  }
  const data = buildGroupBillingPayload(context);
  return {
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    data,
    message: "Group bill fetched successfully",
  };
};

const getGroupNewPaymentDetails = ({ groupPaymentDetailId } = {}) => {
  const context = findGroupPaymentEntry(groupPaymentDetailId);
  if (!context) {
    return { message: "Group payment detail not found" };
  }
  return {
    groupPaymentDetailId: context.payment.groupPaymentDetailId,
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    advancePayment: context.payment.advancePayment,
    paymentMode: context.payment.paymentModeName,
    paymentModeName: context.payment.paymentModeName,
    onlineTypeName: context.payment.onlineTypeName,
    bankName: context.payment.bankName,
    chequeNo: context.payment.chequeNo,
    paymentDate: context.payment.paymentDate,
    transactionId: context.payment.transactionId,
    transactionProof: context.payment.transactionProof,
    status: context.payment.status,
    message: "Group payment detail fetched successfully",
  };
};

const updateGroupPaymentStatus = async ({
  groupPaymentDetailId,
  enquiryGroupId,
  familyHeadGtId,
} = {}) => {
  const paymentId = toPositiveInt(groupPaymentDetailId, null);
  if (!paymentId) {
    const error = new Error("groupPaymentDetailId is required");
    error.status = 400;
    throw error;
  }
  const context = findGroupPaymentEntry(paymentId);
  const override = getGroupPaymentOverride(paymentId);
  const resolvedEnquiryId =
    override.enquiryGroupId || context?.enquiryGroupId || toPositiveInt(enquiryGroupId, null) || deriveEnquiryIdFromPayment(paymentId);
  const resolvedFamilyHeadId =
    override.familyHeadGtId || context?.familyHead?.familyHeadGtId || toPositiveInt(familyHeadGtId, null) || Number(`${resolvedEnquiryId}1`);

  override.status = 1;
  override.paymentDate = formatDateOnly(new Date());
  override.enquiryGroupId = resolvedEnquiryId;
  override.familyHeadGtId = resolvedFamilyHeadId;
  override.advancePayment =
    toNumber(override.advancePayment, null) ?? context?.payment?.advancePayment ?? 0;
  override.paymentModeId = override.paymentModeId || context?.payment?.paymentModeId || 1;
  override.paymentModeName = override.paymentModeName || context?.payment?.paymentModeName || "Online";
  override.onlineTypeId = override.onlineTypeId || context?.payment?.onlineTypeId || 1;
  override.onlineTypeName = override.onlineTypeName || context?.payment?.onlineTypeName || "UPI";
  override.bankName = override.bankName || context?.payment?.bankName || "Waari Payments Bank";
  override.transactionId = override.transactionId || context?.payment?.transactionId || `TXN${paymentId}`;
  override.transactionProof =
    override.transactionProof || context?.payment?.transactionProof || `${DOCUMENT_BASE_URL}/payments/${paymentId}.pdf`;

  groupPaymentOverrides[paymentId] = override;
  await persistTourFixture("groupPaymentOverrides");
  return {
    groupPaymentDetailId: paymentId,
    enquiryGroupId: resolvedEnquiryId,
    familyHeadGtId: resolvedFamilyHeadId,
    message: "Group payment status updated successfully",
  };
};

const getGroupReceiptDetails = ({ groupPaymentDetailId, familyHeadGtId } = {}) => {
  const context = findGroupPaymentEntry(groupPaymentDetailId);
  if (!context) {
    return { message: "Receipt not found" };
  }
  const requestedHeadId = toPositiveInt(familyHeadGtId, null);
  if (requestedHeadId && Number(context.familyHead.familyHeadGtId) !== requestedHeadId) {
    return { message: "Receipt not found" };
  }
  const paxCount = resolveGroupPaxCount(context.tour);
  const nights = toPositiveInt(context.tour.night ?? context.tour.nights, null) || Math.max(1, context.tour.days - 1 || 4);
  const days = toPositiveInt(context.tour.days, null) || nights + 1;
  return {
    groupPaymentDetailId: context.payment.groupPaymentDetailId,
    enquiryGroupId: context.enquiryGroupId,
    familyHeadGtId: context.familyHead.familyHeadGtId,
    receiptNo: context.payment.receiptNo || `REC-${context.payment.groupPaymentDetailId}`,
    paymentDate: context.payment.paymentDate,
    paymentMode: context.payment.paymentModeName,
    transactionMode: context.payment.onlineTypeName || "",
    transactionId: context.payment.transactionId || "",
    bankName: context.payment.bankName || "",
    chequeNo: context.payment.chequeNo || "",
    billingName: context.billing.billingName,
    address: context.billing.address,
    phoneNo: context.billing.phoneNumber,
    gstIn: context.billing.gstIn,
    gstin: context.billing.gstIn,
    panNo: context.billing.panNumber,
    destination: context.tour.destinationName || "Group Tour",
    tourName: context.tour.tourName,
    groupName: context.tour.groupName || context.tour.tourName,
    night: nights,
    nights,
    days,
    adults: paxCount,
    child: Math.max(0, Math.floor(paxCount / 4)),
    advancePayment: context.payment.advancePayment,
    message: "Group receipt fetched successfully",
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

const getStoredCallFollowUps = (enquiryGroupId) => {
  const id = toPositiveInt(enquiryGroupId, null);
  if (!id) {
    return [];
  }
  const stored = Array.isArray(groupCallFollowUps[id]) ? groupCallFollowUps[id] : [];
  return stored.map((entry, index) => {
    const statusMeta = resolveCallStatusMeta(entry.callStatusId);
    return {
      callFollowUpId: entry.callFollowUpId || Number(`${id}${index + 51}`),
      enquiryGroupId: id,
      callStatusId: statusMeta.callStatusId,
      callStatusName: entry.callStatusName || statusMeta.callStatusName,
      callSummary: entry.callSummary || `Discussed ${statusMeta.callStatusName.toLowerCase()}`,
      currentFollowUpDate: entry.currentFollowUpDate || formatDateOnly(startOfToday()),
      currentFollowUpTime: entry.currentFollowUpTime || "10:00",
      nextFollowUpDate: entry.nextFollowUpDate || formatDateOnly(startOfToday()),
      nextFollowUpTime: entry.nextFollowUpTime || "10:00",
    };
  });
};

const getStoredCustomCallFollowUps = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return [];
  }
  const stored = Array.isArray(customCallFollowUps[id]) ? customCallFollowUps[id] : [];
  return stored.map((entry, index) => {
    const statusMeta = resolveCallStatusMeta(entry.callStatusId);
    return {
      callFollowUpId: entry.callFollowUpId || Number(`${id}${index + 51}`),
      enquiryCustomId: id,
      callStatusId: statusMeta.callStatusId,
      callStatusName: entry.callStatusName || statusMeta.callStatusName,
      callSummary: entry.callSummary || `Discussed ${statusMeta.callStatusName.toLowerCase()}`,
      currentFollowUpDate: entry.currentFollowUpDate || formatDateOnly(startOfToday()),
      currentFollowUpTime: entry.currentFollowUpTime || "10:00",
      nextFollowUpDate: entry.nextFollowUpDate || formatDateOnly(startOfToday()),
      nextFollowUpTime: entry.nextFollowUpTime || "10:00",
      assignedUserId: entry.assignedUserId || DEFAULT_FOLLOW_UP_USER_ID,
      assignedUserName: entry.assignedUserName || "Waari Custom Team",
    };
  });
};

const buildCallFollowHistory = (enquiryGroupId) => {
  const stored = getStoredCallFollowUps(enquiryGroupId);
  const tour = resolveGroupTourRecord(enquiryGroupId);
  if (!tour) {
    return stored;
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
  return stored.length ? [...stored, ...history] : history;
};

const buildCustomCallFollowHistory = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return [];
  }
  const detail = buildCustomEnquiryDetail(id);
  if (!detail) {
    return [];
  }
  const stored = getStoredCustomCallFollowUps(id);
  const callCount = Math.max(1, Math.min(5, Math.ceil(resolveCustomTotalPax(detail) / 2)));
  const baseDate = toDate(detail.startDate) || new Date();
  const assignedUserId = toPositiveInt(detail.assignedUserId, DEFAULT_FOLLOW_UP_USER_ID) || DEFAULT_FOLLOW_UP_USER_ID;
  const assignedUserName = detail.assignedUserName || "Waari Custom Team";
  const history = [];
  for (let index = 0; index < callCount; index += 1) {
    const current = new Date(baseDate);
    current.setDate(current.getDate() - (callCount - index));
    const next = new Date(current);
    next.setDate(next.getDate() + (index + 1));
    const status = DEFAULT_CALL_STATUS_OPTIONS[index % DEFAULT_CALL_STATUS_OPTIONS.length];
    history.push({
      callFollowUpId: Number(`${id}${index + 1}`),
      enquiryCustomId: id,
      callStatusId: status.callStatusId,
      callStatusName: status.callStatusName,
      callSummary: `Discussed ${detail.groupName || detail.destinationName || "itinerary"} updates`,
      currentFollowUpDate: formatDateString(current),
      currentFollowUpTime: formatTimeString(current),
      nextFollowUpDate: formatDateString(next),
      nextFollowUpTime: formatTimeString(next),
      assignedUserId,
      assignedUserName,
    });
  }
  return stored.length ? [...stored, ...history] : history;
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

const listCustomCallFollowHistory = (enquiryCustomId) => {
  const id = toPositiveInt(enquiryCustomId, null);
  const data = buildCustomCallFollowHistory(id);
  return {
    enquiryCustomId: id,
    total: data.length,
    data,
    message: data.length
      ? "Call follow-up history fetched successfully"
      : "No follow-up history available for this enquiry",
  };
};

const saveGroupCallFollowUp = async ({ enquiryGroupId, callStatusId, callSummary, nextFollowUpDate, nextFollowUpTime } = {}) => {
  const id = toPositiveInt(enquiryGroupId, null);
  if (!id) {
    const error = new Error("enquiryGroupId is required");
    error.status = 400;
    throw error;
  }
  const statusMeta = resolveCallStatusMeta(callStatusId);
  const summary = toStringValue(callSummary) || `Discussed ${statusMeta.callStatusName.toLowerCase()} status`;
  const now = new Date();
  const followUpDate = normalizeFollowUpDate(nextFollowUpDate, addDaysToDate(now, 2));
  const followUpTime = toStringValue(nextFollowUpTime) || "10:00";
  const detail = buildGroupEnquiryDetail(id) || {};
  const record = {
    callFollowUpId: Number(`${id}${Date.now().toString().slice(-4)}`),
    enquiryGroupId: id,
    callStatusId: statusMeta.callStatusId,
    callStatusName: statusMeta.callStatusName,
    callSummary: summary,
    currentFollowUpDate: formatDateOnly(now),
    currentFollowUpTime: formatTimeString(now),
    nextFollowUpDate: followUpDate,
    nextFollowUpTime: followUpTime,
    assignedUserId: detail.assignedUserId || DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: detail.assignedUserName || "Waari Team",
  };
  const existing = Array.isArray(groupCallFollowUps[id]) ? groupCallFollowUps[id] : [];
  existing.unshift(record);
  groupCallFollowUps[id] = existing.slice(0, 25);
  await persistTourFixture("groupCallFollowUps");
  return {
    message: "Call follow-up saved successfully",
    data: record,
  };
};

const saveCustomCallFollowUp = async ({ enquiryCustomId, callStatusId, callSummary, nextFollowUpDate, nextFollowUpTime } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    const error = new Error("enquiryCustomId is required");
    error.status = 400;
    throw error;
  }
  const statusMeta = resolveCallStatusMeta(callStatusId);
  const summary = toStringValue(callSummary) || `Discussed ${statusMeta.callStatusName.toLowerCase()} status`;
  const now = new Date();
  const followUpDate = normalizeFollowUpDate(nextFollowUpDate, addDaysToDate(now, 2));
  const followUpTime = toStringValue(nextFollowUpTime) || "10:00";
  const detail = buildCustomEnquiryDetail(id) || {};
  const record = {
    callFollowUpId: Number(`${id}${Date.now().toString().slice(-4)}`),
    enquiryCustomId: id,
    callStatusId: statusMeta.callStatusId,
    callStatusName: statusMeta.callStatusName,
    callSummary: summary,
    currentFollowUpDate: formatDateOnly(now),
    currentFollowUpTime: formatTimeString(now),
    nextFollowUpDate: followUpDate,
    nextFollowUpTime: followUpTime,
    assignedUserId: detail.assignedUserId || DEFAULT_FOLLOW_UP_USER_ID,
    assignedUserName: detail.assignedUserName || "Waari Custom Team",
  };
  const existing = Array.isArray(customCallFollowUps[id]) ? customCallFollowUps[id] : [];
  existing.unshift(record);
  customCallFollowUps[id] = existing.slice(0, 25);
  await persistTourFixture("customCallFollowUps");
  return {
    message: "Call follow-up saved successfully",
    data: record,
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

const getCustomTotalCallCount = (enquiryCustomId) => {
  const detail = buildCustomEnquiryDetail(enquiryCustomId);
  const history = buildCustomCallFollowHistory(enquiryCustomId);
  const resolvedId = detail?.enquiryCustomId || toPositiveInt(enquiryCustomId, null) || 0;
  const fallbackName = resolvedId ? `Custom Enquiry ${resolvedId}` : "Custom Tour";
  const groupName = detail?.groupName || detail?.tourName || detail?.destinationName || fallbackName;
  return {
    enquiryCustomId: resolvedId,
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

const getCustomPaymentDetails = ({ enquiryCustomId, enquiryDetailCustomId } = {}) => {
  const context = resolveCustomFamilyHeadContext({ enquiryCustomId, enquiryDetailCustomId });
  if (!context.enquiryCustomId) {
    return {
      enquiryCustomId: null,
      enquiryDetailCustomId: null,
      total: 0,
      data: [],
      message: "No payment bill data available",
    };
  }
  const detail = context.detail || buildCustomEnquiryDetail(context.enquiryCustomId) || {
    enquiryCustomId: context.enquiryCustomId,
    enquiryDetailCustomId: context.enquiryDetailCustomId,
  };
  const defaultSummary = {
    enquiryCustomId: detail.enquiryCustomId,
    grandTotal: 0,
    advancePayment: 0,
    balance: 0,
    uniqueEnqueryId: detail.uniqueEnqueryId || `CT-${detail.enquiryCustomId || 1}`,
  };
  const summary = resolveCustomPaymentSummary(detail.enquiryCustomId) || defaultSummary;
  const existingContext = resolveCustomBillingContext(detail.enquiryCustomId);
  const billingDetail = existingContext?.detail || detail;
  const billingSummary = existingContext?.summary || summary;
  const billing = existingContext?.billing || buildCustomBillingData(billingDetail, billingSummary);
  const totalPax = resolveCustomTotalPax(billingDetail);
  const paxPerHead = Math.max(1, context.familyHead?.paxPerHead || totalPax);
  const ratio = totalPax ? Math.min(1, paxPerHead / totalPax) : 1;
  const paidAmount = billing.advancePayments
    .filter((payment) => Number(payment.status) === 1)
    .reduce((total, payment) => total + toNumber(payment.advancePayment, 0), 0);
  const grandTotalShare = toNumber(billing.grandTotal, 0) * ratio;
  const paidShare = paidAmount * ratio;
  const balanceShare = Math.max(0, grandTotalShare - paidShare);
  const guestName = context.familyHead
    ? [context.familyHead.preFixName, context.familyHead.firstName, context.familyHead.lastName]
        .filter((value) => value && value.toString().trim())
        .join(" ")
        .trim()
    : billing.billingName;
  const record = {
    enquiryCustomId: billingDetail?.enquiryCustomId || detail.enquiryCustomId,
    enquiryDetailCustomId:
      context.familyHead?.enquiryDetailCustomId ||
      billingDetail?.enquiryDetailCustomId ||
      detail.enquiryDetailCustomId ||
      context.enquiryDetailCustomId,
    guestName,
    paxPerHead,
    grandTotal: Number(grandTotalShare.toFixed(2)),
    advancePayment: Number(paidShare.toFixed(2)),
    balance: Number(balanceShare.toFixed(2)),
  };
  const hasRecord = Boolean(record.enquiryCustomId);
  return {
    enquiryCustomId: record.enquiryCustomId,
    enquiryDetailCustomId: record.enquiryDetailCustomId,
    total: hasRecord ? 1 : 0,
    data: hasRecord ? [record] : [],
    message: hasRecord ? "Payment bill fetched successfully" : "No payment bill data available",
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

const getCustomTourCompletionStatus = ({ enquiryCustomId } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return {
      enquiryCustomId: null,
      enquiryDetailCustomId: null,
      completionStatusCount: 0,
      message: "Custom tour completion status fetched successfully",
    };
  }
  const billingContext = resolveCustomBillingContext(id);
  if (!billingContext) {
    return {
      enquiryCustomId: id,
      enquiryDetailCustomId: null,
      completionStatusCount: 1,
      message: "Custom tour completion status fetched successfully",
    };
  }
  const familyHeads = listCustomFamilyHeadData({ enquiryCustomId: id }).data;
  const followUps = buildCustomCallFollowHistory(id);
  const advancePayments = billingContext.billing.advancePayments || [];
  let completionStatusCount = 1;
  if (familyHeads.length) {
    completionStatusCount += 1;
  }
  if (followUps.length) {
    completionStatusCount += 1;
  }
  if (advancePayments.some((payment) => Number(payment.status) === 1)) {
    completionStatusCount += 1;
  }
  if (billingContext.billing.balance <= 0) {
    completionStatusCount += 1;
  }
  if (followUps.length > 2) {
    completionStatusCount += 1;
  }
  completionStatusCount = Math.min(6, completionStatusCount);
  return {
    enquiryCustomId: billingContext.detail.enquiryCustomId,
    enquiryDetailCustomId: billingContext.detail.enquiryDetailCustomId,
    completionStatusCount,
    message: "Custom tour completion status fetched successfully",
  };
};

const getGroupEnquiryStatus = ({ enquiryGroupId } = {}) => {
  const tour = resolveGroupTourRecord(enquiryGroupId);
  if (!tour) {
    return {
      enquiryGroupId: toPositiveInt(enquiryGroupId, null),
      isFamilyHeadData: false,
      isPaymentDone: false,
      message: "Enquiry status fetched successfully",
    };
  }
  const resolvedId = tour.groupTourId;
  const overrides = Array.isArray(groupFamilyHeadOverrides[resolvedId]) ? groupFamilyHeadOverrides[resolvedId] : [];
  const isFamilyHeadData = overrides.length > 0;
  const paymentResponse = getGroupPaymentDetails({ enquiryGroupId: resolvedId });
  const paymentRecord = paymentResponse.data[0] || {};
  const paymentCleared = paymentRecord.balance !== undefined ? paymentRecord.balance <= 0 : false;
  const isPaymentDone = paymentCleared || isFamilyHeadData;
  return {
    enquiryGroupId: resolvedId,
    isFamilyHeadData,
    isPaymentDone,
    message: "Enquiry status fetched successfully",
  };
};

const getCustomEnquiryStatus = ({ enquiryCustomId } = {}) => {
  const id = toPositiveInt(enquiryCustomId, null);
  if (!id) {
    return {
      enquiryCustomId: null,
      isFamilyHeadData: false,
      isPaymentDone: false,
      isPackageConfirm: false,
      message: "Enquiry status fetched successfully",
    };
  }
  const familyHeads = listCustomFamilyHeadData({ enquiryCustomId: id }).data;
  const billingContext = resolveCustomBillingContext(id);
  const isPaymentDone = billingContext ? billingContext.billing.balance <= 0 : false;
  const detail = billingContext ? billingContext.detail : buildCustomEnquiryDetail(id);
  const packages = customEnquiryPackages[id];
  const isPackageConfirm =
    (Array.isArray(packages) && packages.length > 0) || Boolean(detail && detail.isPackageConfirm);
  return {
    enquiryCustomId: id,
    isFamilyHeadData: familyHeads.length > 0,
    isPaymentDone,
    isPackageConfirm,
    message: "Enquiry status fetched successfully",
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

const listHotelCategories = () => {
  const source = Array.isArray(hotelCategories) && hotelCategories.length
    ? hotelCategories
    : DEFAULT_HOTEL_CATEGORY_OPTIONS;
  return source.map((entry, index) => ({
    hotelCatId: entry.hotelCatId || entry.id || index + 1,
    hotelCatName: entry.hotelCatName || entry.name || entry.title || `Category ${index + 1}`,
  }));
};

const listNamePrefixes = () => (namePrefixes.length ? namePrefixes : DEFAULT_NAME_PREFIXES);

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

const parseIdList = (input) => {
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
  const numeric = toPositiveInt(input, null);
  return numeric ? [numeric] : [];
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
  getPlanEnquiryUserDataGt,
  getPlanEnquiryUserDataCt,
  assignUserToPlanEnquiryGt,
  assignUserToPlanEnquiryCt,
  listAssignToUsers,
  listGuestsDirectory,
  listAllGuestsDirectory,
  searchAllGuestsDirectory,
  searchGuestEmails,
  addGuestUser,
  createGroupTourEnquiry,
  updateGroupTourEnquiry,
  updateLoyaltyStatus,
  getGuestTravelDetails,
  getGuestLoyaltyHistory,
  getRefereeGuestCounts,
  getAllRefereeGuestCounts,
  getRefereeGuestSales,
  getAllRefereeGuestSales,
  listLoyaltyGuests,
  listAllLoyaltyGuests,
  listBillingBirthdayGuests,
  getGroupTourCountMetric,
  getGuestCountMetric,
  getLoyaltyBookingMetric,
  getWelcomeBookingMetric,
  getReferralRateMetric,
  getMoreBookingCounts,
  listSalesProfitSummary,
  getBookingSalesAmountGraphCt,
  getCustomProfitMetrics,
  getTotalBillingSummary,
  getTotalBillApprovedSummary,
  getTotalBillPendingSummary,
  listWebsiteContactEntries,
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
  getCommissionReport,
  listWaariSelectReport,
  downloadWaariSelectReport,
  listTopSalesPartners,
  getMonthlyTargetGraphGt,
  getGroupTargetSummary,
  getGroupEnquiryGraphStats,
  getGroupEnquiryTable,
  getMonthlyTargetGraphCt,
  getCustomTargetSummary,
  getCustomEnquiryGraphStats,
  getCustomEnquiryTable,
  listFutureEnquiryAllListing,
  listFutureEnquirySelfListing,
  listPendingGroupPayments,
  listPendingCustomPayments,
  listConfirmedCustomPayments,
  listGroupTourDropdown,
  listPriorityOptions,
  listHotelCategories,
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
  getGroupEnquiryDetails,
  getGroupEnquiryStatus,
  getCustomEnquiryStatus,
  listFamilyHeadData,
  listCustomFamilyHeadData,
  saveFamilyHeadDetails,
  getFamilyHeadEnquiryDetail,
  listFamilyHeadRoomShare,
  listCustomFamilyHeadRoomShare,
  listRoomPriceOptions,
  listTravelModeOptions,
  listGroupGuestsForCancellation,
  listCustomGuestsForCancellation,
  getGroupCancellationProcessData,
  getCustomCancellationProcessData,
  getFamilyHeadGuestDetails,
  getCustomGuestDetails,
  listGuestDocumentRecords,
  listCustomGuestDocumentRecords,
  getGuestCouponUsage,
  getCustomGuestCouponUsage,
  checkGuestExists,
  listPaymentModeOptions,
  listOnlineTypeOptions,
  listCardTypeOptions,
  listVoucherTypeOptions,
  listCustomVouchers,
  uploadCustomVouchers,
  getGroupTourCostDetails,
  getCustomTourCostDetails,
  getGroupPaymentDetails,
  getCustomPaymentDetails,
  getPaymentCalculationDetails,
  getCustomPaymentCalculationDetails,
  getGroupBillView,
  receiveGroupBill,
  getGroupNewPaymentDetails,
  updateGroupPaymentStatus,
  getGroupReceiptDetails,
  getGroupTourCompletionStatus,
  getCustomTourCompletionStatus,
  getGroupTotalCallCount,
  getCustomTotalCallCount,
  listCallStatusOptions,
  listCallFollowHistory,
  listCustomCallFollowHistory,
  saveGroupCallFollowUp,
  saveCustomCallFollowUp,
  uploadGroupRefundProof,
  uploadCustomRefundProof,
  cancelGroupEnquiry,
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
  getCustomBillView,
  listCustomNewPayments,
  getCustomReceiptDetails,
  updateCustomPaymentStatus,
  listGroupTourGuests,
  listGroupGuestDetails,
  listCustomGuestDetails,
};
