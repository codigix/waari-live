const tourTypes = [
  { tourTypeId: 1, tourTypeName: "Signature Group Tour", category: "GROUP" },
  { tourTypeId: 2, tourTypeName: "Family Explorer", category: "GROUP" },
  { tourTypeId: 3, tourTypeName: "Tailor-Made Journey", category: "TAILOR_MADE" },
  { tourTypeId: 4, tourTypeName: "Customized Experience", category: "CUSTOMIZED" },
  { tourTypeId: 5, tourTypeName: "Luxury Expedition", category: "TAILOR_MADE" }
];

const cities = [
  { citiesId: 1, citiesName: "Mumbai" },
  { citiesId: 2, citiesName: "Panaji" },
  { citiesId: 3, citiesName: "Los Angeles" },
  { citiesId: 4, citiesName: "Paris" },
  { citiesId: 5, citiesName: "Tokyo" },
  { citiesId: 6, citiesName: "Cape Town" }
];

const destinations = [
  {
    destinationId: 1,
    destinationName: "Domestic India",
    region: "India",
    currency: "INR",
    isInternational: false,
    defaultDepartureCity: "Mumbai",
    gstRate: 5
  },
  {
    destinationId: 2,
    destinationName: "International Europe",
    region: "Europe",
    currency: "EUR",
    isInternational: true,
    defaultDepartureCity: "Paris",
    gstRate: 0
  },
  {
    destinationId: 3,
    destinationName: "International Asia Pacific",
    region: "APAC",
    currency: "USD",
    isInternational: true,
    defaultDepartureCity: "Singapore",
    gstRate: 0
  }
];

const vehicles = [
  { vehicleId: 1, vehicleName: "AC Volvo Coach", seatingCapacity: 45, category: "Coach" },
  { vehicleId: 2, vehicleName: "Mini Luxury Coach", seatingCapacity: 27, category: "Coach" },
  { vehicleId: 3, vehicleName: "SUV Fleet", seatingCapacity: 6, category: "Private" },
  { vehicleId: 4, vehicleName: "Premium Sedan", seatingCapacity: 3, category: "Private" }
];

const mealPlans = [
  { mealPlanId: 1, mealPlanName: "CP (Breakfast)", description: "Breakfast only" },
  { mealPlanId: 2, mealPlanName: "MAP (Breakfast + Dinner)", description: "Two meals" },
  { mealPlanId: 3, mealPlanName: "AP (All Meals)", description: "Breakfast, Lunch, Dinner" }
];

const mealTypes = [
  { mealTypeId: 1, mealTypeName: "Vegetarian" },
  { mealTypeId: 2, mealTypeName: "Jain" },
  { mealTypeId: 3, mealTypeName: "Non-Vegetarian" },
  { mealTypeId: 4, mealTypeName: "Kids Menu" }
];

const kitchens = [
  { kitchenId: 1, kitchenName: "Waari Signature Kitchen", location: "Mumbai" },
  { kitchenId: 2, kitchenName: "Global Gourmet Lab", location: "Paris" },
  { kitchenId: 3, kitchenName: "Goa Coastal Kitchen", location: "Panaji" }
];

const departureTypes = [
  {
    departureTypeId: 1,
    destinationId: 1,
    departureTypeName: "Fixed Departure",
    departureName: "Fixed Departure",
  },
  {
    departureTypeId: 2,
    destinationId: 1,
    departureTypeName: "Private Charter",
    departureName: "Private Charter",
  },
  {
    departureTypeId: 3,
    destinationId: 2,
    departureTypeName: "Seasonal Departure",
    departureName: "Seasonal Departure",
  },
  {
    departureTypeId: 4,
    destinationId: 2,
    departureTypeName: "Signature Departure",
    departureName: "Signature Departure",
  },
  {
    departureTypeId: 5,
    destinationId: 3,
    departureTypeName: "Custom Departure",
    departureName: "Custom Departure",
  },
];

const countries = [
  { countryId: 1, destinationId: 1, countryName: "India", isoCode: "IN" },
  { countryId: 2, destinationId: 2, countryName: "France", isoCode: "FR" },
  { countryId: 3, destinationId: 2, countryName: "Switzerland", isoCode: "CH" },
  { countryId: 4, destinationId: 3, countryName: "Singapore", isoCode: "SG" },
  { countryId: 5, destinationId: 3, countryName: "Australia", isoCode: "AU" }
];

const groupTours = [
  {
    groupTourId: 101,
    tourName: "Bali Paradise",
    tourCode: "BAL-001",
    tourTypeId: 1,
    tourTypeName: "Signature Group Tour",
    category: "GROUP",
    startDate: "2025-02-10",
    endDate: "2025-02-17",
    travelMonth: "2025-02",
    days: 7,
    night: 6,
    duration: "7D-6N",
    totalDuration: 7,
    totalSeats: 40,
    seatsBook: 18,
    seatsAval: 22,
    departureType: "Fixed",
    cityId: 1,
    cityName: "Mumbai",
    pdfUrl: "/uploads/sample/bali-paradise.pdf",
    status: "PUBLISHED",
    workflowStage: "TOUR_PUBLISHED"
  },
  {
    groupTourId: 102,
    tourName: "Goa Monsoon Escape",
    tourCode: "GOA-045",
    tourTypeId: 2,
    tourTypeName: "Family Explorer",
    category: "GROUP",
    startDate: "2025-07-05",
    endDate: "2025-07-09",
    travelMonth: "2025-07",
    days: 5,
    night: 4,
    duration: "5D-4N",
    totalDuration: 5,
    totalSeats: 32,
    seatsBook: 28,
    seatsAval: 4,
    departureType: "Fixed",
    cityId: 2,
    cityName: "Panaji",
    pdfUrl: "/uploads/sample/goa-escape.pdf",
    status: "PUBLISHED",
    workflowStage: "TOUR_PUBLISHED"
  },
  {
    groupTourId: 103,
    tourName: "Swiss Peaks",
    tourCode: "SWI-118",
    tourTypeId: 1,
    tourTypeName: "Signature Group Tour",
    category: "GROUP",
    startDate: "2025-09-12",
    endDate: "2025-09-19",
    travelMonth: "2025-09",
    days: 8,
    night: 7,
    duration: "8D-7N",
    totalDuration: 8,
    totalSeats: 28,
    seatsBook: 9,
    seatsAval: 19,
    departureType: "Fixed",
    cityId: 4,
    cityName: "Paris",
    pdfUrl: "/uploads/sample/swiss-peaks.pdf",
    status: "PUBLISHED",
    workflowStage: "TOUR_PUBLISHED"
  },
  {
    groupTourId: 201,
    tourName: "Andaman Explorer",
    tourCode: "AND-233",
    tourTypeId: 2,
    tourTypeName: "Family Explorer",
    category: "GROUP",
    startDate: "2025-03-04",
    endDate: "2025-03-08",
    travelMonth: "2025-03",
    days: 5,
    night: 4,
    duration: "5D-4N",
    totalDuration: 5,
    totalSeats: 24,
    seatsBook: 6,
    seatsAval: 18,
    departureType: "Fixed",
    cityId: 1,
    cityName: "Mumbai",
    pdfUrl: "/uploads/sample/andaman-explorer.pdf",
    status: "DRAFT",
    workflowStage: "ENQUIRY"
  },
  {
    groupTourId: 202,
    tourName: "Meghalaya Trails",
    tourCode: "MEG-154",
    tourTypeId: 2,
    tourTypeName: "Family Explorer",
    category: "GROUP",
    startDate: "2025-04-18",
    endDate: "2025-04-24",
    travelMonth: "2025-04",
    days: 7,
    night: 6,
    duration: "7D-6N",
    totalDuration: 7,
    totalSeats: 30,
    seatsBook: 12,
    seatsAval: 18,
    departureType: "Fixed",
    cityId: 5,
    cityName: "Tokyo",
    pdfUrl: "/uploads/sample/meghalaya-trails.pdf",
    status: "DRAFT",
    workflowStage: "ENQUIRY_FOLLOW_UP"
  }
];

const tailorMadeTours = [
  {
    tailorMadeId: 601,
    tourName: "Nordic Aurora Trail",
    tourCode: "TM-NA-2025",
    tourTypeId: 3,
    tourTypeName: "Tailor-Made Journey",
    category: "TAILOR_MADE",
    startDate: "2025-11-05",
    endDate: "2025-11-14",
    travelMonth: "2025-11",
    days: 10,
    night: 9,
    duration: "10D-9N",
    totalSeats: 12,
    seatsBook: 8,
    departureType: "Custom",
    cityId: 4,
    cityName: "Paris",
    pdfUrl: "/uploads/sample/nordic-aurora.pdf",
    status: "PUBLISHED",
    workflowStage: "TOUR_PUBLISHED",
    allowFreeTextItinerary: true
  },
  {
    tailorMadeId: 602,
    tourName: "Safari Crafted",
    tourCode: "TM-SA-778",
    tourTypeId: 5,
    tourTypeName: "Luxury Expedition",
    category: "TAILOR_MADE",
    startDate: "2025-08-20",
    endDate: "2025-08-28",
    travelMonth: "2025-08",
    days: 9,
    night: 8,
    duration: "9D-8N",
    totalSeats: 14,
    seatsBook: 5,
    departureType: "Custom",
    cityId: 6,
    cityName: "Cape Town",
    pdfUrl: "/uploads/sample/safari-crafted.pdf",
    status: "PUBLISHED",
    workflowStage: "ENQUIRY_FOLLOW_UP",
    allowFreeTextItinerary: true
  },
  {
    tailorMadeId: 603,
    tourName: "Tokyo Artisan Trail",
    tourCode: "TM-TK-321",
    tourTypeId: 3,
    tourTypeName: "Tailor-Made Journey",
    category: "TAILOR_MADE",
    startDate: "2025-05-02",
    endDate: "2025-05-09",
    travelMonth: "2025-05",
    days: 8,
    night: 7,
    duration: "8D-7N",
    totalSeats: 10,
    seatsBook: 6,
    departureType: "Custom",
    cityId: 5,
    cityName: "Tokyo",
    pdfUrl: "/uploads/sample/tokyo-artisan.pdf",
    status: "CONFIRMED",
    workflowStage: "CONFIRMED",
    allowFreeTextItinerary: true
  }
];

const customTours = [
  {
    enquiryCustomId: 301,
    uniqueEnqueryId: "CT-2025-0001",
    groupName: "Goa Adventure Group",
    tourType: "Customized Experience",
    category: "CUSTOMIZED",
    startDate: "2025-03-12",
    endDate: "2025-03-16",
    travelMonth: "2025-03",
    days: 4,
    nights: 3,
    duration: "4D-3N",
    cityId: 2,
    cityName: "Panaji",
    status: "ENQUIRY",
    workflowStage: "ENQUIRY"
  },
  {
    enquiryCustomId: 302,
    uniqueEnqueryId: "CT-2025-0002",
    groupName: "Paris Couture",
    tourType: "Customized Experience",
    category: "CUSTOMIZED",
    startDate: "2025-05-20",
    endDate: "2025-05-26",
    travelMonth: "2025-05",
    days: 7,
    nights: 6,
    duration: "7D-6N",
    cityId: 4,
    cityName: "Paris",
    status: "ENQUIRY_FOLLOW_UP",
    workflowStage: "ENQUIRY_FOLLOW_UP"
  },
  {
    enquiryCustomId: 303,
    uniqueEnqueryId: "CT-2025-0003",
    groupName: "California Innovators",
    tourType: "Customized Experience",
    category: "CUSTOMIZED",
    startDate: "2025-06-15",
    endDate: "2025-06-22",
    travelMonth: "2025-06",
    days: 8,
    nights: 7,
    duration: "8D-7N",
    cityId: 3,
    cityName: "Los Angeles",
    status: "CONFIRMED",
    workflowStage: "CONFIRMED"
  }
];

module.exports = {
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
  customTours
};
