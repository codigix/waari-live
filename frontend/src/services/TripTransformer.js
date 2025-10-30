import moment from "moment";

/**
 * Transform backend tour data to frontend-friendly format
 */
export const transformGroupTourData = (tour) => {
  if (!tour) return null;

  return {
    // Original fields for reference (do NOT spread at end - it overwrites our formatted dates!)
    ...tour,
    // Overwrite with formatted/transformed fields
    groupTourId: tour.groupTourId,
    tourName: tour.tourName || "N/A",
    tourCode: tour.tourCode || "N/A",
    tourTypeName: tour.tourTypeName || "N/A",
    startDate: tour.startDate
      ? moment(tour.startDate).format("DD-MM-YYYY")
      : "N/A",
    endDate: tour.endDate ? moment(tour.endDate).format("DD-MM-YYYY") : "N/A",
    duration: tour.days && tour.night ? `${tour.days}D-${tour.night}N` : "N/A",
    totalSeats: tour.totalSeats || 0,
    seatsBook: tour.seatsBook || 0,
    seatsAval: (tour.totalSeats || 0) - (tour.seatsBook || 0),
  };
};

export const transformTailorMadeTourData = (tour) => {
  if (!tour) return null;

  return {
    // Original fields for reference (do NOT spread at end - it overwrites our formatted dates!)
    ...tour,
    // Overwrite with formatted/transformed fields
    uniqueEnqueryId: tour.uniqueEnqueryId || tour.enquiryId || "N/A",
    groupName: tour.groupName || "N/A",
    tourType: tour.tourType || "Custom",
    startDate: tour.startDate
      ? moment(tour.startDate).format("DD-MM-YYYY")
      : "N/A",
    endDate: tour.endDate ? moment(tour.endDate).format("DD-MM-YYYY") : "N/A",
    duration:
      tour.days && tour.nights ? `${tour.days}D-${tour.nights}N` : "N/A",
  };
};

/**
 * Format multiple tours
 */
export const transformGroupTours = (tours) => {
  if (!Array.isArray(tours)) return [];
  return tours.map(transformGroupTourData);
};

export const transformTailorMadeTours = (tours) => {
  if (!Array.isArray(tours)) return [];
  return tours.map(transformTailorMadeTourData);
};
