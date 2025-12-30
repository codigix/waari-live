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

const priorities = [
  { priorityId: 1, priorityName: "Low" },
  { priorityId: 2, priorityName: "Medium" },
  { priorityId: 3, priorityName: "High" },
  { priorityId: 4, priorityName: "Urgent" }
];

const namePrefixes = [
  { preFixId: 1, preFixName: "Mr." },
  { preFixId: 2, preFixName: "Ms." },
  { preFixId: 3, preFixName: "Mrs." },
  { preFixId: 4, preFixName: "Dr." }
];

const enquiryReferences = [
  { enquiryReferId: 1, enquiryReferName: "Existing Guest" },
  { enquiryReferId: 2, enquiryReferName: "Waari Website" },
  { enquiryReferId: 3, enquiryReferName: "Instagram" },
  { enquiryReferId: 4, enquiryReferName: "Referral" },
  { enquiryReferId: 5, enquiryReferName: "Offline Campaign" },
  { enquiryReferId: 6, enquiryReferName: "Corporate Partner" },
  { enquiryReferId: 7, enquiryReferName: "Walk In" },
  { enquiryReferId: 8, enquiryReferName: "Sales Outreach" },
  { enquiryReferId: 9, enquiryReferName: "Waari Guest Reference" }
];

const guestReferenceDropdown = [
  {
    guestRefId: "GUEST-2025-0901",
    firstName: "Riya",
    lastName: "Patel",
    email: "riya.patel@example.com",
    phone: "+91 98765 43210"
  },
  {
    guestRefId: "GUEST-2025-1122",
    firstName: "Elena",
    lastName: "Moreau",
    email: "elena.moreau@example.com",
    phone: "+33 612 345 678"
  },
  {
    guestRefId: "GUEST-2025-7788",
    firstName: "Marcus",
    lastName: "Lee",
    email: "marcus.lee@example.com",
    phone: "+1 415 800 1200"
  },
  {
    guestRefId: "GUEST-2025-4455",
    firstName: "Ananya",
    lastName: "Shah",
    email: "ananya.shah@example.com",
    phone: "+91 90000 11111"
  }
];

const groupTourEnquiries = [
  {
    enquiryGroupId: 5001,
    groupTourId: 101,
    groupName: "Bali Paradise Delegation",
    guestName: "Ananya Sharma",
    countryCode: "+91",
    contact: "9987612345",
    mail: "ananya.sharma@example.com",
    adults: 4,
    child: 1,
    nextFollowUp: "2025-01-20",
    nextFollowUpTime: "11:00 AM",
    enquiryReferId: 3,
    enquiryReferName: "Instagram",
    priorityId: 3,
    priorityName: "High",
    guestRefId: "GUEST-2025-0901",
    status: "ENQUIRY",
    workflowStage: "ENQUIRY_FOLLOW_UP",
    totalPax: 5,
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2025-01-05T10:00:00.000Z",
  },
  {
    enquiryGroupId: 5002,
    groupTourId: 102,
    groupName: "Goa Monsoon Family",
    guestName: "Vikram Rao",
    countryCode: "+91",
    contact: "9987011122",
    mail: "vikram.rao@example.com",
    adults: 2,
    child: 2,
    nextFollowUp: "2025-01-18",
    nextFollowUpTime: "03:30 PM",
    enquiryReferId: 2,
    enquiryReferName: "Waari Website",
    priorityId: 2,
    priorityName: "Medium",
    guestRefId: "GUEST-2025-4455",
    status: "ENQUIRY",
    workflowStage: "ENQUIRY",
    totalPax: 4,
    createdAt: "2025-01-08T15:00:00.000Z",
    updatedAt: "2025-01-08T15:00:00.000Z",
  },
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

const states = [
  { stateId: 1, stateName: "Maharashtra", countryId: 1 },
  { stateId: 2, stateName: "Goa", countryId: 1 },
  { stateId: 3, stateName: "Île-de-France", countryId: 2 },
  { stateId: 4, stateName: "Tokyo Prefecture", countryId: 5 },
  { stateId: 5, stateName: "Meghalaya", countryId: 1 }
];

const customEnquiryDetailTemplate = {
  enquiryCustomId: null,
  uniqueEnqueryId: "CT-2025-0000",
  groupName: "Waari Guests",
  contactName: "Primary Contact",
  contact: "+91 90000 00000",
  mailId: "guest@waari.com",
  destinationId: destinations[0].destinationId,
  destinationName: destinations[0].destinationName,
  countryId: countries[0].countryId,
  countryName: countries[0].countryName,
  stateId: states[0].stateId,
  stateName: states[0].stateName,
  startDate: null,
  endDate: null,
  travelMonth: "",
  days: 0,
  nights: 0,
  duration: "",
  adults: 0,
  child: 0,
  age: [],
  cityIds: [],
  cities: "[]",
  cityDetails: [],
  rooms: 0,
  extraBed: 0,
  familyHeadNo: 0,
  mealPlanId: mealPlans[0].mealPlanId,
  mealPlanName: mealPlans[0].mealPlanName,
  hotelCatId: 1,
  hotelCatName: "4 Star",
  enquiryReferId: 1,
  enquiryReferName: "Existing Guest",
  guestRefId: "GUEST-0000",
  priorityId: 2,
  priorityName: "Medium",
  budgetPerPerson: "0",
  notes: "",
  nextFollowUp: "",
  requirements: [],
  experiences: [],
  travelReason: "Leisure",
  specialOccasion: "",
  destinationHighlights: [],
  isRework: false,
  isEnqNonEditable: false,
  workflowStage: "ENQUIRY",
  status: "ENQUIRY",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const customEnquiryDetails = {
  301: {
    uniqueEnqueryId: "CT-2025-0001",
    groupName: "Goa Adventure Group",
    contactName: "Riya Patel",
    contact: "+91 98765 43210",
    mailId: "riya.patel@example.com",
    destinationId: 1,
    countryId: 1,
    stateId: 2,
    cityIds: [2],
    startDate: "2025-03-12",
    endDate: "2025-03-16",
    travelMonth: "2025-03",
    days: 4,
    nights: 3,
    duration: "4D-3N",
    adults: 18,
    child: 6,
    age: [5, 7, 9],
    rooms: 8,
    extraBed: 3,
    familyHeadNo: 5,
    mealPlanId: 2,
    mealPlanName: "MAP (Breakfast + Dinner)",
    hotelCatId: 2,
    hotelCatName: "4 Star Beach Resort",
    enquiryReferId: 3,
    enquiryReferName: "Instagram",
    guestRefId: "GUEST-2025-0901",
    priorityId: 3,
    priorityName: "High",
    notes: "Need beachfront dinners and adventure water sports.",
    nextFollowUp: "2025-02-18",
    requirements: ["Scuba session", "Sunset cruise", "Private DJ night"],
    experiences: ["Beach", "Nightlife"],
    travelReason: "Corporate Offsite",
    specialOccasion: "Annual Awards",
    destinationHighlights: ["Baga Beach", "Old Goa Churches"],
    budgetPerPerson: "45000",
    isRework: false,
    isEnqNonEditable: false,
    workflowStage: "ENQUIRY",
    status: "ENQUIRY",
    createdAt: "2025-01-05T10:00:00.000Z",
    updatedAt: "2025-01-10T08:00:00.000Z",
  },
  302: {
    uniqueEnqueryId: "CT-2025-0002",
    groupName: "Paris Couture",
    contactName: "Elena Moreau",
    contact: "+33 612 345 678",
    mailId: "elena.moreau@example.com",
    destinationId: 2,
    countryId: 2,
    stateId: 3,
    cityIds: [4],
    startDate: "2025-05-20",
    endDate: "2025-05-26",
    travelMonth: "2025-05",
    days: 7,
    nights: 6,
    duration: "7D-6N",
    adults: 10,
    child: 2,
    age: [8, 11],
    rooms: 6,
    extraBed: 2,
    familyHeadNo: 4,
    mealPlanId: 1,
    mealPlanName: "CP (Breakfast)",
    hotelCatId: 3,
    hotelCatName: "Luxury Palace",
    enquiryReferId: 2,
    enquiryReferName: "Waari Website",
    guestRefId: "GUEST-2025-1122",
    priorityId: 4,
    priorityName: "Urgent",
    notes: "Include couture atelier experiences and Michelin dinners.",
    nextFollowUp: "2025-04-05",
    requirements: ["Private fashion walkthrough", "Seine yacht dinner"],
    experiences: ["Gastronomy", "Fashion"],
    travelReason: "Luxury Celebration",
    specialOccasion: "Silver Jubilee",
    destinationHighlights: ["Eiffel Tower", "Louvre Museum"],
    budgetPerPerson: "185000",
    isRework: true,
    isEnqNonEditable: false,
    workflowStage: "ENQUIRY_FOLLOW_UP",
    status: "ENQUIRY_FOLLOW_UP",
    createdAt: "2025-02-12T09:30:00.000Z",
    updatedAt: "2025-02-25T14:10:00.000Z",
  },
  303: {
    uniqueEnqueryId: "CT-2025-0003",
    groupName: "California Innovators",
    contactName: "Marcus Lee",
    contact: "+1 415 800 1200",
    mailId: "marcus.lee@example.com",
    destinationId: 3,
    countryId: 5,
    stateId: 4,
    cityIds: [5],
    startDate: "2025-06-15",
    endDate: "2025-06-22",
    travelMonth: "2025-06",
    days: 8,
    nights: 7,
    duration: "8D-7N",
    adults: 22,
    child: 0,
    age: [],
    rooms: 12,
    extraBed: 0,
    familyHeadNo: 8,
    mealPlanId: 3,
    mealPlanName: "AP (All Meals)",
    hotelCatId: 2,
    hotelCatName: "Design Hotel",
    enquiryReferId: 4,
    enquiryReferName: "Referral",
    guestRefId: "GUEST-2025-7788",
    priorityId: 2,
    priorityName: "Medium",
    notes: "Need innovation workshops and sake tasting.",
    nextFollowUp: "2025-04-28",
    requirements: ["Tech studio visit", "Local craft workshop"],
    experiences: ["Culture", "Technology"],
    travelReason: "Learning Expedition",
    specialOccasion: "Product Launch",
    destinationHighlights: ["Akihabara", "Mt. Fuji"],
    budgetPerPerson: "125000",
    isRework: false,
    isEnqNonEditable: true,
    workflowStage: "CONFIRMED",
    status: "CONFIRMED",
    createdAt: "2025-02-01T11:45:00.000Z",
    updatedAt: "2025-02-20T16:20:00.000Z",
  }
};

const customPackageTemplate = [
  {
    packageCustomId: 9101,
    enquiryCustomId: null,
    packageName: "Signature Escape",
    packageLabel: "Option 1",
    package: "/uploads/sample/custom-package.pdf",
    adult: 52000,
    extraBed: 39000,
    childWithout: 27000,
    childWith: 31000,
    isFinal: 2,
    isRework: false,
    createdAt: "2025-01-12T09:00:00.000Z",
  },
];

const customEnquiryPackages = {
  301: [
    {
      packageCustomId: 9201,
      enquiryCustomId: 301,
      packageName: "Beachside Bliss",
      packageLabel: "Option 1",
      package: "/uploads/sample/goa-package-option-1.pdf",
      adult: 48000,
      extraBed: 35000,
      childWithout: 24000,
      childWith: 26500,
      isFinal: 2,
      isRework: false,
      createdAt: "2025-01-15T10:00:00.000Z",
    },
    {
      packageCustomId: 9202,
      enquiryCustomId: 301,
      packageName: "Luxury Lagoon",
      packageLabel: "Option 2",
      package: "/uploads/sample/goa-package-option-2.pdf",
      adult: 53500,
      extraBed: 41000,
      childWithout: 28000,
      childWith: 30500,
      isFinal: 1,
      isRework: false,
      createdAt: "2025-01-20T09:00:00.000Z",
    },
  ],
  302: [
    {
      packageCustomId: 9301,
      enquiryCustomId: 302,
      packageName: "Paris Haute",
      packageLabel: "Option 1",
      package: "/uploads/sample/paris-package-option-1.pdf",
      adult: 192000,
      extraBed: 138000,
      childWithout: 105000,
      childWith: 118000,
      isFinal: 2,
      isRework: true,
      createdAt: "2025-02-18T13:30:00.000Z",
    },
  ],
  303: [
    {
      packageCustomId: 9401,
      enquiryCustomId: 303,
      packageName: "Tokyo Visionaries",
      packageLabel: "Option 1",
      package: "/uploads/sample/tokyo-package-option-1.pdf",
      adult: 132000,
      extraBed: 99000,
      childWithout: 78000,
      childWith: 0,
      isFinal: 1,
      isRework: false,
      createdAt: "2025-02-22T08:45:00.000Z",
    },
    {
      packageCustomId: 9402,
      enquiryCustomId: 303,
      packageName: "Tokyo Visionaries Plus",
      packageLabel: "Option 2",
      package: "/uploads/sample/tokyo-package-option-2.pdf",
      adult: 145000,
      extraBed: 110000,
      childWithout: 85000,
      childWith: 0,
      isFinal: 2,
      isRework: false,
      createdAt: "2025-02-25T10:15:00.000Z",
    },
  ],
};

const roomSharingPriceTemplate = [
  { roomShareId: 1, roomShareName: "Adult Single Sharing", tourPrice: 95000, offerPrice: 91000, commissionPrice: 8000 },
  { roomShareId: 2, roomShareName: "Adult Double Sharing", tourPrice: 78000, offerPrice: 74000, commissionPrice: 7000 },
  { roomShareId: 3, roomShareName: "Adult Triple Sharing", tourPrice: 72000, offerPrice: 69000, commissionPrice: 6000 },
  { roomShareId: 4, roomShareName: "Child with Mattress (5-11)", tourPrice: 56000, offerPrice: 53000, commissionPrice: 4500 },
  { roomShareId: 5, roomShareName: "Child without Mattress (5-11)", tourPrice: 48000, offerPrice: 45500, commissionPrice: 4000 },
  { roomShareId: 6, roomShareName: "Child (2-4)", tourPrice: 36000, offerPrice: 33500, commissionPrice: 2500 },
  { roomShareId: 7, roomShareName: "Infant", tourPrice: 12000, offerPrice: 11000, commissionPrice: 1000 },
  { roomShareId: 8, roomShareName: "Adult Quad Sharing", tourPrice: 64000, offerPrice: 61000, commissionPrice: 5500 }
];

const tailorMadeHotelPriceTemplate = [
  {
    type: 0,
    roomShareId: 1,
    roomShareName: "Deluxe City Haven",
    hotelName: "Deluxe City Haven",
    tourPrice: 98000,
    offerPrice: 94000,
    commissionPrice: 8000
  },
  {
    type: 0,
    roomShareId: 2,
    roomShareName: "Deluxe Fjord Escape",
    hotelName: "Deluxe Fjord Escape",
    tourPrice: 102000,
    offerPrice: 96500,
    commissionPrice: 8200
  },
  {
    type: 1,
    roomShareId: 3,
    roomShareName: "Super Deluxe Summit",
    hotelName: "Super Deluxe Summit",
    tourPrice: 128000,
    offerPrice: 121000,
    commissionPrice: 9500
  },
  {
    type: 1,
    roomShareId: 4,
    roomShareName: "Super Deluxe Artisan",
    hotelName: "Super Deluxe Artisan",
    tourPrice: 134000,
    offerPrice: 127500,
    commissionPrice: 9800
  },
  {
    type: 2,
    roomShareId: 5,
    roomShareName: "Premium Aurora Villa",
    hotelName: "Premium Aurora Villa",
    tourPrice: 168000,
    offerPrice: 159000,
    commissionPrice: 12000
  },
  {
    type: 2,
    roomShareId: 6,
    roomShareName: "Premium Couture Residence",
    hotelName: "Premium Couture Residence",
    tourPrice: 182000,
    offerPrice: 172500,
    commissionPrice: 13000
  }
];

const skeletonItineraryTemplate = [
  {
    destination: "Mumbai",
    overnightAt: "Mumbai",
    hotelName: "Waari Grand",
    hotelAddress: "Nariman Point"
  },
  {
    destination: "Destination City",
    overnightAt: "Premium Resort",
    hotelName: "Ocean View Retreat",
    hotelAddress: "Beach Road"
  }
];

const detailedItineraryTemplate = [
  {
    title: "Arrival & Sunset Cruise",
    distance: "20 km",
    description:
      "<p>Welcome to your Waari experience. Check in, refresh and head for a private sunset cruise with gourmet canapés.</p>",
    nightStayAt: "Beach Resort",
    mealTypeId: ["Breakfast", "Dinner"],
    fromCity: "Home City",
    toCity: "Destination City",
    approxTravelTime: "6 hrs",
    bannerImage: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1080&h=770&dpr=1",
    hotelImage: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&dpr=1",
    grouptouritineraryimages: [
      {
        itineraryImageName: "Sunset Cruise",
        itineraryImageUrl: "https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=600",
        type: 0
      }
    ]
  },
  {
    title: "Cultural Discovery & Culinary Trail",
    distance: "45 km",
    description:
      "<p>Explore iconic heritage spots, savour chef-curated meals and unwind with traditional performances in the evening.</p>",
    nightStayAt: "City Hotel",
    mealTypeId: ["Breakfast", "Lunch", "Dinner"],
    fromCity: "Destination City",
    toCity: "Countryside",
    approxTravelTime: "3 hrs",
    bannerImage: "https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1080&h=770&dpr=1",
    hotelImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=500&h=400&dpr=1",
    grouptouritineraryimages: [
      {
        itineraryImageName: "Cultural Walk",
        itineraryImageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
        type: 0
      },
      {
        itineraryImageName: "Boutique Stay",
        itineraryImageUrl: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600",
        type: 1
      }
    ]
  }
];

const grouptourItineraryImagesTemplate = {
  0: [
    {
      itineraryImageName: "Temple Walk",
      itineraryImageUrl: "https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=600",
      type: 0
    },
    {
      itineraryImageName: "Cliff Views",
      itineraryImageUrl: "https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg?auto=compress&cs=tinysrgb&w=600",
      type: 0
    }
  ],
  1: [
    {
      itineraryImageName: "Resort Infinity Pool",
      itineraryImageUrl: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
      type: 1
    },
    {
      itineraryImageName: "Luxury Suite",
      itineraryImageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
      type: 1
    }
  ]
};

const flightDetailsTemplate = [
  {
    journey: "Onward",
    flight: "WA-101",
    airline: "Waari Air",
    class: "Economy",
    from: "Mumbai",
    fromDate: "2025-02-10",
    fromTime: "06:45",
    to: "Denpasar",
    toDate: "2025-02-10",
    toTime: "15:05",
    weight: "25 KG"
  },
  {
    journey: "Return",
    flight: "WA-102",
    airline: "Waari Air",
    class: "Economy",
    from: "Denpasar",
    fromDate: "2025-02-17",
    fromTime: "18:30",
    to: "Mumbai",
    toDate: "2025-02-17",
    toTime: "23:55",
    weight: "25 KG"
  }
];

const trainDetailsTemplate = [
  {
    journey: "Onwards",
    trainNo: "12001",
    trainName: "Waari Express",
    from: "Mumbai",
    fromDate: "2025-02-10",
    fromTime: "05:30",
    to: "Delhi",
    toDate: "2025-02-10",
    toTime: "13:30"
  },
  {
    journey: "Returns",
    trainNo: "12002",
    trainName: "Waari Express",
    from: "Delhi",
    fromDate: "2025-02-17",
    fromTime: "19:00",
    to: "Mumbai",
    toDate: "2025-02-18",
    toTime: "03:30"
  }
];

const dtodTemplate = {
  startCity: "Mumbai",
  pickUpMeetTime: "06:30",
  endCity: "Mumbai",
  dropOffPoint: "International Airport",
  pickUpMeet: "Waari Concierge Desk",
  arriveBefore: "05:30",
  dropOffTime: "23:00",
  bookAfter: "Relax at the lounge"
};

const inclusionsTemplate = [
  { description: "Airport transfers in luxury coach" },
  { description: "Daily breakfast and dinner" },
  { description: "Waari tour manager and local guide" },
  { description: "Entrance fees to monuments as per itinerary" }
];

const exclusionsTemplate = [
  { description: "GST & TCS as applicable" },
  { description: "Personal expenses, tips & porterage" },
  { description: "Anything not mentioned in inclusions" }
];

const notesTemplate = [
  { description: "Sequence of itinerary may change based on operational viability" },
  { description: "All flights and hotels are tentative until final confirmation" }
];

const groupTourDetailOverrides = {
  101: {
    destinationId: 3,
    countryId: 4,
    stateId: 4,
    vehicleId: 3,
    mealPlanId: 3,
    mealTypeId: 3,
    kitchenId: 2,
    cityIds: [1, 4],
    startCity: "Mumbai",
    endCity: "Bali",
    pickUpMeet: "International Departures",
    dropOffPoint: "Denpasar Airport",
    uniqueExperience: "Private sunset cruise",
    shopping: "Artisan markets and beach clubs",
    weather: "Tropical 28°C",
    tourManager: "Rohit Iyer",
    managerNo: "9820098200",
    websiteDescription:
      "<p>Experience Bali in Waari style with curated stays, culinary surprises and tropical adventures crafted for small groups.</p>",
    bgImage: "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  102: {
    destinationId: 1,
    countryId: 1,
    stateId: 2,
    vehicleId: 2,
    mealPlanId: 2,
    mealTypeId: 1,
    kitchenId: 3,
    cityIds: [2, 5],
    startCity: "Panaji",
    endCity: "Goa",
    pickUpMeet: "Panaji Coach Point",
    dropOffPoint: "Dabolim Airport",
    uniqueExperience: "Backwater sunset dinner",
    shopping: "Local flea markets and spice stores",
    weather: "Pleasant 26°C",
    tourManager: "Anita D'Souza",
    managerNo: "9930099300",
    websiteDescription:
      "<p>Celebrate the monsoon magic of Goa with curated stays, heritage walks and coastal flavours.</p>",
    bgImage: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/450597/pexels-photo-450597.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  103: {
    destinationId: 2,
    countryId: 2,
    stateId: 3,
    vehicleId: 1,
    mealPlanId: 1,
    mealTypeId: 2,
    kitchenId: 1,
    cityIds: [4],
    startCity: "Paris",
    endCity: "Swiss Alps",
    uniqueExperience: "Glacier express with masterchef menu",
    shopping: "Luxury boutiques and cheese farms",
    weather: "Cool 12°C",
    tourManager: "Marie Dubois",
    managerNo: "+33155501234",
    websiteDescription:
      "<p>Witness Swiss peaks, lakes and Alpine gastronomy with Waari's European specialists.</p>",
    bgImage: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=600"
  }
};

const tailorMadeDetailOverrides = {
  601: {
    destinationId: 2,
    countryId: 2,
    stateId: 3,
    vehicleId: 4,
    mealPlanId: 3,
    mealTypeId: 3,
    kitchenId: 2,
    cityIds: [4, 5],
    startCity: "Paris",
    endCity: "Tromsø",
    pickUpMeet: "Charles de Gaulle T2",
    dropOffPoint: "Tromsø Airport",
    uniqueExperience: "Private aurora chase with astrophotographer",
    shopping: "Nordic boutiques and Sami craft markets",
    weather: "Arctic nights -5°C",
    tourManager: "Ingrid Solberg",
    managerNo: "+47 9012 3344",
    websiteDescription:
      "<p>Chase the Northern Lights with bespoke igloo stays, Sami storytelling and fjord gastronomy.</p>",
    bgImage: "https://images.pexels.com/photos/258112/pexels-photo-258112.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=1080",
    tailormadeinclusions: [
      { description: "Aurora analyst desk with live alerts" },
      { description: "Heated glass igloo stay at Saariselkä" },
      { description: "Private snowmobile expedition" }
    ],
    tailormadeexclusions: [
      { description: "International airfare" },
      { description: "Optional winter gear rentals" }
    ],
    notes: [
      { note: "Thermal wear is mandatory below -10°C" },
      { note: "Aurora sightings depend on space weather" }
    ],
    visaDocuments: "Schengen visa supporting documents",
    visaFee: "7200",
    visaInstruction: "Submit biometrics 30 days prior",
    visaAlerts: "Processing delays expected during winter rush",
    insuranceDetails: "Comprehensive Arctic evacuation cover included",
    euroTrainDetails: "Scenic Nordic rail segment on day 4",
    nriOriForDetails: "Carry OCI/PIO cards for faster immigration"
  },
  602: {
    destinationId: 1,
    countryId: 1,
    stateId: 5,
    vehicleId: 3,
    mealPlanId: 2,
    mealTypeId: 1,
    kitchenId: 1,
    cityIds: [6],
    startCity: "Cape Town",
    endCity: "Kruger Reserve",
    pickUpMeet: "V&A Waterfront concierge",
    dropOffPoint: "Skukuza Airstrip",
    uniqueExperience: "Conservation-led night safari",
    shopping: "Design studios and artisanal wineries",
    weather: "Mild 22°C winter sun",
    tourManager: "Thandiwe Jacobs",
    managerNo: "+27 82 000 9000",
    websiteDescription:
      "<p>Crafted safaris with private game drives, heli transfers and vineyard picnics.</p>",
    bgImage: "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1080",
    tailormadeinclusions: [
      { description: "Chartered bush flights between reserves" },
      { description: "Reserve fees and twice-daily game drives" },
      { description: "Chef-curated vineyard lunches" }
    ],
    tailormadeexclusions: [
      { description: "Safari guide gratuities" },
      { description: "PCR tests if mandated" }
    ],
    notes: [
      { note: "Luggage limited to 15 kg on bush flights" },
      { note: "Game drives depend on weather" }
    ],
    visaDocuments: "South Africa visa paperwork if applicable",
    visaFee: "3500",
    visaInstruction: "Ensure 2 blank passport pages",
    visaAlerts: "Yellow fever certificate needed if transiting endemic zones",
    insuranceDetails: "Travel insurance with medical evacuation coverage",
    euroTrainDetails: "Not applicable",
    nriOriForDetails: "Indian nationals get visa on arrival for 90 days"
  },
  603: {
    destinationId: 3,
    countryId: 5,
    stateId: 4,
    vehicleId: 4,
    mealPlanId: 1,
    mealTypeId: 2,
    kitchenId: 2,
    cityIds: [5],
    startCity: "Tokyo",
    endCity: "Kyoto",
    pickUpMeet: "Haneda Private Arrivals",
    dropOffPoint: "Kyoto Station",
    uniqueExperience: "Atelier visits with master artisans",
    shopping: "Ginza design houses and Nishiki markets",
    weather: "Spring bloom 18°C",
    tourManager: "Haruto Mori",
    managerNo: "+81 90 1111 2222",
    websiteDescription:
      "<p>Trace Japan's craft heritage with slow travel across Tokyo, Kanazawa and Kyoto.</p>",
    bgImage: "https://images.pexels.com/photos/210547/pexels-photo-210547.jpeg?auto=compress&cs=tinysrgb&w=1080",
    websiteBanner: "https://images.pexels.com/photos/356830/pexels-photo-356830.jpeg?auto=compress&cs=tinysrgb&w=1080",
    tailormadeinclusions: [
      { description: "Shinkansen green-class passes" },
      { description: "Tea ceremony with Urasenke master" },
      { description: "After-hours museum access" }
    ],
    tailormadeexclusions: [
      { description: "Lunches on free exploration days" },
      { description: "Personal shopping spends" }
    ],
    notes: [
      { note: "JR Pass requires passport copies pre-trip" },
      { note: "Some ateliers restrict photography" }
    ],
    visaDocuments: "Japan e-visa documentation",
    visaFee: "2800",
    visaInstruction: "Upload travel itinerary 15 days before arrival",
    visaAlerts: "Appointment slots fill fast during cherry blossom",
    insuranceDetails: "Comprehensive medical and cancellation cover",
    euroTrainDetails: "Not applicable",
    nriOriForDetails: "Carry OCI/PIO proof for smooth re-entry"
  }
};

const groupTourGuestTemplate = [
  {
    guestId: 1,
    familyHeadName: "Ananya Kulkarni",
    gender: "Female",
    contact: "+91 99876 10001",
    address: "Bandra West, Mumbai",
    dob: "1990-05-12",
    adharNo: "XXXX-2201-3388",
    email: "ananya.kulkarni@example.com",
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    guestId: 2,
    familyHeadName: "Vikram Kulkarni",
    gender: "Male",
    contact: "+91 99876 10002",
    address: "Bandra West, Mumbai",
    dob: "1988-10-02",
    adharNo: "XXXX-1133-7799",
    email: "vikram.kulkarni@example.com",
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    guestId: 3,
    familyHeadName: "Reema Shah",
    gender: "Female",
    contact: "+91 99300 66001",
    address: "Vile Parle, Mumbai",
    dob: "1992-01-18",
    adharNo: "XXXX-4411-6699",
    email: "reema.shah@example.com",
    city: "Mumbai",
    state: "Maharashtra"
  },
  {
    guestId: 4,
    familyHeadName: "Aarav Shah",
    gender: "Male",
    contact: "+91 99300 66002",
    address: "Vile Parle, Mumbai",
    dob: "1989-07-22",
    adharNo: "XXXX-7788-2211",
    email: "aarav.shah@example.com",
    city: "Mumbai",
    state: "Maharashtra"
  }
];

const groupTourGuests = {
  101: [
    {
      guestId: 1,
      familyHeadName: "Ananya Kulkarni",
      gender: "Female",
      contact: "+91 99876 10001",
      address: "Bandra West, Mumbai",
      dob: "1990-05-12",
      adharNo: "XXXX-2201-3388",
      email: "ananya.kulkarni@example.com",
      passportNo: "P7896543",
      city: "Mumbai",
      state: "Maharashtra"
    },
    {
      guestId: 2,
      familyHeadName: "Vikram Kulkarni",
      gender: "Male",
      contact: "+91 99876 10002",
      address: "Bandra West, Mumbai",
      dob: "1988-10-02",
      adharNo: "XXXX-1133-7799",
      email: "vikram.kulkarni@example.com",
      passportNo: "P7896544",
      city: "Mumbai",
      state: "Maharashtra"
    },
    {
      guestId: 3,
      familyHeadName: "Reema Shah",
      gender: "Female",
      contact: "+91 99300 66001",
      address: "Vile Parle, Mumbai",
      dob: "1992-01-18",
      adharNo: "XXXX-4411-6699",
      email: "reema.shah@example.com",
      passportNo: "P7896545",
      city: "Mumbai",
      state: "Maharashtra"
    },
    {
      guestId: 4,
      familyHeadName: "Aarav Shah",
      gender: "Male",
      contact: "+91 99300 66002",
      address: "Vile Parle, Mumbai",
      dob: "1989-07-22",
      adharNo: "XXXX-7788-2211",
      email: "aarav.shah@example.com",
      passportNo: "P7896546",
      city: "Mumbai",
      state: "Maharashtra"
    }
  ],
  102: [
    {
      guestId: 1,
      familyHeadName: "Alwin D'Souza",
      gender: "Male",
      contact: "+91 98200 55221",
      address: "Margao, Goa",
      dob: "1985-02-01",
      adharNo: "XXXX-1299-7722",
      email: "alwin.dsouza@example.com",
      city: "Margao",
      state: "Goa"
    },
    {
      guestId: 2,
      familyHeadName: "Clara D'Souza",
      gender: "Female",
      contact: "+91 98200 55222",
      address: "Margao, Goa",
      dob: "1987-11-10",
      adharNo: "XXXX-5588-9900",
      email: "clara.dsouza@example.com",
      city: "Margao",
      state: "Goa"
    },
    {
      guestId: 3,
      familyHeadName: "Savio Fernandes",
      gender: "Male",
      contact: "+91 98200 44112",
      address: "Panaji, Goa",
      dob: "1993-06-17",
      adharNo: "XXXX-7755-9911",
      email: "savio.fernandes@example.com",
      city: "Panaji",
      state: "Goa"
    }
  ],
  103: [
    {
      guestId: 1,
      familyHeadName: "Elise Martin",
      gender: "Female",
      contact: "+33 6 12 34 56 78",
      address: "Paris, France",
      dob: "1984-09-05",
      adharNo: "NA",
      passportNo: "XK1234567",
      email: "elise.martin@example.com",
      city: "Paris",
      state: "Île-de-France"
    },
    {
      guestId: 2,
      familyHeadName: "Luc Moreau",
      gender: "Male",
      contact: "+33 6 22 55 88 44",
      address: "Lyon, France",
      dob: "1982-03-14",
      adharNo: "NA",
      passportNo: "XK1234568",
      email: "luc.moreau@example.com",
      city: "Lyon",
      state: "Auvergne-Rhône-Alpes"
    },
    {
      guestId: 3,
      familyHeadName: "Priya Desai",
      gender: "Female",
      contact: "+41 79 555 2211",
      address: "Zurich, Switzerland",
      dob: "1991-12-22",
      adharNo: "XXXX-3322-6644",
      passportNo: "XK1234569",
      email: "priya.desai@example.com",
      city: "Zurich",
      state: "Zurich"
    }
  ]
};

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
  priorities,
  namePrefixes,
  enquiryReferences,
  guestReferenceDropdown,
  groupTourEnquiries,
  groupTours,
  tailorMadeTours,
  customTours,
  states,
  customEnquiryDetailTemplate,
  customEnquiryDetails,
  customPackageTemplate,
  customEnquiryPackages,
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
  groupTourGuests
};
