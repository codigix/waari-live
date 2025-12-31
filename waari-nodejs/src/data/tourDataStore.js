const tourTypes = [];
const cities = [];
const destinations = [];
const vehicles = [];
const mealPlans = [];
const mealTypes = [];
const kitchens = [];
const departureTypes = [];
const countries = [];
const priorities = [];
const namePrefixes = [];
const enquiryReferences = [];
const guestReferenceDropdown = [];
const groupTourEnquiries = [];
const groupTours = [];
const tailorMadeTours = [];
const customTours = [];
const states = [];
const customEnquiryDetailTemplate = {
  enquiryCustomId: null,
  uniqueEnqueryId: "",
  groupName: "",
  contactName: "",
  contact: "",
  mailId: "",
  destinationId: null,
  destinationName: "",
  countryId: null,
  countryName: "",
  stateId: null,
  stateName: "",
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
  mealPlanId: null,
  mealPlanName: "",
  hotelCatId: null,
  hotelCatName: "",
  enquiryReferId: null,
  enquiryReferName: "",
  guestRefId: "",
  priorityId: null,
  priorityName: "",
  budgetPerPerson: "",
  notes: "",
  nextFollowUp: "",
  requirements: [],
  experiences: [],
  travelReason: "",
  specialOccasion: "",
  destinationHighlights: [],
  isRework: false,
  isEnqNonEditable: false,
  workflowStage: "",
  status: "",
  createdAt: null,
  updatedAt: null,
};
const customEnquiryDetails = {};
const customPackageTemplate = [];
const customEnquiryPackages = {};
const roomSharingPriceTemplate = [];
const tailorMadeHotelPriceTemplate = [];
const skeletonItineraryTemplate = [];
const detailedItineraryTemplate = [];
const grouptourItineraryImagesTemplate = {};
const flightDetailsTemplate = [];
const trainDetailsTemplate = [];
const dtodTemplate = {
  startCity: "",
  pickUpMeetTime: "",
  endCity: "",
  dropOffPoint: "",
  pickUpMeet: "",
  arriveBefore: "",
  dropOffTime: "",
  bookAfter: "",
};
const inclusionsTemplate = [];
const exclusionsTemplate = [];
const notesTemplate = [];
const groupTourDetailOverrides = {};
const tailorMadeDetailOverrides = {};
const groupTourGuestTemplate = [];
const groupTourGuests = {};

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
  groupTourGuests,
};
